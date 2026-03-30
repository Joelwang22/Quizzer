import { CastSprite } from '../components';
import { STORY_CAST } from '../data/storyCast';

const StoryCast = (): JSX.Element => (
  <section className="space-y-8">
    <header className="max-w-3xl space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">Story Cast</p>
      <h1 className="text-3xl font-bold text-slate-50">Northwind Office Systems</h1>
      <p className="text-base leading-8 text-slate-300">
        Animated pixel-sprite prototypes for the recurring office cast. These are idle-loop assets intended
        to anchor the lesson story beats without turning the lesson flow into a full cutscene system.
      </p>
    </header>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {STORY_CAST.map((member) => (
        <article
          key={member.id}
          className="flex gap-5 rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-5 shadow-[0_16px_48px_rgba(15,23,42,0.24)]"
        >
          <div className="shrink-0">
            <CastSprite spriteSheet={member.spriteSheet} name={member.name} size={112} />
          </div>
          <div className="space-y-2">
            <div>
              <p className={`text-sm font-semibold ${member.accentClassName}`}>{member.title}</p>
              <h2 className="text-xl font-semibold text-slate-50">{member.name}</h2>
            </div>
            <p className="text-sm uppercase tracking-[0.12em] text-slate-500">{member.role}</p>
            <p className="text-sm leading-7 text-slate-300">{member.blurb}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default StoryCast;
