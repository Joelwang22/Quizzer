import type { CSSProperties } from 'react';

interface CastSpriteProps {
  spriteSheet: string;
  name: string;
  size?: number;
}

const CastSprite = ({ spriteSheet, name, size = 96 }: CastSpriteProps): JSX.Element => (
  <div
    aria-label={`${name} animated pixel sprite`}
    className="story-sprite rounded-xl border border-slate-700/80 bg-slate-900/70"
    style={{
      '--story-sprite-frame-size': `${size}px`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundImage: `url(${spriteSheet})`,
    } as CSSProperties}
  />
);

export default CastSprite;
