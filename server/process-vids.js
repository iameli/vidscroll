import fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import { path as ffmpegPath } from "ffmpeg-static";

const ffmpeg = args =>
  new Promise((resolve, reject) => {
    // console.log(`> ffmpeg ${args.join(" ")}`);
    const proc = spawn(ffmpegPath, args);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", data => {
      stdout += data;
    });

    proc.on("exit", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(
            `ffmpeg exited with code ${code} stdout=${stdout} stderr=${stderr}`
          )
        );
      }
    });
  });

const basename = fullPath => {
  const filename = path.basename(fullPath);
  const split = filename.split(".");
  split.pop();
  return split.join(".");
};

// ffmpeg -i $1 -vframes 1 $1.png
const ensurePng = async (input, outDir) => {
  const outPath = path.resolve(outDir, `${basename(input)}.png`);
  if (await fs.pathExists(outPath)) {
    return;
  }
  await ffmpeg(["-i", input, "-vframes", "1", outPath]);
  console.log(`created ${outPath}`);
};

// ffmpeg -i $1 -c:v copy -c:a copy $1.ts
const ensureTs = async (input, outDir) => {
  const outPath = path.resolve(outDir, `${basename(input)}.ts`);
  if (await fs.pathExists(outPath)) {
    return;
  }
  await ffmpeg(["-i", input, "-c:v", "copy", "-c:a", "copy", outPath]);
  console.log(`created ${outPath}`);
};

export default async function processVids() {
  let files = await fs.readdir(path.resolve(__dirname, "vids"));
  let outDir = path.resolve(__dirname, "processed-vids");
  await fs.ensureDir(outDir);
  files = files
    .filter(name => name.toLowerCase().endsWith(".mp4"))
    .map(name => path.resolve(__dirname, "vids", name));
  for (const file of files) {
    await ensurePng(file, outDir);
    await ensureTs(file, outDir);
  }
}
