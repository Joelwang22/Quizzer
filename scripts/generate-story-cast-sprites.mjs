import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GRID = 24;
const PIXEL = 4;
const FRAME_COUNT = 3;
const FRAME_SIZE = GRID * PIXEL;
const OUTLINE = '#261d22';
const SHADOW = '#0f172a';
const OUT_DIR = path.resolve(process.cwd(), 'public', 'story-cast');

const CAST = [
  {
    id: 'marty-bell',
    name: 'Marty Bell',
    hairStyle: 'swept',
    facialHair: 'none',
    glasses: false,
    prop: 'mug',
    bodyStyle: 'blazer',
    propSide: 'left',
    palette: {
      skin: '#f3c8a5',
      hair: '#5f3d31',
      shirt: '#f8fafc',
      outer: '#243b63',
      accent: '#8b1e3f',
      pants: '#334155',
      shoes: '#1f2937',
      prop: '#cbd5e1',
      propAccent: '#7c3aed',
    },
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    hairStyle: 'bun',
    facialHair: 'none',
    glasses: false,
    prop: 'laptop',
    bodyStyle: 'jacket',
    propSide: 'right',
    palette: {
      skin: '#b7784f',
      hair: '#1f1721',
      shirt: '#67e8f9',
      outer: '#24303f',
      accent: '#14b8a6',
      pants: '#334155',
      shoes: '#0f172a',
      prop: '#64748b',
      propAccent: '#38bdf8',
    },
  },
  {
    id: 'glen-foster',
    name: 'Glen Foster',
    hairStyle: 'quiff',
    facialHair: 'none',
    glasses: false,
    prop: 'phone',
    bodyStyle: 'shirt-tie',
    propSide: 'right',
    palette: {
      skin: '#efbf96',
      hair: '#7b4b32',
      shirt: '#e0f2fe',
      outer: '#60a5fa',
      accent: '#f97316',
      pants: '#1f2937',
      shoes: '#111827',
      prop: '#94a3b8',
      propAccent: '#0f172a',
    },
  },
  {
    id: 'denise-park',
    name: 'Denise Park',
    hairStyle: 'sleek-bob',
    facialHair: 'none',
    glasses: true,
    prop: 'clipboard',
    bodyStyle: 'cardigan',
    propSide: 'left',
    palette: {
      skin: '#efc3a0',
      hair: '#2c242a',
      shirt: '#f8fafc',
      outer: '#356447',
      accent: '#caa24a',
      pants: '#334155',
      shoes: '#1f2937',
      prop: '#e5e7eb',
      propAccent: '#94a3b8',
    },
  },
  {
    id: 'rosa-jimenez',
    name: 'Rosa Jimenez',
    hairStyle: 'wave',
    facialHair: 'none',
    glasses: false,
    prop: 'folder',
    bodyStyle: 'cardigan',
    propSide: 'right',
    palette: {
      skin: '#d39a72',
      hair: '#7a3143',
      shirt: '#fdf2f8',
      outer: '#7c3f8c',
      accent: '#f472b6',
      pants: '#374151',
      shoes: '#1f2937',
      prop: '#f4c2d7',
      propAccent: '#7c3aed',
    },
  },
  {
    id: 'ethan-cole',
    name: 'Ethan Cole',
    hairStyle: 'short-curl',
    facialHair: 'beard',
    glasses: false,
    prop: 'keys',
    bodyStyle: 'vest',
    propSide: 'left',
    palette: {
      skin: '#8c5d44',
      hair: '#21181d',
      shirt: '#f7ead8',
      outer: '#766148',
      accent: '#eab308',
      pants: '#4b5563',
      shoes: '#111827',
      prop: '#cbd5e1',
      propAccent: '#fbbf24',
    },
  },
  {
    id: 'noah-reed',
    name: 'Noah Reed',
    hairStyle: 'messy',
    facialHair: 'none',
    glasses: false,
    prop: 'notebook',
    bodyStyle: 'hoodie',
    propSide: 'right',
    palette: {
      skin: '#f0c19b',
      hair: '#5a392d',
      shirt: '#e2e8f0',
      outer: '#284c7a',
      accent: '#22d3ee',
      pants: '#334155',
      shoes: '#0f172a',
      prop: '#cbd5e1',
      propAccent: '#0f172a',
    },
  },
  {
    id: 'tessa-vale',
    name: 'Tessa Vale',
    hairStyle: 'polished-lob',
    facialHair: 'none',
    glasses: false,
    prop: 'tablet',
    bodyStyle: 'blazer',
    propSide: 'left',
    palette: {
      skin: '#f5cfae',
      hair: '#d6a84c',
      shirt: '#fdf2f8',
      outer: '#4b5563',
      accent: '#db2777',
      pants: '#334155',
      shoes: '#111827',
      prop: '#94a3b8',
      propAccent: '#1f2937',
    },
  },
];

const createFrame = () => Array.from({ length: GRID }, () => Array(GRID).fill(null));

const setPixel = (frame, x, y, color) => {
  if (x < 0 || y < 0 || x >= GRID || y >= GRID || !color) {
    return;
  }

  frame[y][x] = color;
};

const fillRect = (frame, x, y, width, height, color) => {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      setPixel(frame, xx, yy, color);
    }
  }
};

const outlinedRect = (frame, x, y, width, height, border, fill) => {
  fillRect(frame, x, y, width, height, border);
  if (width > 2 && height > 2) {
    fillRect(frame, x + 1, y + 1, width - 2, height - 2, fill);
  }
};

const drawHair = (frame, style, x, y, color) => {
  switch (style) {
    case 'bun':
      fillRect(frame, x, y, 10, 3, color);
      fillRect(frame, x, y + 3, 2, 2, color);
      fillRect(frame, x + 8, y + 3, 2, 2, color);
      fillRect(frame, x + 8, y - 1, 3, 2, color);
      break;
    case 'quiff':
      fillRect(frame, x, y, 10, 3, color);
      fillRect(frame, x + 6, y - 1, 3, 2, color);
      fillRect(frame, x, y + 3, 2, 2, color);
      fillRect(frame, x + 8, y + 3, 2, 1, color);
      break;
    case 'sleek-bob':
      fillRect(frame, x, y, 10, 3, color);
      fillRect(frame, x, y + 3, 2, 4, color);
      fillRect(frame, x + 8, y + 3, 2, 4, color);
      break;
    case 'wave':
      fillRect(frame, x, y, 10, 3, color);
      fillRect(frame, x, y + 3, 2, 5, color);
      fillRect(frame, x + 8, y + 3, 2, 5, color);
      setPixel(frame, x + 1, y + 7, color);
      setPixel(frame, x + 8, y + 7, color);
      break;
    case 'short-curl':
      fillRect(frame, x, y, 10, 3, color);
      setPixel(frame, x + 1, y - 1, color);
      setPixel(frame, x + 3, y - 1, color);
      setPixel(frame, x + 6, y - 1, color);
      setPixel(frame, x + 8, y - 1, color);
      fillRect(frame, x, y + 3, 2, 2, color);
      fillRect(frame, x + 8, y + 3, 2, 2, color);
      break;
    case 'messy':
      fillRect(frame, x, y, 10, 3, color);
      setPixel(frame, x + 1, y - 1, color);
      setPixel(frame, x + 4, y - 2, color);
      setPixel(frame, x + 7, y - 1, color);
      fillRect(frame, x, y + 3, 2, 2, color);
      fillRect(frame, x + 8, y + 3, 2, 2, color);
      break;
    case 'polished-lob':
      fillRect(frame, x, y, 10, 3, color);
      fillRect(frame, x, y + 3, 2, 4, color);
      fillRect(frame, x + 8, y + 3, 2, 4, color);
      setPixel(frame, x + 9, y - 1, color);
      break;
    case 'swept':
    default:
      fillRect(frame, x, y, 10, 3, color);
      fillRect(frame, x, y + 3, 2, 2, color);
      fillRect(frame, x + 7, y - 1, 3, 2, color);
      break;
  }
};

const drawEyes = (frame, x, y, blink) => {
  if (blink) {
    fillRect(frame, x + 2, y, 2, 1, OUTLINE);
    fillRect(frame, x + 6, y, 2, 1, OUTLINE);
    return;
  }

  setPixel(frame, x + 2, y, OUTLINE);
  setPixel(frame, x + 7, y, OUTLINE);
};

const drawFace = (frame, character, x, y, blink) => {
  drawEyes(frame, x, y, blink);
  if (character.glasses) {
    fillRect(frame, x + 1, y - 1, 3, 1, OUTLINE);
    fillRect(frame, x + 6, y - 1, 3, 1, OUTLINE);
    setPixel(frame, x + 4, y - 1, OUTLINE);
  }

  if (character.facialHair === 'beard') {
    fillRect(frame, x + 2, y + 3, 5, 2, OUTLINE);
    setPixel(frame, x + 1, y + 4, OUTLINE);
    setPixel(frame, x + 7, y + 4, OUTLINE);
  } else {
    fillRect(frame, x + 3, y + 3, 3, 1, '#9f5d52');
  }
};

const drawBody = (frame, character, bob, armPose) => {
  const { outer, shirt, accent, pants, shoes } = character.palette;
  const bodyY = 11 + bob;
  const armY = 12 + bob;
  const legY = 17 + bob;

  switch (character.bodyStyle) {
    case 'shirt-tie':
      outlinedRect(frame, 8, bodyY, 8, 6, OUTLINE, shirt);
      fillRect(frame, 11, bodyY + 1, 2, 4, accent);
      break;
    case 'cardigan':
      outlinedRect(frame, 8, bodyY, 8, 6, OUTLINE, outer);
      fillRect(frame, 10, bodyY + 1, 4, 4, shirt);
      fillRect(frame, 11, bodyY + 1, 2, 4, accent);
      break;
    case 'hoodie':
      outlinedRect(frame, 8, bodyY, 8, 6, OUTLINE, outer);
      fillRect(frame, 10, bodyY + 1, 4, 3, shirt);
      setPixel(frame, 10, bodyY, accent);
      setPixel(frame, 13, bodyY, accent);
      setPixel(frame, 11, bodyY + 4, accent);
      setPixel(frame, 12, bodyY + 4, accent);
      break;
    case 'vest':
      outlinedRect(frame, 8, bodyY, 8, 6, OUTLINE, shirt);
      fillRect(frame, 8, bodyY + 1, 2, 4, outer);
      fillRect(frame, 14, bodyY + 1, 2, 4, outer);
      fillRect(frame, 11, bodyY + 1, 2, 4, accent);
      break;
    case 'jacket':
      outlinedRect(frame, 8, bodyY, 8, 6, OUTLINE, outer);
      fillRect(frame, 10, bodyY + 1, 4, 4, shirt);
      fillRect(frame, 11, bodyY + 1, 2, 2, accent);
      break;
    case 'blazer':
    default:
      outlinedRect(frame, 8, bodyY, 8, 6, OUTLINE, outer);
      fillRect(frame, 10, bodyY + 1, 4, 4, shirt);
      fillRect(frame, 11, bodyY + 1, 2, 4, accent);
      break;
  }

  fillRect(frame, 6, armY + armPose, 2, 5, OUTLINE);
  fillRect(frame, 7, armY + 1 + armPose, 1, 3, outer);
  fillRect(frame, 16, armY - armPose, 2, 5, OUTLINE);
  fillRect(frame, 16, armY + 1 - armPose, 1, 3, outer);

  fillRect(frame, 9, legY, 2, 5, pants);
  fillRect(frame, 13, legY, 2, 5, pants);
  fillRect(frame, 8, legY + 5, 4, 1, shoes);
  fillRect(frame, 12, legY + 5, 4, 1, shoes);
};

const drawProp = (frame, character, bob, frameIndex) => {
  const { prop, propSide } = character;
  const x = propSide === 'left' ? 4 : 17;
  const y = 13 + bob + (frameIndex === 2 ? 1 : 0);
  const { prop: propColor, propAccent } = character.palette;

  switch (prop) {
    case 'mug':
      fillRect(frame, x, y, 2, 3, propColor);
      setPixel(frame, x + 2, y + 1, propAccent);
      setPixel(frame, x + 2, y + 2, propAccent);
      break;
    case 'laptop':
      fillRect(frame, x - 1, y, 4, 3, propColor);
      fillRect(frame, x, y + 1, 2, 1, propAccent);
      break;
    case 'phone':
      fillRect(frame, x, y, 2, 4, propColor);
      setPixel(frame, x, y + 3, propAccent);
      break;
    case 'clipboard':
      fillRect(frame, x, y, 3, 4, propColor);
      setPixel(frame, x + 1, y, propAccent);
      break;
    case 'folder':
      fillRect(frame, x - 1, y, 4, 3, propColor);
      fillRect(frame, x, y - 1, 2, 1, propAccent);
      break;
    case 'keys':
      setPixel(frame, x, y + 1, propAccent);
      setPixel(frame, x + 1, y + 1, propAccent);
      setPixel(frame, x + 2, y + 2, propColor);
      setPixel(frame, x + 1, y + 3, propColor);
      break;
    case 'notebook':
      fillRect(frame, x - 1, y, 4, 4, propColor);
      fillRect(frame, x, y, 1, 4, propAccent);
      break;
    case 'tablet':
      fillRect(frame, x - 1, y, 4, 5, propColor);
      fillRect(frame, x, y + 1, 2, 2, propAccent);
      break;
    default:
      break;
  }
};

const drawCharacter = (character, frameIndex) => {
  const frame = createFrame();
  const bob = [0, 1, 0][frameIndex] ?? 0;
  const blink = frameIndex === 1;
  const armPose = [-1, 0, 1][frameIndex] ?? 0;
  const { skin, hair } = character.palette;
  const headX = 7;
  const headY = 3 + bob;

  outlinedRect(frame, headX, headY, 10, 9, OUTLINE, skin);
  setPixel(frame, headX - 1, headY + 4, skin);
  setPixel(frame, headX + 10, headY + 4, skin);
  drawHair(frame, character.hairStyle, headX, headY - 1, hair);
  drawFace(frame, character, headX, headY + 4, blink);
  drawBody(frame, character, bob, armPose);
  drawProp(frame, character, bob, frameIndex);

  return frame;
};

const frameToRects = (frame, frameOffset) => {
  const rects = [];

  for (let y = 0; y < GRID; y += 1) {
    for (let x = 0; x < GRID; x += 1) {
      const color = frame[y][x];
      if (!color) {
        continue;
      }

      rects.push(
        `<rect x="${frameOffset + x * PIXEL}" y="${y * PIXEL}" width="${PIXEL}" height="${PIXEL}" fill="${color}" />`,
      );
    }
  }

  return rects.join('\n');
};

const makeSpriteSheet = (character) => {
  const frames = Array.from({ length: FRAME_COUNT }, (_, index) => drawCharacter(character, index));
  const frameRects = frames
    .map((frame, index) => frameToRects(frame, index * FRAME_SIZE))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${FRAME_SIZE * FRAME_COUNT}" height="${FRAME_SIZE}" viewBox="0 0 ${FRAME_SIZE * FRAME_COUNT} ${FRAME_SIZE}" shape-rendering="crispEdges">
  <title>${character.name} idle pixel sprite sheet</title>
  <desc>Three-frame idle sprite sheet for ${character.name}.</desc>
  <g>
${frameRects}
  </g>
</svg>
`;
};

const makeCastManifest = () =>
  JSON.stringify(
    CAST.map((character) => ({
      id: character.id,
      name: character.name,
      spriteSheet: `/story-cast/${character.id}-idle.svg`,
    })),
    null,
    2,
  );

await mkdir(OUT_DIR, { recursive: true });

for (const character of CAST) {
  const svg = makeSpriteSheet(character);
  await writeFile(path.join(OUT_DIR, `${character.id}-idle.svg`), svg, 'utf8');
}

await writeFile(path.join(OUT_DIR, 'manifest.json'), makeCastManifest(), 'utf8');

console.log(`Generated ${CAST.length} story cast sprite sheets in ${OUT_DIR}`);
