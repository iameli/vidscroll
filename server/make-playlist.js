import ffprobe from "ffprobe";
import { path as ffprobePath } from "ffprobe-static";
import fs from "fs-extra";
import path from "path";

export default async () => {
  let files = await fs.readdir(path.resolve(__dirname, "processed-vids"));
  const lines = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    "#EXT-X-MEDIA-SEQUENCE:0",
    "#EXT-X-PLAYLIST-TYPE:VOD",
    "#EXT-X-TARGETDURATION:120",
    "#EXT-X-START:TIME-OFFSET=0,PRECISE=YES"
  ];
  files = files.filter(name => name.endsWith(".ts"));
  let offset = 0;
  let sequence = 0;
  let outputSequence = {};
  files.sort();
  const outputFiles = [];
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const filePath = path.resolve(__dirname, "processed-vids", file);
    const data = await ffprobe(filePath, {
      path: ffprobePath
    });
    const duration = data.streams[0].duration;
    if (i !== 0) {
      lines.push("#EXT-X-DISCONTINUITY");
    }
    lines.push(`#EXTINF:${duration}`);
    const offsetFile = `${sequence}.ts`;
    sequence += 1;
    lines.push(`vids/${offsetFile}`);
    const fileData = {
      offset,
      duration: parseFloat(duration),
      file,
      filePath,
      thumbnail: file.replace(/ts$/, "png"),
      offsetFile
    };
    outputFiles.push(fileData);
    outputSequence[offsetFile] = fileData;
    offset += parseFloat(duration);
  }
  lines.push("#EXT-X-ENDLIST");
  return { playlist: lines.join("\n"), files: outputFiles, outputSequence };
};
