import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();

const tasks = [
  {
    input: "static/img/background.png",
    output: "static/img/optimized/background.webp",
    width: 1280,
    height: 720,
    fit: "cover",
    options: { quality: 76 }
  },
  {
    input: "static/img/logo.png",
    output: "static/img/optimized/logo.webp",
    width: 480,
    height: 480,
    fit: "cover",
    options: { quality: 82 }
  },
  {
    input: "static/img/services/mynebula.png",
    output: "static/img/optimized/services/mynebula-card.webp",
    width: 96,
    height: 96,
    fit: "cover",
    options: { quality: 78 }
  },
  {
    input: "static/img/services/ideago.png",
    output: "static/img/optimized/services/ideago-card.webp",
    width: 96,
    height: 96,
    fit: "cover",
    options: { quality: 80 }
  },
  {
    input: "static/img/services/variagen.png",
    output: "static/img/optimized/services/variagen-card.webp",
    width: 96,
    height: 96,
    fit: "cover",
    options: { quality: 78 }
  },
  {
    input: "static/img/services/filecodebox.png",
    output: "static/img/optimized/services/filecodebox-card.webp",
    width: 96,
    height: 96,
    fit: "cover",
    options: { quality: 80 }
  },
  {
    input: "static/img/plugins/zhihu-md.png",
    output: "static/img/optimized/plugins/zhihu-md-card.webp",
    width: 96,
    height: 96,
    fit: "cover",
    options: { quality: 78 }
  }
];

async function optimizeImage(task) {
  const outputPath = path.join(ROOT, task.output);
  await mkdir(path.dirname(outputPath), { recursive: true });

  await sharp(path.join(ROOT, task.input))
    .resize(task.width, task.height, {
      fit: task.fit,
      withoutEnlargement: true
    })
    .webp(task.options)
    .toFile(outputPath);

  console.log(`optimized ${task.input} -> ${task.output}`);
}

await Promise.all(tasks.map(optimizeImage));
