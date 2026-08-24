#!/usr/bin/env node
/**
 * One-time (re-runnable) normalizer for src/assets/photos:
 *   - resizes every JPG to 4000px longest edge (sharp, EXIF-rotation safe)
 *   - rewrites each tuple's width/height in src/data/photos.ts from the
 *     actual output file, so stored dims can never disagree with disk
 *   - warns loudly about files already under 4000px whose stored dims
 *     disagree (screen-res exports accidentally committed as originals)
 *
 * The photos.ts diff is numbers-only: tuple line format and the anchors
 * that add-photo.mjs depends on are untouched.
 *
 * Usage: node scripts/normalize-photos.mjs [--dry-run]
 */

import { readFile, writeFile, rename } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const PHOTOS_DIR = resolve(ROOT, 'src/assets/photos');
const PHOTOS_TS = resolve(ROOT, 'src/data/photos.ts');
const MAX_EDGE = 4000;
const dryRun = process.argv.includes('--dry-run');

function* walkJpgs(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walkJpgs(full);
    else if (/\.jpe?g$/i.test(entry)) yield full;
  }
}

let src = await readFile(PHOTOS_TS, 'utf-8');
let resized = 0;
let dimsFixed = 0;
const warnings = [];

for (const file of walkJpgs(PHOTOS_DIR)) {
  const key = file.slice(PHOTOS_DIR.length + 1);
  const before = await sharp(file).metadata();
  const beforeEdge = Math.max(before.width ?? 0, before.height ?? 0);

  let width = before.width ?? 0;
  let height = before.height ?? 0;

  if (beforeEdge > MAX_EDGE) {
    if (!dryRun) {
      const tmp = `${file}.tmp`;
      await sharp(file)
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 88, mozjpeg: true })
        .toFile(tmp);
      await rename(tmp, file);
      const after = await sharp(file).metadata();
      width = after.width ?? 0;
      height = after.height ?? 0;
    } else {
      const scale = MAX_EDGE / beforeEdge;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    resized += 1;
    console.log(`resized  ${key}  ${before.width}x${before.height} -> ${width}x${height}`);
  }

  // Rewrite this tuple's dims from the file on disk (numbers-only edit)
  const tupleRe = new RegExp(`('${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}', )(\\d+), (\\d+)(,)`);
  const match = src.match(tupleRe);
  if (!match) {
    warnings.push(`${key}: no tuple found in photos.ts — file is untracked?`);
    continue;
  }
  const stored = { width: Number(match[2]), height: Number(match[3]) };
  if (stored.width !== width || stored.height !== height) {
    if (beforeEdge <= MAX_EDGE) {
      warnings.push(
        `${key}: file is only ${before.width}x${before.height} but photos.ts said ` +
          `${stored.width}x${stored.height} — likely a screen-res export committed in place ` +
          `of the original. Dims corrected; RE-EXPORT FROM THE ORIGINAL when possible.`,
      );
    }
    src = src.replace(tupleRe, `$1${width}, ${height}$4`);
    dimsFixed += 1;
    console.log(`dims     ${key}  ${stored.width}x${stored.height} -> ${width}x${height} (photos.ts)`);
  }
}

if (!dryRun && dimsFixed > 0) await writeFile(PHOTOS_TS, src);

console.log(`\n${dryRun ? '[dry-run] ' : ''}${resized} file(s) resized, ${dimsFixed} tuple(s) corrected.`);
if (warnings.length) {
  console.log('\nWARNINGS:');
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (!dryRun && (resized > 0 || dimsFixed > 0)) {
  console.log('\nNext: git diff src/data/photos.ts should be numbers-only; then npm run build.');
}
