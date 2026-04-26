#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pngToIco from 'png-to-ico';
import sharp from 'sharp';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const PUBLIC_DIR = resolve(ROOT, 'public');
const SOURCE_DIR = resolve(PUBLIC_DIR, 'icons/source');
const GENERATED_DIR = resolve(PUBLIC_DIR, 'icons/generated');

const sourceName = process.argv[2] ?? 'archive-frame';
const sourcePath = resolve(SOURCE_DIR, `${sourceName}.svg`);

const pngTargets = [
  ['favicon-16x16.png', 16, 1.14],
  ['favicon-32x32.png', 32, 1.1],
  ['favicon.png', 512, 1],
  ['apple-touch-icon.png', 180, 1],
  ['icon-192.png', 192, 1],
  ['icon-512.png', 512, 1],
  ['icon-maskable-512.png', 512, 0.84],
];

function withScale(svg, scale) {
  if (scale === 1) return svg;

  const offset = (512 - (512 * scale)) / 2;
  return svg
    .replace(/(<rect[^>]+\/?>)/, `$1\n  <g transform="translate(${offset} ${offset}) scale(${scale})">`)
    .replace('</svg>', '</g></svg>');
}

async function renderPng(svg, fileName, size, scale = 1) {
  const input = Buffer.from(withScale(svg, scale));
  const outputPath = resolve(PUBLIC_DIR, fileName);
  const generatedPath = resolve(GENERATED_DIR, fileName);

  const buffer = await sharp(input, { density: 384 })
    .resize(size, size)
    .png()
    .toBuffer();

  await writeFile(outputPath, buffer);
  await writeFile(generatedPath, buffer);
  return outputPath;
}

async function main() {
  await mkdir(GENERATED_DIR, { recursive: true });

  const svg = await readFile(sourcePath, 'utf8');
  await writeFile(resolve(PUBLIC_DIR, 'favicon.svg'), svg);
  await writeFile(resolve(GENERATED_DIR, `${sourceName}.svg`), svg);

  const icoPngs = [];
  for (const [fileName, size, scale] of pngTargets) {
    const output = await renderPng(svg, fileName, size, scale);
    if (fileName === 'favicon-16x16.png' || fileName === 'favicon-32x32.png') {
      icoPngs.push(output);
    }
  }

  const favicon48 = await renderPng(svg, 'favicon-48x48.png', 48, 1.08);
  icoPngs.push(favicon48);
  await writeFile(resolve(PUBLIC_DIR, 'favicon.ico'), await pngToIco(icoPngs));

  await writeFile(resolve(PUBLIC_DIR, 'site.webmanifest'), JSON.stringify({
    name: 'Eric Qiu Photos',
    short_name: 'Photos',
    description: 'A personal photo archive by Eric Qiu.',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#f3f0ea',
    theme_color: '#f3f0ea',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2) + '\n');

  console.log(`Generated icons from ${sourceName}.svg`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
