#!/usr/bin/env node
/**
 * Interactive script to add one or more photos to the gallery.
 *
 * Usage:
 *   npm run add-photo -- <Place> <file.jpg> [file2.jpg ...]
 *
 * Examples:
 *   npm run add-photo -- Iceland ~/Desktop/eric-qiu-gallery-62.jpg
 *   npm run add-photo -- "New York City" shot1.jpg shot2.jpg
 *   npm run add-photo -- Misc ~/Downloads/eric-qiu-gallery-63.jpg
 *
 * What it does for each photo:
 *   1. Resizes to 4000px longest edge (sips, macOS only)
 *   2. Copies to src/assets/photos/<Place>/
 *   3. Asks for title, caption, alt text, and tags interactively
 *   4. Inserts the entry and metadata into src/data/photos.ts
 *   5. Appends to matching series arrays in src/data/collections.ts
 *   6. Optionally adds to the homepage selected collection
 */

import { createInterface } from 'node:readline/promises';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

function getDimensions(filePath) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight "${filePath}"`).toString();
  return {
    width: parseInt(out.match(/pixelWidth: (\d+)/)?.[1] ?? '0'),
    height: parseInt(out.match(/pixelHeight: (\d+)/)?.[1] ?? '0'),
  };
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

  // Append tuple before closing ]; of entries array
  const ENTRIES_END = '\n];\n\nconst metadata';
  const ei = src.indexOf(ENTRIES_END);
  if (ei === -1) throw new Error('Could not locate end of entries array in photos.ts');
  src = src.slice(0, ei) + '\n' + tuple + src.slice(ei);

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

async function processPhoto(filePath, place) {
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
  execSync(`sips -Z 4000 "${absPath}" --out "${destPath}"`, { stdio: 'pipe' });
  const { width, height } = getDimensions(destPath);
  console.log(` ${width}×${height}`);

  // Editorial prompts
  console.log('\n  Editorial info:');
  const title   = (await ask('  Title    (Enter to skip): ')).trim();
  const caption = (await ask('  Caption  (Enter to skip): ')).trim();
  const alt     = await askRequired('  Alt text (required):      ');

  // Tags
  console.log(`\n  Tags — pick all that apply:`);
  console.log(`    ${VALID_TAGS.join('  ')}`);
  const tagInput = (await ask('  Tags (space-separated):   ')).trim();
  const tags = tagInput.split(/\s+/).filter((t) => VALID_TAGS.includes(t));
  const unknown = tagInput.split(/\s+/).filter((t) => t && !VALID_TAGS.includes(t));
  if (unknown.length) console.log(`  (ignoring unknown: ${unknown.join(', ')})`);
  if (!tags.length) console.log('  (no tags — remember to add tags and series membership manually)');

  // Selected homepage collection
  const addToSelected =
    (await ask('\n  Add to homepage selected collection? (y/N): ')).trim().toLowerCase() === 'y';

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
  if (!title || !caption) {
    console.log('     ↳ Title/caption left blank — fill in photos.ts before committing');
  }
}

async function main() {
  const [place, ...files] = process.argv.slice(2);

  if (!place || !files.length) {
    console.error('\nUsage:  npm run add-photo -- <Place> <file.jpg> [file2.jpg ...]');
    console.error('        npm run add-photo -- Iceland ~/Desktop/eric-qiu-gallery-62.jpg\n');
    process.exit(1);
  }

  if (!KNOWN_PLACES.includes(place)) {
    console.log(`\nNote: "${place}" is not a known place.`);
    console.log('After this script, add a place collection manually to src/data/collections.ts.\n');
  }

  for (const file of files) {
    await processPhoto(file, place);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('All done. Before committing, review:');
  console.log('  • Series ordering in src/data/collections.ts');
  console.log('    (photos were appended to the end of each series)');
  console.log('  • coverPhotoId for any collections this affects');
  console.log('  • Any blank title/caption fields in src/data/photos.ts');
  console.log('─'.repeat(50) + '\n');

  rl.close();
}

main().catch((err) => {
  console.error('\nError:', err.message);
  rl.close();
  process.exit(1);
});
