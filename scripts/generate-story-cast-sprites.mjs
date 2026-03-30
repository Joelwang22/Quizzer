import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GRID = 24;
const PIXEL = 4;
const FRAME_COUNT = 4;
const FRAME_SIZE = GRID * PIXEL;
const OUTLINE = '#23191f';
const SHADOW = '#0b1220';
const OUT_DIR = path.resolve(process.cwd(), 'public', 'story-cast');

const FRAMES = [
  { bob: 0, sway: 0, blink: false, armSwing: -1, legShift: 0, propLift: 0 },
  { bob: 0, sway: 0, blink: false, armSwing: 0, legShift: 1, propLift: 0 },
  { bob: 0, sway: 0, blink: false, armSwing: 1, legShift: 0, propLift: 0 },
  { bob: 0, sway: 0, blink: true, armSwing: 0, legShift: -1, propLift: 0 },
];

const CAST = [
  {
    id: 'marty-bell',
    name: 'Marty Bell',
    hairStyle: 'swept',
    bodyStyle: 'blazer',
    prop: 'mug',
    propSide: 'left',
    brow: 'confident',
    mouth: 'smirk',
    stance: 0,
    palette: {
      skin: '#f3c8a5',
      hair: '#6c4437',
      shirt: '#faf5ef',
      outer: '#233c63',
      accent: '#8f2447',
      pants: '#334155',
      shoes: '#111827',
      prop: '#dbe4f0',
      propAccent: '#7c3aed',
    },
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    hairStyle: 'bun',
    bodyStyle: 'jacket',
    prop: 'laptop',
    propSide: 'right',
    brow: 'focused',
    mouth: 'flat',
    eyeStyle: 'tired',
    mouthStyle: 'tight-flat',
    stance: -1,
    palette: {
      skin: '#b7784f',
      hair: '#21171d',
      shirt: '#67e8f9',
      outer: '#233240',
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
    bodyStyle: 'shirt-tie',
    prop: 'phone',
    propSide: 'right',
    brow: 'confident',
    mouth: 'grin',
    stance: 0,
    palette: {
      skin: '#efbf96',
      hair: '#7e4e34',
      shirt: '#eff6ff',
      outer: '#5ca1f2',
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
    bodyStyle: 'cardigan',
    prop: 'clipboard',
    propSide: 'left',
    brow: 'worried',
    mouth: 'flat',
    stance: 0,
    glasses: true,
    palette: {
      skin: '#efc3a0',
      hair: '#30262d',
      shirt: '#fafaf9',
      outer: '#356447',
      accent: '#d1a94f',
      pants: '#334155',
      shoes: '#1f2937',
      prop: '#e7e5e4',
      propAccent: '#94a3b8',
    },
  },
  {
    id: 'rosa-jimenez',
    name: 'Rosa Jimenez',
    hairStyle: 'wave',
    bodyStyle: 'cardigan',
    prop: 'folder',
    propSide: 'right',
    brow: 'soft',
    mouth: 'smile',
    eyeStyle: 'kind',
    mouthStyle: 'lip-smile',
    noseStyle: 'light',
    stance: 1,
    palette: {
      skin: '#d39a72',
      hair: '#7c3245',
      shirt: '#fdf2f8',
      outer: '#7d3d90',
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
    bodyStyle: 'vest',
    prop: 'keys',
    propSide: 'left',
    brow: 'focused',
    mouth: 'beard',
    eyeStyle: 'stern',
    mouthStyle: 'beard-defined',
    noseStyle: 'single-dark',
    noseYOffset: 0,
    mouthYOffset: 1,
    stance: -1,
    beard: true,
    palette: {
      skin: '#8c5d44',
      hair: '#21181d',
      shirt: '#f7ead8',
      outer: '#77624a',
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
    bodyStyle: 'hoodie',
    prop: 'notebook',
    propSide: 'right',
    brow: 'soft',
    mouth: 'flat',
    stance: 0,
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
    bodyStyle: 'blazer',
    prop: 'tablet',
    propSide: 'left',
    brow: 'soft',
    mouth: 'smile',
    eyeStyle: 'clean',
    mouthStyle: 'small-closed-smile',
    noseStyle: 'single-light',
    stance: 1,
    palette: {
      skin: '#f5cfae',
      hair: '#d3a44c',
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

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const tint = (hex, amount) => {
  const value = hex.replace('#', '');
  const red = parseInt(value.slice(0, 2), 16);
  const green = parseInt(value.slice(2, 4), 16);
  const blue = parseInt(value.slice(4, 6), 16);
  const mix = amount < 0 ? 0 : 255;
  const factor = Math.abs(amount);

  const channel = (base) => {
    const next = Math.round(base + (mix - base) * factor);
    return clamp(next, 0, 255).toString(16).padStart(2, '0');
  };

  return `#${channel(red)}${channel(green)}${channel(blue)}`;
};

const createFrame = () => Array.from({ length: GRID }, () => Array(GRID).fill(null));

const setPixel = (frame, x, y, color) => {
  if (x < 0 || y < 0 || x >= GRID || y >= GRID || !color) {
    return;
  }

  frame[y][x] = color;
};

const clearPixel = (frame, x, y) => {
  if (x < 0 || y < 0 || x >= GRID || y >= GRID) {
    return;
  }

  frame[y][x] = null;
};

const fillRect = (frame, x, y, width, height, color) => {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) {
      setPixel(frame, xx, yy, color);
    }
  }
};

const outlinedRect = (frame, x, y, width, height, fill, border = OUTLINE) => {
  fillRect(frame, x, y, width, height, border);
  fillRect(frame, x + 1, y + 1, width - 2, height - 2, fill);
};

const roundedRect = (frame, x, y, width, height, fill, border = OUTLINE) => {
  outlinedRect(frame, x, y, width, height, fill, border);
  clearPixel(frame, x, y);
  clearPixel(frame, x + width - 1, y);
  clearPixel(frame, x, y + height - 1);
  clearPixel(frame, x + width - 1, y + height - 1);
};

const drawShadow = (frame, bodyX) => {
  const shadowX = bodyX + 4;
  fillRect(frame, shadowX, 22, 6, 1, SHADOW);
  fillRect(frame, shadowX + 1, 21, 4, 1, tint(SHADOW, 0.12));
};

const drawHead = (frame, character, pose, bodyX) => {
  const headX = bodyX - 1 + pose.sway;
  const headY = 3 + pose.bob;
  const skinShade = tint(character.palette.skin, -0.12);

  roundedRect(frame, headX, headY, 12, 10, character.palette.skin);
  setPixel(frame, headX, headY + 3, skinShade);
  setPixel(frame, headX + 11, headY + 3, skinShade);
  setPixel(frame, headX - 1, headY + 4, skinShade);
  setPixel(frame, headX - 1, headY + 5, character.palette.skin);
  setPixel(frame, headX + 12, headY + 4, skinShade);
  setPixel(frame, headX + 12, headY + 5, character.palette.skin);

  return { headX, headY };
};

const drawHair = (frame, character, headX, headY) => {
  const { hair } = character.palette;
  const hairLight = tint(hair, 0.18);

  switch (character.hairStyle) {
    case 'bun':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      fillRect(frame, headX, headY + 2, 2, 3, hair);
      fillRect(frame, headX + 10, headY + 2, 2, 3, hair);
      fillRect(frame, headX + 8, headY - 2, 3, 2, hair);
      fillRect(frame, headX + 4, headY, 3, 1, hairLight);
      break;
    case 'quiff':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      fillRect(frame, headX + 7, headY - 2, 3, 2, hair);
      fillRect(frame, headX, headY + 2, 2, 2, hair);
      fillRect(frame, headX + 3, headY, 3, 1, hairLight);
      break;
    case 'sleek-bob':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      fillRect(frame, headX, headY + 2, 2, 6, hair);
      fillRect(frame, headX + 10, headY + 2, 2, 6, hair);
      fillRect(frame, headX + 4, headY, 3, 1, hairLight);
      break;
    case 'wave':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      fillRect(frame, headX, headY + 2, 2, 7, hair);
      fillRect(frame, headX + 10, headY + 2, 2, 7, hair);
      setPixel(frame, headX + 1, headY + 8, hair);
      setPixel(frame, headX + 10, headY + 8, hair);
      fillRect(frame, headX + 3, headY, 4, 1, hairLight);
      break;
    case 'short-curl':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      setPixel(frame, headX + 2, headY - 2, hair);
      setPixel(frame, headX + 4, headY - 2, hairLight);
      setPixel(frame, headX + 7, headY - 2, hair);
      setPixel(frame, headX + 9, headY - 2, hairLight);
      fillRect(frame, headX, headY + 2, 2, 3, hair);
      fillRect(frame, headX + 10, headY + 2, 2, 3, hair);
      break;
    case 'messy':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      setPixel(frame, headX + 2, headY - 2, hairLight);
      setPixel(frame, headX + 5, headY - 3, hair);
      setPixel(frame, headX + 8, headY - 2, hairLight);
      fillRect(frame, headX, headY + 2, 2, 3, hair);
      fillRect(frame, headX + 10, headY + 2, 2, 2, hair);
      break;
    case 'polished-lob':
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      fillRect(frame, headX, headY + 2, 2, 5, hair);
      fillRect(frame, headX + 10, headY + 2, 2, 5, hair);
      fillRect(frame, headX + 4, headY, 4, 1, hairLight);
      break;
    case 'swept':
    default:
      fillRect(frame, headX + 1, headY - 1, 10, 3, hair);
      fillRect(frame, headX, headY + 2, 2, 3, hair);
      fillRect(frame, headX + 8, headY - 2, 3, 2, hair);
      fillRect(frame, headX + 4, headY, 3, 1, hairLight);
      break;
  }
};

const drawFace = (frame, character, pose, headX, headY) => {
  const browY = headY + 3;
  const eyeY = headY + 5;
  const browLeft = headX + 3;
  const browRight = headX + 7;
  const mouthY = headY + 8 + (character.mouthYOffset ?? 0);

  if (character.brow === 'worried') {
    setPixel(frame, browLeft, browY + 1, OUTLINE);
    setPixel(frame, browLeft + 1, browY, OUTLINE);
    setPixel(frame, browRight, browY, OUTLINE);
    setPixel(frame, browRight + 1, browY + 1, OUTLINE);
  } else if (character.brow === 'focused') {
    setPixel(frame, browLeft, browY, OUTLINE);
    setPixel(frame, browLeft + 1, browY + 1, OUTLINE);
    setPixel(frame, browRight, browY + 1, OUTLINE);
    setPixel(frame, browRight + 1, browY, OUTLINE);
  } else {
    fillRect(frame, browLeft, browY, 2, 1, OUTLINE);
    fillRect(frame, browRight, browY, 2, 1, OUTLINE);
  }

  if (pose.blink) {
    fillRect(frame, headX + 3, eyeY, 2, 1, OUTLINE);
    fillRect(frame, headX + 7, eyeY, 2, 1, OUTLINE);
  } else if (character.eyeStyle === 'tired') {
    fillRect(frame, headX + 3, eyeY, 2, 1, OUTLINE);
    fillRect(frame, headX + 7, eyeY, 2, 1, OUTLINE);
    setPixel(frame, headX + 4, eyeY + 1, tint(OUTLINE, 0.35));
    setPixel(frame, headX + 8, eyeY + 1, tint(OUTLINE, 0.35));
  } else if (character.eyeStyle === 'kind') {
    setPixel(frame, headX + 4, eyeY, OUTLINE);
    setPixel(frame, headX + 8, eyeY, OUTLINE);
    setPixel(frame, headX + 3, eyeY + 1, tint(OUTLINE, 0.45));
    setPixel(frame, headX + 9, eyeY + 1, tint(OUTLINE, 0.45));
  } else if (character.eyeStyle === 'steady') {
    fillRect(frame, headX + 4, eyeY, 1, 2, OUTLINE);
    fillRect(frame, headX + 8, eyeY, 1, 2, OUTLINE);
  } else if (character.eyeStyle === 'hooded') {
    fillRect(frame, headX + 3, eyeY, 2, 1, OUTLINE);
    fillRect(frame, headX + 7, eyeY, 2, 1, OUTLINE);
    setPixel(frame, headX + 4, eyeY + 1, tint(OUTLINE, 0.2));
    setPixel(frame, headX + 8, eyeY + 1, tint(OUTLINE, 0.2));
  } else if (character.eyeStyle === 'stern') {
    fillRect(frame, headX + 3, eyeY - 1, 2, 1, OUTLINE);
    fillRect(frame, headX + 7, eyeY - 1, 2, 1, OUTLINE);
    setPixel(frame, headX + 4, eyeY, OUTLINE);
    setPixel(frame, headX + 8, eyeY, OUTLINE);
  } else if (character.eyeStyle === 'friendly') {
    setPixel(frame, headX + 4, eyeY, OUTLINE);
    setPixel(frame, headX + 8, eyeY, OUTLINE);
    setPixel(frame, headX + 5, eyeY + 1, tint(OUTLINE, 0.45));
    setPixel(frame, headX + 7, eyeY + 1, tint(OUTLINE, 0.45));
  } else if (character.eyeStyle === 'clean') {
    setPixel(frame, headX + 4, eyeY, OUTLINE);
    setPixel(frame, headX + 8, eyeY, OUTLINE);
  } else {
    setPixel(frame, headX + 4, eyeY, OUTLINE);
    setPixel(frame, headX + 8, eyeY, OUTLINE);
    if (character.brow === 'soft') {
      setPixel(frame, headX + 4, eyeY + 1, tint(OUTLINE, 0.25));
      setPixel(frame, headX + 8, eyeY + 1, tint(OUTLINE, 0.25));
    }
  }

  if (character.noseStyle !== 'none') {
    setPixel(
      frame,
      headX + 6,
      headY + 6 + (character.noseYOffset ?? 0),
      character.noseStyle === 'light' || character.noseStyle === 'single-light'
        ? tint(character.palette.skin, -0.18)
        : character.noseStyle === 'single-dark'
          ? tint(character.palette.skin, -0.3)
        : tint(character.palette.skin, -0.3),
    );
  }

  if (character.mouthStyle === 'beard-soft') {
    fillRect(frame, headX + 3, mouthY, 6, 2, OUTLINE);
    fillRect(frame, headX + 4, mouthY - 1, 4, 1, tint(character.palette.hair, 0.08));
    fillRect(frame, headX + 5, mouthY - 1, 2, 1, '#8f5f4e');
  } else if (character.mouthStyle === 'beard-neutral') {
    fillRect(frame, headX + 3, mouthY, 6, 2, OUTLINE);
    fillRect(frame, headX + 4, mouthY - 1, 4, 1, tint(character.palette.hair, 0.08));
    fillRect(frame, headX + 5, mouthY, 2, 1, '#8f5f4e');
  } else if (character.mouthStyle === 'tight-flat') {
    fillRect(frame, headX + 4, mouthY, 3, 1, '#8f5f4e');
  } else if (character.mouthStyle === 'warm-smile') {
    setPixel(frame, headX + 4, mouthY, '#8f5f4e');
    fillRect(frame, headX + 5, mouthY + 1, 2, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY, '#8f5f4e');
    setPixel(frame, headX + 6, mouthY + 1, '#f8fafc');
  } else if (character.mouthStyle === 'gentle-smile') {
    setPixel(frame, headX + 4, mouthY, '#8f5f4e');
    fillRect(frame, headX + 5, mouthY + 1, 2, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY, '#8f5f4e');
  } else if (character.mouthStyle === 'lip-smile') {
    setPixel(frame, headX + 4, mouthY + 1, '#8f5f4e');
    fillRect(frame, headX + 5, mouthY + 1, 2, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY + 1, '#8f5f4e');
    setPixel(frame, headX + 5, mouthY, '#b76a64');
    setPixel(frame, headX + 6, mouthY, '#b76a64');
  } else if (character.mouthStyle === 'soft-smile') {
    setPixel(frame, headX + 4, mouthY, '#8f5f4e');
    fillRect(frame, headX + 5, mouthY, 2, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY + 1, '#8f5f4e');
  } else if (character.mouthStyle === 'closed-smile') {
    fillRect(frame, headX + 4, mouthY, 3, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY + 1, '#8f5f4e');
  } else if (character.mouthStyle === 'small-closed-smile') {
    fillRect(frame, headX + 5, mouthY, 2, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY + 1, '#8f5f4e');
  } else if (character.mouthStyle === 'beard-defined') {
    fillRect(frame, headX + 4, mouthY - 1, 4, 1, tint(character.palette.hair, 0.08));
    fillRect(frame, headX + 3, mouthY + 1, 2, 2, OUTLINE);
    fillRect(frame, headX + 7, mouthY + 1, 2, 2, OUTLINE);
    fillRect(frame, headX + 5, mouthY + 2, 2, 1, OUTLINE);
    fillRect(frame, headX + 5, mouthY, 2, 1, '#8f5f4e');
  } else if (character.mouth === 'grin') {
    fillRect(frame, headX + 4, mouthY, 4, 1, '#955a4d');
    setPixel(frame, headX + 5, mouthY + 1, '#f8fafc');
    setPixel(frame, headX + 6, mouthY + 1, '#f8fafc');
  } else if (character.mouth === 'smirk') {
    setPixel(frame, headX + 5, mouthY, '#8f5f4e');
    setPixel(frame, headX + 6, mouthY, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY - 1, '#8f5f4e');
  } else if (character.mouth === 'smile') {
    setPixel(frame, headX + 4, mouthY, '#8f5f4e');
    fillRect(frame, headX + 5, mouthY + 1, 2, 1, '#8f5f4e');
    setPixel(frame, headX + 7, mouthY, '#8f5f4e');
  } else {
    fillRect(frame, headX + 4, mouthY, 3, 1, '#8f5f4e');
  }

  if (character.glasses) {
    fillRect(frame, headX + 2, eyeY - 1, 3, 1, OUTLINE);
    fillRect(frame, headX + 7, eyeY - 1, 3, 1, OUTLINE);
    setPixel(frame, headX + 5, eyeY - 1, OUTLINE);
  }
};

const drawBody = (frame, character, pose, bodyX) => {
  const baseY = 13 + pose.bob;
  const torsoX = bodyX;
  const torsoY = baseY;
  const armY = baseY + 1;
  const leftArmX = torsoX - 2;
  const rightArmX = torsoX + 10;
  const leftLegX = torsoX + 2;
  const rightLegX = torsoX + 6;

  const shirtLight = tint(character.palette.shirt, 0.15);
  const outerLight = tint(character.palette.outer, 0.16);
  const pantsLight = tint(character.palette.pants, 0.1);

  fillRect(frame, torsoX + 3, torsoY - 1, 4, 1, character.palette.skin);
  setPixel(frame, torsoX + 3, torsoY, tint(character.palette.skin, -0.2));
  setPixel(frame, torsoX + 6, torsoY, tint(character.palette.skin, -0.2));
  roundedRect(frame, torsoX, torsoY, 10, 8, character.palette.outer);

  switch (character.bodyStyle) {
    case 'shirt-tie':
      fillRect(frame, torsoX + 2, torsoY + 1, 6, 5, character.palette.shirt);
      fillRect(frame, torsoX + 4, torsoY + 1, 2, 5, character.palette.accent);
      setPixel(frame, torsoX + 4, torsoY, character.palette.accent);
      setPixel(frame, torsoX + 5, torsoY, character.palette.accent);
      break;
    case 'cardigan':
      fillRect(frame, torsoX + 2, torsoY + 1, 6, 5, character.palette.shirt);
      fillRect(frame, torsoX + 1, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 7, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 4, torsoY + 1, 2, 5, character.palette.accent);
      break;
    case 'hoodie':
      fillRect(frame, torsoX + 2, torsoY + 1, 6, 4, character.palette.outer);
      fillRect(frame, torsoX + 3, torsoY + 1, 4, 3, character.palette.shirt);
      setPixel(frame, torsoX + 2, torsoY, character.palette.accent);
      setPixel(frame, torsoX + 7, torsoY, character.palette.accent);
      setPixel(frame, torsoX + 4, torsoY + 5, character.palette.accent);
      setPixel(frame, torsoX + 5, torsoY + 5, character.palette.accent);
      break;
    case 'vest':
      fillRect(frame, torsoX + 2, torsoY + 1, 6, 5, character.palette.shirt);
      fillRect(frame, torsoX + 1, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 7, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 4, torsoY + 1, 2, 5, character.palette.accent);
      break;
    case 'jacket':
      fillRect(frame, torsoX + 2, torsoY + 1, 6, 5, character.palette.shirt);
      fillRect(frame, torsoX + 1, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 7, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 4, torsoY + 1, 2, 2, character.palette.accent);
      break;
    case 'blazer':
    default:
      fillRect(frame, torsoX + 2, torsoY + 1, 6, 5, character.palette.shirt);
      fillRect(frame, torsoX + 1, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 7, torsoY + 1, 2, 5, character.palette.outer);
      fillRect(frame, torsoX + 4, torsoY + 1, 2, 5, character.palette.accent);
      break;
  }

  fillRect(frame, torsoX + 1, torsoY + 1, 1, 2, outerLight);
  fillRect(frame, torsoX + 7, torsoY + 1, 1, 2, outerLight);
  fillRect(frame, torsoX + 3, torsoY + 1, 3, 1, shirtLight);

  fillRect(frame, leftArmX, armY + pose.armSwing, 2, 5, character.palette.outer);
  fillRect(frame, rightArmX, armY - pose.armSwing, 2, 5, character.palette.outer);
  setPixel(frame, leftArmX, armY + 1 + pose.armSwing, outerLight);
  setPixel(frame, rightArmX + 1, armY + 1 - pose.armSwing, outerLight);
  fillRect(frame, leftArmX, armY + 4 + pose.armSwing, 2, 1, character.palette.skin);
  fillRect(frame, rightArmX, armY + 4 - pose.armSwing, 2, 1, character.palette.skin);

  fillRect(frame, leftLegX, torsoY + 8, 2, 5, character.palette.pants);
  fillRect(frame, rightLegX, torsoY + 8, 2, 5, character.palette.pants);
  setPixel(frame, leftLegX, torsoY + 9 + pose.legShift, pantsLight);
  setPixel(frame, rightLegX + 1, torsoY + 9 - pose.legShift, pantsLight);
  fillRect(frame, leftLegX - 1, torsoY + 13, 4, 1, character.palette.shoes);
  fillRect(frame, rightLegX - 1, torsoY + 13, 4, 1, character.palette.shoes);

  return { torsoX, torsoY, leftArmX, rightArmX };
};

const drawCharacter = (character, frameIndex) => {
  const frame = createFrame();
  const pose = FRAMES[frameIndex];
  const bodyX = 7 + character.stance + pose.sway;

  drawShadow(frame, bodyX);
  const { headX, headY } = drawHead(frame, character, pose, bodyX);
  drawHair(frame, character, headX, headY);
  drawFace(frame, character, pose, headX, headY);
  drawBody(frame, character, pose, bodyX);

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
  const frameRects = frames.map((frame, index) => frameToRects(frame, index * FRAME_SIZE)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${FRAME_SIZE * FRAME_COUNT}" height="${FRAME_SIZE}" viewBox="0 0 ${FRAME_SIZE * FRAME_COUNT} ${FRAME_SIZE}" shape-rendering="crispEdges">
  <title>${character.name} idle pixel sprite sheet</title>
  <desc>Four-frame idle sprite sheet for ${character.name}.</desc>
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
  await writeFile(path.join(OUT_DIR, `${character.id}-idle.svg`), makeSpriteSheet(character), 'utf8');
}

await writeFile(path.join(OUT_DIR, 'manifest.json'), makeCastManifest(), 'utf8');

console.log(`Generated ${CAST.length} polished story cast sprite sheets in ${OUT_DIR}`);
