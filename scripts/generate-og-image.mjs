import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const BG     = "#f3f0ea";
const INK    = "#24231f";
const ACCENT = "#b9823d";
const MUTED  = "#8c847a";

const W = 1200;
const H = 630;
const LEFT_W  = 520;
const RIGHT_X = LEFT_W;
const RIGHT_W = W - RIGHT_X;

const BORDER  = 6;
const GAP     = 4;
const FRAME_W = 340;
const FRAME_H = 227;
const NUM_PHOTOS = 4;

async function buildPhotoMosaic() {
  const photos = [
    "Spain/eric-qiu-gallery-14.jpg",
    "Japan/eric-qiu-gallery-52.jpg",
    "Iceland/eric-qiu-gallery-42.jpg",
    "Iceland/eric-qiu-gallery-40.jpg",
  ];

  const resized = await Promise.all(
    photos.map(async (f) => {
      const meta = await sharp(`src/assets/photos/${f}`).metadata();
      const targetW = FRAME_W - BORDER * 2;
      const targetH = FRAME_H - BORDER * 2;
      const w = Math.round(meta.width * (targetW / meta.width));
      const h = Math.round(meta.height * (targetW / meta.width));
      const scaled = await sharp(`src/assets/photos/${f}`)
        .resize(w, h, { fit: "fill" })
        .toBuffer();
      const scaledMeta = await sharp(scaled).metadata();
      const top = Math.round((scaledMeta.height - targetH) / 2);
      return sharp(scaled)
        .extract({ left: 0, top, width: targetW, height: targetH })
        .toBuffer();
    })
  );

  const composites = [];
  const CENTER_X = Math.round((LEFT_W - FRAME_W) / 2);
  const MID = Math.round(H / 2);
  const positions = [
    -Math.round(FRAME_H * 0.4),
    MID - FRAME_H,
    MID,
    MID + FRAME_H,
  ];

  for (let i = 0; i < photos.length; i++) {
    let x = CENTER_X;
    let y = positions[i];

    composites.push({
      input: Buffer.from(
        `<svg width="${FRAME_W}" height="${FRAME_H}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="s" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="rgba(36,35,31,0.2)"/>
            </filter>
          </defs>
          <rect x="0" y="0" width="${FRAME_W}" height="${FRAME_H}" fill="white" filter="url(#s)"/>
          <rect x="${BORDER}" y="${BORDER}" width="${FRAME_W - BORDER * 2}" height="${FRAME_H - BORDER * 2}" fill="#fafaf8"/>
        </svg>`
      ),
      left: x,
      top: y,
    });

    composites.push({
      input: resized[i],
      left: x + BORDER,
      top: y + BORDER,
    });
  }

  return sharp({
    create: { width: LEFT_W, height: H, channels: 4, background: BG },
  })
    .composite(composites)
    .png()
    .toBuffer();
}

async function generateTextOverlay() {
  const frauncesData = fs.readFileSync(
    path.join(process.cwd(), "src/assets/fonts/fraunces-800.ttf")
  );
  const spaceMonoData = fs.readFileSync(
    path.join(process.cwd(), "src/assets/fonts/space-mono-400.ttf")
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          width: `${RIGHT_W}px`,
          height: `${H}px`,
          background: BG,
          position: "relative",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 0,
                top: 0,
                width: "1px",
                height: `${H}px`,
                background: MUTED,
                opacity: 0.3,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: `${RIGHT_W}px`,
                height: `${H}px`,
                padding: "0 72px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "36px",
                      height: "2px",
                      background: ACCENT,
                      marginBottom: "28px",
                    },
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontFamily: "Space Mono",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: ACCENT,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      marginBottom: "18px",
                    },
                    children: "Photography Archive",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontFamily: "Fraunces",
                      fontSize: "64px",
                      fontWeight: 800,
                      color: INK,
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      marginBottom: "18px",
                    },
                    children: "Eric Qiu",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontFamily: "Space Mono",
                      fontSize: "16px",
                      fontWeight: 400,
                      color: MUTED,
                      letterSpacing: "0.04em",
                      marginBottom: "24px",
                    },
                    children: "places \u00b7 weather \u00b7 city light \u00b7 small scenes",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontFamily: "Space Mono",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: MUTED,
                      letterSpacing: "0.06em",
                    },
                    children: "photos.ericqiu.io",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: RIGHT_W,
      height: H,
      fonts: [
        { name: "Fraunces", data: frauncesData, weight: 800, style: "normal" },
        { name: "Space Mono", data: spaceMonoData, weight: 400, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: RIGHT_W } });
  return resvg.render().asPng();
}

async function main() {
  const [mosaic, textOverlay] = await Promise.all([
    buildPhotoMosaic(),
    generateTextOverlay(),
  ]);

  const card = await sharp({
    create: { width: W, height: H, channels: 4, background: BG },
  })
    .composite([
      { input: mosaic, left: 0, top: 0 },
      { input: textOverlay, left: RIGHT_X, top: 0 },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync("public/og-image.png", card);
  console.log("✓ public/og-image.png (1200x630)");
}

main();