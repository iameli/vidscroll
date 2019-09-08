import { Parser } from "m3u8-parser";

export default function manifestToData(manifest) {
  const parser = new Parser();
  parser.push(manifest);
  parser.end();
  const discontinuityStarts = new Set(parser.manifest.discontinuityStarts);
  let offset = 0;
  let duration = 0;
  const output = [];
  let thumbnail;
  for (let i = 0; i < parser.manifest.segments.length; i += 1) {
    const segment = parser.manifest.segments[i];
    if (discontinuityStarts.has(i)) {
      output.push({
        offset,
        duration,
        thumbnail
      });
      offset += duration;
      duration = 0;
    }
    const url = new URL(segment.uri);
    const [_, stream, uid] = url.pathname.split("/");
    thumbnail = `/stream/${uid}/thumbnails/thumbnail.jpg?time=0s&height=720`;
    duration += segment.duration;
  }
  output.push({
    offset,
    duration,
    thumbnail
  });
  return output;
}
