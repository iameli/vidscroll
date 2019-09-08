/**
 * Entrypoint for our CloudFlare worker. Eventually will have bits of the API compiled into it, for now it's
 * just separate.
 */
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import account from "./account";
import Router from "./router";
import uuid from "uuid/v4";
import hash from "../lib/hash";
import store from "./store";
import jwt from "jsonwebtoken";
import makeCloudflareManifest from "./make-cloudflare-manifest";
import ManifestCombiner from "./combine-manifests";

function headersAsObject(inputHeaders) {
  const headers = {};
  const keyVals = [...inputHeaders.entries()];
  keyVals.forEach(([key, val]) => {
    headers[key] = val;
  });
  return headers;
}

// export const mediaRe = new RegExp(
//   `^https://api.cloudflare.com/client/v4/accounts/${account.cloudflareToken}/media/([a-f0-9].+)$`
// );

export const mediaRe = new RegExp(
  `^https://api.cloudflare.com/client/v4/accounts/3f87ea767ec5d156e657206e049a9588/media/([a-f0-9].+)$`
);

/**
 * maps the path of incoming req to the req pathKey to look up
 * in bucket and in cache
 * e.g.  for a path '/' returns '/index.html' which serves
 * the content of bucket/index.html
 * @param {Request} req incoming req
 */
const mapRequestToAsset = req => {
  const parsedUrl = new URL(req.url);
  let pathname = parsedUrl.pathname;
  if (pathname === "/") {
    pathname = "index.html";
  } else {
    const lastSegment = pathname
      .split("/")
      .filter(x => !!x)
      .pop();

    // To handle next.js-style routes, we need to send e.g. /login to /login.html
    if (lastSegment && !lastSegment.includes(".")) {
      pathname = `index.html`;
    }
  }

  parsedUrl.pathname = pathname;
  return new Request(parsedUrl, req);
};

addEventListener("fetch", event => {
  event.respondWith(serveStaticAsset(event));
});

/**
 * Serve a static asset or 404
 */

// Cached value so we don't check on every single req
let isDevelopment = null;

const httpError = (status, text) => {
  return new Response(JSON.stringify({ error: text }), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
};

const jsonResponse = (status, json) => {
  return new Response(JSON.stringify(json), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
};

async function serveStaticAsset(event) {
  try {
    if (isDevelopment === null) {
      isDevelopment = await KV.get("IS_DEVELOPMENT");
    }

    const getUser = async req => {
      const authorization = req.headers.get("authorization");
      if (!authorization) {
        throw httpError(401, "you are not logged in");
      }
      if (!authorization.startsWith("JWT ")) {
        throw new httpError(403, "unrecognized authorization header");
      }
      const token = authorization.slice(4);
      let parsed;
      try {
        parsed = jwt.verify(token, account.signingKey);
      } catch (e) {
        throw new httpError(403, "jwt verification failed");
      }
      const user = await store.get(`user/${parsed.sub}`);
      return user;
    };

    const req = event.request;
    const r = new Router();

    r.options("(.*)", async () => {
      return new Response(200, {
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "*"
        }
      });
    });

    // TUS upload first step: get an upload id
    r.post("/upload", async () => {
      const newHeaders = {
        authorization: `Bearer ${account.cloudflareToken}`,
        accept: "*/*"
      };
      for (const header of [
        "tus-resumable",
        "upload-length",
        "upload-metadata"
      ]) {
        newHeaders[header] = req.headers.get(header);
      }
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account.cloudflareAccountId}/stream`,
        {
          headers: newHeaders,
          method: "POST"
        }
      );
      if (!res.ok) {
        return res;
      }
      const headers = headersAsObject(res.headers);
      const match = headers.location.match(mediaRe);
      if (!match) {
        throw new Error("unexpected response from upstream media provider");
      }
      const id = match[1];
      const selfUrl = new URL(req.url);
      selfUrl.pathname = `${selfUrl.pathname}/${id}`;
      headers.location = `${selfUrl}`;
      return new Response(res, { headers });
    });

    // TUS upload second step: upload it
    r.patch("/upload/:id", async req => {
      const id = req.params.id;
      const headers = headersAsObject(req.headers);
      const newHeaders = {
        authorization: `Bearer ${account.cloudflareToken}`,
        accept: "*/*"
      };
      for (const header of [
        "content-length",
        "content-type",
        "upload-offset",
        "tus-resumable"
      ]) {
        newHeaders[header] = headers[header];
      }

      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account.cloudflareAccountId}/media/${id}`,
        {
          body: req.body,
          headers: newHeaders,
          method: "PATCH"
        }
      );

      return res;
    });

    r.post("/user", async req => {
      const { username, email, password } = await req.json();
      if (!username || !email || !password) {
        return httpError(422, "missing required fields");
      }
      const emailKey = `user-email/${email}`;
      const usernameKey = `user-username/${username}`;
      const existingEmail = await store.get(emailKey);
      if (existingEmail !== null) {
        return httpError(409, `email "${email}" already has an account`);
      }
      const existingUsername = await store.get(usernameKey);
      if (existingUsername !== null) {
        return httpError(409, `there is already a user named "${username}"`);
      }
      const [hashedPassword, salt] = await hash(password);
      const id = uuid();
      const user = {
        id,
        username,
        email,
        password: hashedPassword,
        salt
      };
      await Promise.all([
        store.put(emailKey, { id }),
        store.put(usernameKey, { id }),
        store.put(`user/${user.id}`, user)
      ]);
      return new Response(JSON.stringify({}), {
        status: 201,
        headers: {
          "content-type": "application/json"
        }
      });
    });

    r.post("/user/token", async req => {
      const { username, password } = await req.json();
      if (!username || !password) {
        return httpError(422, "missing username or password");
      }
      const userJoin = await store.get(`user-username/${username}`);
      if (!userJoin) {
        return httpError(404, `user ${username} not found`);
      }
      const user = await store.get(`user/${userJoin.id}`);
      if (!user) {
        throw new Error(
          `data integrity exception: user registered for ${username} does not exist at user/${userJoin.id}`
        );
      }
      const [hashedPassword] = await hash(password, user.salt);
      if (hashedPassword !== user.password) {
        return httpError(403, "incorrect password");
      }
      const token = jwt.sign({ sub: user.id }, account.signingKey, {
        algorithm: "HS256"
      });
      return jsonResponse(201, { id: user.id, username: user.username, token });
    });

    // Current time minus a big constant for sorting in reverse-chrono
    const nowToBack = now => 99999999999999 - now;

    const nowBack = () => {
      const now = Date.now();
      const back = nowToBack(now);
      return [now, back];
    };

    // Make a vid
    r.post("/vid", async req => {
      const user = await getUser(req);
      const { uid } = await req.json();
      const id = uuid();
      const [now, back] = nowBack();
      const vid = {
        id,
        uid,
        createdTime: now,
        userId: user.id,
        time: Date.now()
      };
      const userKey = `user-vids/${user.id}/${back}/${id}`;
      await Promise.all([
        store.put(`vids/${vid.id}`, vid),
        store.put(userKey, {})
      ]);
      return jsonResponse(201, {
        id,
        uid,
        userId: user.id,
        time: Date.now()
      });
    });

    // Publish a vid publicly
    r.post("/vids/:vidId/publish", async req => {
      const { vidId } = req.params;
      const [vid, user] = await Promise.all([
        store.get(`vids/${vidId}`),
        getUser(req)
      ]);
      if (!vid) {
        return httpError(404, "vid not found");
      }
      if (vid.userId !== user.id) {
        return httpError(403, "this is not your vid");
      }
      const manifest = await makeCloudflareManifest(vid.uid);
      await store.put(`vids-manifests/${vid.id}`, manifest);
      const [now, back] = nowBack();
      const newVid = {
        ...vid,
        publishedAt: now,
        published: true
      };
      await Promise.all([
        store.put(`vids-published/${back}/${vid.id}`, {}),
        store.put(`vids/${vid.id}`, newVid)
      ]);
      return jsonResponse(200, manifest);
    });

    r.get("/user/:userId/vids", async req => {
      const vids = await store.list({
        prefix: `user-vids/${req.params.userId}/`
      });
      const ids = vids.map(str => str.split("/")[3]);
      return jsonResponse(200, ids);
    });

    r.get("/vids", async req => {
      const vids = await store.list({
        prefix: `vids-published/`
      });
      const ids = vids.map(str => str.split("/")[2]);
      return jsonResponse(200, ids);
    });

    r.get("/vids/:vidId", async req => {
      const { vidId } = req.params;
      const [vid] = await Promise.all([await store.get(`vids/${vidId}`)]);
      if (!vid) {
        return httpError(404, "vid not found");
      }
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account.cloudflareAccountId}/stream/${vid.uid}`,
        {
          headers: { authorization: `Bearer ${account.cloudflareToken}` }
        }
      );
      const data = await res.json();
      return jsonResponse(200, {
        ...vid,
        stream: data
      });
    });

    // Manifest stuff
    r.get("/:manifestName.m3u8", async req => {
      const newUrl = new URL(req.url);
      newUrl.pathname = "/vids";
      const res = await fetch(newUrl);
      const data = await res.json();
      const manifests = await Promise.all(
        data.map(id => store.get(`vids-manifests/${id}`))
      );
      const webRootUrl = new URL(req.url);
      webRootUrl.pathname = "/stream";
      const combiner = new ManifestCombiner(manifests, {
        webRoot: `${webRootUrl}`
      });
      const str = combiner.get(`${req.params.manifestName}.m3u8`);
      return new Response(str, {
        headers: {
          "content-type": "text/plain",
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,HEAD,OPTIONS"
        }
      });
    });

    r.get("/stream/(.*)", req => {
      const newUrl = new URL(req.url);
      // Strip "/stream"
      newUrl.pathname = newUrl.pathname.slice(7);
      newUrl.protocol = "https";
      newUrl.host = "videodelivery.net";
      newUrl.port = 443;
      return fetch(`${newUrl}`);
    });

    // Fall back to serving static assets
    r.get("(.*)", async req => {
      if (isDevelopment) {
        const newUrl = new URL(req.url);
        newUrl.host = "localhost";
        newUrl.port = 4001;
        const newReq = new Request(newUrl, req);
        return await fetch(newReq);
      }
      try {
        return await getAssetFromKV(event, { mapRequestToAsset });
      } catch (e) {
        let pathname = new URL(req.url).pathname;
        return new Response(`"${pathname}" not found: ${e.message}`, {
          status: 404
        });
      }
    });
    return await r.route(req);
  } catch (e) {
    if (e instanceof Response) {
      return e;
    }
    let message = e;
    if (e.stack) {
      message = e.stack;
    }
    console.error(message);
    return httpError(500, message);
  }
}
