import fetch from "isomorphic-fetch";
import { Parser } from "m3u8-parser";
import path from "path";

const resolve = (root, ...relPath) => {
  const url = new URL(root);
  url.pathname = path.resolve(url.pathname, ...relPath);
  return `${url}`;
};

const getManifest = async url => {
  console.error(`downloading ${url}`);
  const res = await fetch(url);
  const text = await res.text();
  const parser = new Parser();
  parser.push(text);
  parser.end();
  return parser.manifest;
};

// curl -X GET "https://api.cloudflare.com/client/v4/accounts/3f87ea767ec5d156e657206e049a9588/media" \
//   -H "authorization: Bearer 2cTfFsigQRAKfeyUuGPc_iiYUNu-n1glFXyyEIzQ" \
//   -H "Content-Type: application/json" | jq '.'

export async function fetchAllVideos() {
  const res = await fetch(
    "https://api.cloudflare.com/client/v4/accounts/3f87ea767ec5d156e657206e049a9588/media",
    {
      headers: {
        authorization: "Bearer 2cTfFsigQRAKfeyUuGPc_iiYUNu-n1glFXyyEIzQ",
        "content-type": "application/json"
      }
    }
  );
  if (!res.ok) {
    throw new Error(`http ${res.status}`);
  }
  const data = await res.json();
  if (!data.success) {
    throw new Error(JSON.stringify(res.errors));
  }
  const result = {};
  for (const video of data.result) {
    result[video.uid] = await makeCloudflareManifest(video.uid);
  }
  return result;
}

export default async function makeCloudflareManifest(uid) {
  const result = { uid, mediaGroups: {}, playlists: {} };
  const masterManifestUrl = `https://videodelivery.net/${uid}/manifest/video.m3u8`;
  const masterManifest = await getManifest(masterManifestUrl);
  masterManifest.url = masterManifestUrl;
  result.master = masterManifest;
  const promises = [];
  for (const [type, groups] of Object.entries(masterManifest.mediaGroups)) {
    result.mediaGroups[type] = {};
    for (const [groupId, group] of Object.entries(groups)) {
      result.mediaGroups[type][groupId] = {};
      for (const [name, entry] of Object.entries(group)) {
        const mediaGroupManifestUrl = resolve(
          masterManifestUrl,
          "..",
          entry.uri
        );
        promises.push(
          (async () => {
            result.mediaGroups[type][groupId][name] = await getManifest(
              mediaGroupManifestUrl
            );
          })()
        );
      }
    }
  }
  for (const playlist of masterManifest.playlists) {
    const mediaPlaylistUrl = resolve(masterManifestUrl, "..", playlist.uri);
    promises.push(
      (async () => {
        const mediaManifest = await getManifest(mediaPlaylistUrl);
        mediaManifest.url = mediaPlaylistUrl;
        result.playlists[playlist.uri] = mediaManifest;
      })()
    );
  }
  await Promise.all(promises);
  return result;
}

// if (typeof module === "object" && !module.parent) {
//   fetchAllVideos()
//     .then(result => {
//       console.log(JSON.stringify(result, null, 2));
//     })
//     .catch(err => console.log(err));
// }
