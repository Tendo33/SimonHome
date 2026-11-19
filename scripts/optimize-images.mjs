import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();

const tasks = [
  {
    // Pre-blurred page background: replaces a runtime full-screen backdrop-filter.
    // Blur is baked in, so a small image is enough.
    input: "static/img/background.png",
    output: "static/img/optimized/background-blur.webp",
    width: 1280,
    height: 720,
    fit: "cover",
    blur: 12,
    scaleTo: { width: 640, height: 360 },
    options: { quality: 72 }
  },
  {
    // Social preview image (og:image), instead of the 1 MB source PNG.
    input: "static/img/logo.png",
    output: "static/img/optimized/og-logo.png",
    width: 600,
    height: 600,
    fit: "contain",
    format: "png",
    options: { compressionLevel: 9, palette: true }
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
  },
  {
    // Cards render at 52px; 128 covers 2x displays without shipping a 1932px source.
    input: "static/img/services/apimux.png",
    output: "static/img/optimized/services/apimux-card.webp",
    width: 128,
    height: 128,
    fit: "contain",
    options: { quality: 82 }
  },
  {
    input: "static/img/services/canvas.png",
    output: "static/img/optimized/services/canvas-card.webp",
    width: 128,
    height: 128,
    fit: "contain",
    options: { quality: 82 }
  },
  {
    input: "static/img/services/moodshaker.png",
    output: "static/img/optimized/services/moodshaker-card.webp",
    width: 128,
    height: 128,
    fit: "contain",
    options: { quality: 82 }
  }
];

async function optimizeImage(task) {
  const outputPath = path.join(ROOT, task.output);
  await mkdir(path.dirname(outputPath), { recursive: true });

  let image = sharp(path.join(ROOT, task.input)).resize(task.width, task.height, {
    fit: task.fit,
    withoutEnlargement: true,
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  });

  if (task.blur) {
    // Materialize the resize first so the blur radius is measured at that size.
    image = sharp(await image.blur(task.blur).toBuffer());
  }

  if (task.scaleTo) {
    image = image.resize(task.scaleTo.width, task.scaleTo.height);
  }

  image = task.format === "png" ? image.png(task.options) : image.webp(task.options);
  await image.toFile(outputPath);

  console.log(`optimized ${task.input} -> ${task.output}`);
}

await Promise.all(tasks.map(optimizeImage));
