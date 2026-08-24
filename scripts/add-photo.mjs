#!/usr/bin/env node
/**
 * Interactive script to add one or more photos to the gallery.
 *
 * Usage:
 *   npm run add-photo -- <Place> <file.jpg> [file2.jpg ...]
 *   npm run add-photo -- --defer <Place> <file.jpg> [file2.jpg ...]
 *
 * Examples:
 *   npm run add-photo -- Iceland ~/Desktop/eric-qiu-gallery-62.jpg
 *   npm run add-photo -- "New York City" shot1.jpg shot2.jpg
 *   npm run add-photo -- --defer Spain batch/*.jpg
 *
 * What it does for each photo:
 *   1. Resizes to 4000px longest edge (sharp)
 *   2. Copies to src/assets/photos/<Place>/
 *   3. Asks for title, caption, alt text, and tags interactively
 *      (--defer skips all prompts: alt is written as 'TODO', which
 *      validatePhotos() rejects at build time, so a half-finished batch
 *      cannot deploy — fill everything in your editor afterwards)
 *   4. Inserts the entry into its place's block in src/data/photos.ts
 *   5. Appends to matching series arrays in src/data/collections.ts
 *   6. Optionally adds to the homepage Favorites collection
 */

import { createInterface } from 'node:readline/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const PHOTOS_TS = resolve(ROOT, 'src/data/photos.ts');
const COLLECTIONS_TS = resolve(ROOT, 'src/data/collections.ts');
const ASSETS_DIR = resolve(ROOT, 'src/assets/photos');

const VALID_TAGS = ['cities', 'landscapes', 'built', 'waterlines', 'weather', 'details', 'in-between'];

// Maps tag name → key in seriesPhotoIds object in collections.ts
const SERIES_KEYS = {
  cities: 'cities',
  landscapes: 'landscapes',
  built: 'built',
  waterlines: 'waterlines',
  weather: 'weather',
  details: 'details',
  'in-between': 'inBetween',
};

const KNOWN_PLACES = ['Iceland', 'Spain', 'Japan', 'London', 'Vietnam', 'New York City', 'Misc'];

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => rl.question(`  ${q}`);

async function askRequired(q) {
  while (true) {
    const a = (await ask(q)).trim();
    if (a) return a;
    console.log('  (this field is required)');
  }
}

function placeToSlug(place) {
  return place.toLowerCase().replace(/\s+/g, '-');
}

function extractGalleryNumber(filename) {
  const m = filename.match(/eric-qiu-gallery-(\d+)\.jpg$/i);
  return m ? m[1].padStart(3, '0') : null;
}

async function getDimensions(filePath) {
  const meta = await sharp(filePath).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

// All string-surgery anchors this script depends on. Checked up-front so a
// batch never half-applies after a formatter or refactor moves one of them.
function preflightAnchors(photosSrc, collectionsSrc, tags, addToSelected) {
  const missing = [];
  if (!photosSrc.includes('\n];\n\nconst metadata')) missing.push('photos.ts: end of entries array');
  if (!photosSrc.includes('\n};\n\nexport const photos')) missing.push('photos.ts: end of metadata record');
  for (const tag of tags) {
    const key = SERIES_KEYS[tag];
    if (!collectionsSrc.includes(`  ${key}: [`)) missing.push(`collections.ts: series '${key}'`);
  }
  if (addToSelected && !collectionsSrc.includes("id: 'selected'")) {
    missing.push("collections.ts: selected collection");
  }
  if (missing.length) {
    throw new Error(`Formatting anchors not found (file layout changed?):\n  - ${missing.join('\n  - ')}`);
  }
}

function escape(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function insertIntoPhotosTs(id, place, key, width, height, tags, title, caption, alt) {
  let src = await readFile(PHOTOS_TS, 'utf-8');

  const isMisc = !place || place === 'Misc';
  const placeVal = isMisc ? 'undefined' : `'${place}'`;
  const tagsVal = `[${tags.map((t) => `'${t}'`).join(', ')}]`;
  const tuple = `  ['${id}', ${placeVal}, '${key}', ${width}, ${height}, ${tagsVal}],`;

  // Entries order is editorial (archive/place/lightbox sequence), so insert at
  // the end of this place's block, not the end of the array; a brand-new place
  // falls back to the end of the array.
  const lastKeyRef = src.lastIndexOf(`'${place}/`);
  if (lastKeyRef !== -1) {
    const lineEnd = src.indexOf('\n', lastKeyRef);
    src = src.slice(0, lineEnd + 1) + tuple + '\n' + src.slice(lineEnd + 1);
  } else {
    const ENTRIES_END = '\n];\n\nconst metadata';
    const ei = src.indexOf(ENTRIES_END);
    if (ei === -1) throw new Error('Could not locate end of entries array in photos.ts');
    src = src.slice(0, ei) + '\n' + tuple + src.slice(ei);
  }

  // Build metadata entry
  const lines = [`  '${id}': {`];
  if (title) lines.push(`    title: '${escape(title)}',`);
  if (caption) lines.push(`    caption: '${escape(caption)}',`);
  lines.push(`    alt: '${escape(alt)}',`);
  lines.push('  },');

  // Append metadata before closing }; of metadata record
  const META_END = '\n};\n\nexport const photos';
  const mi = src.indexOf(META_END);
  if (mi === -1) throw new Error('Could not locate end of metadata record in photos.ts');
  src = src.slice(0, mi) + '\n' + lines.join('\n') + src.slice(mi);

  await writeFile(PHOTOS_TS, src);
}

async function insertIntoCollectionsTs(id, tags, addToSelected) {
  let src = await readFile(COLLECTIONS_TS, 'utf-8');

  for (const tag of tags) {
    const key = SERIES_KEYS[tag];
    const startMarker = `  ${key}: [`;
    const si = src.indexOf(startMarker);
    if (si === -1) {
      console.log(`  Warning: series '${key}' not found in collections.ts — add '${id}' manually`);
      continue;
    }
    const ci = src.indexOf('\n  ],', si);
    if (ci === -1) {
      console.log(`  Warning: could not find end of series '${key}' — add '${id}' manually`);
      continue;
    }
    src = src.slice(0, ci) + `\n    '${id}',` + src.slice(ci);
  }

  if (addToSelected) {
    const si = src.indexOf("id: 'selected'");
    if (si !== -1) {
      const pi = src.indexOf('photoIds: [', si);
      if (pi !== -1) {
        const nl = src.indexOf('\n', pi) + 1;
        src = src.slice(0, nl) + `      '${id}',\n` + src.slice(nl);
      }
    }
  }

  await writeFile(COLLECTIONS_TS, src);
}

async function processPhoto(filePath, place, defer) {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) {
    console.log(`\n  ✗ File not found: ${filePath}`);
    return;
  }

  const filename = basename(absPath);
  let numStr = extractGalleryNumber(filename);

  if (!numStr) {
    console.log(`\n  "${filename}" doesn't match the eric-qiu-gallery-NNN.jpg naming convention.`);
    const raw = (await ask('Enter the gallery number to assign (e.g. 062): ')).trim();
    numStr = raw.padStart(3, '0');
  }

  const canonicalName = `eric-qiu-gallery-${numStr}.jpg`;
  const id = `${placeToSlug(place)}-${numStr}`;
  const destDir = resolve(ASSETS_DIR, place);
  const destPath = resolve(destDir, canonicalName);
  const key = `${place}/${canonicalName}`;

  console.log(`\n── ${id} ─────────────────────────────────`);

  if (existsSync(destPath)) {
    const ow = (await ask(`${canonicalName} already exists in ${place}/. Overwrite? (y/N): `)).trim().toLowerCase();
    if (ow !== 'y') { console.log('  Skipped.'); return; }
  }

  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

  process.stdout.write(`  Resizing "${filename}" to 4000px longest edge and copying...`);
  await sharp(absPath)
    .rotate()
    .resize({ width: 4000, height: 4000, fit: 'inside', withoutEnlargement: true })
    .toFile(destPath);
  // Dimensions come from the OUTPUT file so photos.ts can never disagree with disk
  const { width, height } = await getDimensions(destPath);
  console.log(` ${width}×${height}`);

  let title = '';
  let caption = '';
  let alt = 'TODO';
  let tags = [];
  let addToSelected = false;

  if (!defer) {
    // Editorial prompts
    console.log('\n  Editorial info:');
    title   = (await ask('  Title    (Enter to skip): ')).trim();
    caption = (await ask('  Caption  (Enter to skip): ')).trim();
    alt     = await askRequired('  Alt text (required):      ');

    // Tags
    console.log(`\n  Tags — pick all that apply:`);
    console.log(`    ${VALID_TAGS.join('  ')}`);
    const tagInput = (await ask('  Tags (space-separated):   ')).trim();
    tags = tagInput.split(/\s+/).filter((t) => VALID_TAGS.includes(t));
    const unknown = tagInput.split(/\s+/).filter((t) => t && !VALID_TAGS.includes(t));
    if (unknown.length) console.log(`  (ignoring unknown: ${unknown.join(', ')})`);
    if (!tags.length) console.log('  (no tags — remember to add tags and series membership manually)');

    // Favorites homepage collection
    addToSelected =
      (await ask('\n  Add to homepage Favorites collection? (y/N): ')).trim().toLowerCase() === 'y';
  }

  // Check every anchor in both files before writing either
  const photosSrc = await readFile(PHOTOS_TS, 'utf-8');
  const collectionsSrc = await readFile(COLLECTIONS_TS, 'utf-8');
  preflightAnchors(photosSrc, collectionsSrc, tags, addToSelected);

  // Write both data files
  process.stdout.write('\n  Writing to src/data/photos.ts and collections.ts...');
  await insertIntoPhotosTs(id, place, key, width, height, tags, title, caption, alt);
  await insertIntoCollectionsTs(id, tags, addToSelected);
  console.log(' done.');

  // Per-photo summary
  console.log(`\n  ✔  ${id}`);
  console.log(`     → src/assets/photos/${place}/${canonicalName}  (${width}×${height})`);
  if (tags.length) {
    console.log(`     Series (appended to end): ${tags.join(', ')}`);
    console.log('     ↳ Review ordering in collections.ts if position matters');
  }
  if (addToSelected) {
    console.log('     Added to selected (prepended to front)');
    console.log('     ↳ Review ordering in collections.ts — selected order is editorial');
  }
  if (defer) {
    console.log("     ↳ --defer: alt is 'TODO' (build will fail until filled), no tags yet");
  } else if (!title || !caption) {
    console.log('     ↳ Title/caption left blank — fill in photos.ts before committing');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const defer = args.includes('--defer');
  const [place, ...files] = args.filter((a) => a !== '--defer');

  if (!place || !files.length) {
    console.error('\nUsage:  npm run add-photo -- [--defer] <Place> <file.jpg> [file2.jpg ...]');
    console.error('        npm run add-photo -- Iceland ~/Desktop/eric-qiu-gallery-62.jpg\n');
    process.exit(1);
  }

  if (!KNOWN_PLACES.includes(place)) {
    console.log(`\nNote: "${place}" is not a known place.`);
    console.log('After this script, add a place collection manually to src/data/collections.ts.\n');
  }

  for (const file of files) {
    await processPhoto(file, place, defer);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('All done. Before committing, review:');
  console.log('  • New tuples sit at the end of their place block — move within the');
  console.log('    block if the sequence matters (entries order is editorial)');
  console.log('  • Series ordering in src/data/collections.ts');
  console.log('    (photos were appended to the end of each series)');
  console.log('  • coverPhotoId for any collections this affects');
  if (defer) {
    console.log("  • Fill every 'TODO' alt plus titles/captions/tags in photos.ts,");
    console.log('    then mirror any tags into seriesPhotoIds in collections.ts');
    console.log('    (validatePhotos/validateSeriesTags will fail the build until done)');
  } else {
    console.log('  • Any blank title/caption fields in src/data/photos.ts');
  }
  console.log('─'.repeat(50) + '\n');

  rl.close();
}

main().catch((err) => {
  console.error('\nError:', err.message);
  rl.close();
  process.exit(1);
});
