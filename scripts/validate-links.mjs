import { access, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const indexHtml = await readFile(path.join(ROOT, "index.html"), "utf8");

const errors = [];

function normalizeLocalPath(reference) {
  return reference.replace(/^\.\//, "").replace(/^\//, "");
}

async function ensureLocalFile(reference, source) {
  const normalized = normalizeLocalPath(reference.split("?")[0]);
  const filePath = path.join(ROOT, normalized);

  try {
    await access(filePath);
  } catch (error) {
    errors.push(`${source}: missing local file ${reference}`);
  }
}

function ensureExternalUrl(reference, source) {
  try {
    const parsed = new URL(reference);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      errors.push(`${source}: unsupported URL protocol ${reference}`);
    }
  } catch (error) {
    errors.push(`${source}: invalid URL ${reference}`);
  }
}

const localAttributePatterns = [
  { name: "src", pattern: /\s(?:src|href|data-preview-image)="([^"]+)"/g },
  { name: "srcset", pattern: /\ssrcset="([^"]+)"/g }
];

for (const { name, pattern } of localAttributePatterns) {
  for (const match of indexHtml.matchAll(pattern)) {
    const raw = match[1];

    if (!raw || raw.startsWith("#") || raw.startsWith("data:") || raw.startsWith("//")) {
      continue;
    }

    if (raw.includes(",")) {
      const parts = raw.split(",").map((part) => part.trim().split(/\s+/)[0]);
      await Promise.all(
        parts
          .filter((part) => part.startsWith("./") || part.startsWith("/static/"))
          .map((part) => ensureLocalFile(part, `index.html:${name}`))
      );
      continue;
    }

    if (raw.startsWith("./") || raw.startsWith("/static/")) {
      await ensureLocalFile(raw, `index.html:${name}`);
      continue;
    }

    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      ensureExternalUrl(raw, `index.html:${name}`);
    }
  }
}

if (errors.length) {
  console.error("Link validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Link validation passed.");
