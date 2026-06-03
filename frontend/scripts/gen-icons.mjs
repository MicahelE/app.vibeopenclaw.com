// Generates favicon.ico (16/32/48, PNG-in-ICO) and PWA PNGs from app/icon.svg.
// Run from the frontend dir: node scripts/gen-icons.mjs
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync(new URL('../src/app/icon.svg', import.meta.url));

async function png(size) {
  return sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();
}

function buildIco(images) {
  // images: [{ size, data(Buffer) }]
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const bodies = [];
  images.forEach((img, i) => {
    const b = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, b + 0); // width
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, b + 1); // height
    dir.writeUInt8(0, b + 2); // color count
    dir.writeUInt8(0, b + 3); // reserved
    dir.writeUInt16LE(1, b + 4); // color planes
    dir.writeUInt16LE(32, b + 6); // bits per pixel
    dir.writeUInt32LE(img.data.length, b + 8); // size of image data
    dir.writeUInt32LE(offset, b + 12); // offset
    offset += img.data.length;
    bodies.push(img.data);
  });
  return Buffer.concat([header, dir, ...bodies]);
}

const [p16, p32, p48, p180, p192, p512] = await Promise.all([
  png(16), png(32), png(48), png(180), png(192), png(512),
]);

writeFileSync(new URL('../src/app/favicon.ico', import.meta.url), buildIco([
  { size: 16, data: p16 }, { size: 32, data: p32 }, { size: 48, data: p48 },
]));

writeFileSync(new URL('../public/icon-192.png', import.meta.url), p192);
writeFileSync(new URL('../public/icon-512.png', import.meta.url), p512);
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), p180);

console.log('Wrote favicon.ico (16/32/48), icon-192.png, icon-512.png, apple-touch-icon.png');
