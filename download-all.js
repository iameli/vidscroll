const fs = require("fs-extra");
const path = require("path");
const fetch = require("isomorphic-fetch");

const text = fs.readFileSync("manifest.json");
const data = JSON.parse(text);

const resolve = (root, ...relPath) => {
  const url = new URL(root);
  url.pathname = path.resolve(url.pathname, ...relPath);
  return `${url}`;
};

async function downloadAll() {
  for (const [segmentUrl, manifest] of Object.entries(data)) {
    for (const segment of manifest.segments) {
      const urlString = resolve(segmentUrl, "..", segment.uri);
      const url = new URL(urlString);
      const outPath = path.resolve(
        __dirname,
        "videodelivery.net",
        url.pathname.slice(1)
      );
      const outDir = path.resolve(outPath, "..");
      await fs.ensureDir(outDir);
      const res = await fetch(urlString);
      const blob = await res.buffer();
      await fs.writeFile(outPath, blob);
    }
  }
}

const output = {};
for (const [segmentUrl, manifest] of Object.entries(data)) {
  const [_, uid, prefix, name] = new URL(segmentUrl).pathname.split("/");
  if (!output[uid]) {
    output[uid] = {
      uid,
      master: null,
      media: []
    };
  }
  if (name === "video.m3u8") {
    output[uid].master = manifest;
  } else {
    output[uid].media.push(manifest);
  }
}

console.log(JSON.stringify(output, null, 2));
