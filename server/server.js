import express from "express";
import fs from "fs-extra";
import path from "path";
import proxy from "http-proxy-middleware";
import makePlaylist from "./make-playlist";
import processVids from "./process-vids";

const app = express();

const randomize = arr => {
  const rands = arr.map(() => Math.random());
  return arr
    .map((_, x) => x)
    .sort((a, b) => {
      return rands[a] - rands[b];
    })
    .map(idx => arr[idx]);
};

let playlistProm;

app.get("/vids.json", async (req, res) => {
  const { files } = await playlistProm;
  res.json(files);
});

app.use(express.static(path.resolve(__dirname, "static")));

app.use("/playlist.m3u8", async (req, res) => {
  res.header("content-type", "application/x-mpegURL");
  const { playlist } = await playlistProm;
  res.end(playlist);
});

app.use("/vids", (req, res, next) => {
  // res.header("Cache-Control", "max-age=31536000");
  next();
});

app.get("/vids/:file", async (req, res) => {
  const { outputSequence } = await playlistProm;
  const outputFile = outputSequence[req.params.file];
  if (outputFile) {
    res.sendFile(outputFile.filePath);
    return;
  }
  res.sendFile(path.resolve(__dirname, "processed-vids", req.params.file));
});

// app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.use(proxy({ target: "http://localhost:4001" }));

app.listen(4000);

playlistProm = (async () => {
  console.log("processing videos");
  await processVids();
  console.log("generating playlist");
  return makePlaylist();
})();
