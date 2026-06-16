#!/usr/bin/env node
/**
 * Generate WebP derivatives for portfolio images.
 * Photography: 800w + 1200w (JPEG-like quality, no alpha needed).
 * AI covers: 256w + 512w (preserve alpha).
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PHOTO_DIR = path.join(ROOT, "public/photography");
const COVER_DIR = path.join(ROOT, "public/ai-covers");

const PHOTO_WIDTHS = [800, 1200];
const COVER_WIDTHS = [256, 512];
const PHOTO_QUALITY = 84;
const COVER_QUALITY = 92;

async function writeWebpVariants(srcPath, widths, quality, keepAlpha) {
  const ext = path.extname(srcPath);
  const stem = srcPath.slice(0, -ext.length);
  const image = sharp(srcPath).rotate();
  const meta = await image.metadata();
  const outputs = [];

  for (const width of widths) {
    const targetWidth = Math.min(width, meta.width ?? width);
    const outPath = `${stem}-${width}.webp`;
    let pipeline = sharp(srcPath).rotate().resize({
      width: targetWidth,
      withoutEnlargement: true,
      fit: "inside",
    });

    if (keepAlpha) {
      pipeline = pipeline.webp({ quality, alphaQuality: quality, effort: 4 });
    } else {
      pipeline = pipeline.flatten({ background: "#ffffff" }).webp({ quality, effort: 4 });
    }

    await pipeline.toFile(outPath);
    outputs.push(path.basename(outPath));
  }

  return outputs;
}

async function optimizePhotos() {
  const files = (await readdir(PHOTO_DIR))
    .filter((name) => /-\d+\.png$/i.test(name))
    .sort();

  for (const name of files) {
    const src = path.join(PHOTO_DIR, name);
    const made = await writeWebpVariants(src, PHOTO_WIDTHS, PHOTO_QUALITY, false);
    console.log(`photo ${name} -> ${made.join(", ")}`);
  }
}

async function optimizeCovers() {
  const files = (await readdir(COVER_DIR))
    .filter((name) => name.endsWith(".png") && !name.includes("-"))
    .sort();

  for (const name of files) {
    const src = path.join(COVER_DIR, name);
    const made = await writeWebpVariants(src, COVER_WIDTHS, COVER_QUALITY, true);
    console.log(`cover ${name} -> ${made.join(", ")}`);
  }
}

await optimizePhotos();
await optimizeCovers();
console.log("done");
