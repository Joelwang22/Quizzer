import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  SECURITY_PLUS_LESSONS,
  getDiagramStorageKey,
  markLessonDone,
  type LessonSlide,
  type IntroSlide,
  type ConceptSlide,
  type BulletsSlide,
  type QuoteSlide,
  type TermSlide,
  type CheckSlide,
  type SummarySlide,
  type DiagramSlide,
} from '../data/securityPlusLessons';
import { getLessonStory, type LessonStory } from '../data/lessonStories';
import { getLessonDiagramCrop } from '../data/lessonDiagramCrops';
import { STORY_CAST, type StoryCastMember } from '../data/storyCast';
import { CastSprite } from '../components';

// Module-level PDF document cache so the 11MB file is fetched and parsed once
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfDocCache = new Map<string, any>();

const baseSlidePanelClass =
  'min-h-full rounded-[1.75rem] border border-slate-700/80 bg-slate-900/70 shadow-[0_24px_80px_rgba(15,23,42,0.32)]';
const slideHeaderClass =
  'border-b border-slate-700/80 bg-slate-800/70 px-8 py-4 text-sm font-semibold tracking-[0.12em] sm:px-10';
const slideContentPaddingClass = 'px-8 py-7 sm:px-10 sm:py-8';

type LessonHighlightTone = 'core' | 'protocol' | 'identity' | 'risk' | 'process';

const LESSON_HIGHLIGHT_RULES: Array<{ tone: LessonHighlightTone; pattern: RegExp }> = [
  {
    tone: 'risk',
    pattern:
      /\b(phishing|spear phishing|smishing|vishing|malware|adware|spyware|ransomware|virus|worm|trojan|botnet|rootkit|keylogger|exploit|vulnerability|threat|attack|attacker|compromise|exfiltration|indicator of compromise|ioc|xss|cross-site scripting|sql injection|csrf|race condition|buffer overflow|on-path|man-in-the-middle|mitm|denial of service|dos|ddos)\b/i,
  },
  {
    tone: 'identity',
    pattern:
      /\b(identity|authentication|authorization|account|credential|password|passphrase|token|certificate|federation|directory|single sign-on|sso|mfa|biometric|session|kdc|tgt|tgs)\b/i,
  },
  {
    tone: 'protocol',
    pattern:
      /\b(tls|ssl|https|ssh|sftp|ftps|smtp|imap|pop3|dnssec|dmarc|dkim|spf|snmpv3|syslog|netflow|ipfix|ldap|ldaps|radius|tacacs\+?|kerberos|ipsec|vpn|802\.1x|eap|osi|tcp|udp|icmp|arp|wpa3|dpp|api gateway|waf|csp)\b/i,
  },
  {
    tone: 'process',
    pattern:
      /\b(policy|compliance|audit|attestation|due diligence|due care|classification|data owner|owner|risk|control|identify|protect|detect|respond|recover|incident response|recovery|backup|restoration|rto|rpo|mttr|mtbf|sla|mou|moa|msa|sow|nda|bpa|onboarding|offboarding|retention)\b/i,
  },
];

const normalizeLessonText = (value: string): string => value.replace(/\s+/g, ' ').trim();

const isLessonHighlightLabel = (value: string): boolean => {
  const normalized = normalizeLessonText(value);
  const wordCount = normalized ? normalized.split(/\s+/).length : 0;

  return normalized.endsWith(':') && normalized.length <= 40 && wordCount <= 5;
};

const getLessonHighlightTone = (value: string): LessonHighlightTone => {
  const normalized = normalizeLessonText(value).toLowerCase();
  if (!normalized) {
    return 'core';
  }

  return LESSON_HIGHLIGHT_RULES.find(({ pattern }) => pattern.test(normalized))?.tone ?? 'core';
};

const shouldUseLessonHighlightPill = (value: string): boolean => {
  const normalized = normalizeLessonText(value);
  const isAcronymLike = /^[A-Z0-9/+.\- ]{2,24}:?$/.test(normalized);
  const isShortLabel = isLessonHighlightLabel(normalized) && normalized.length <= 22;

  return (
    normalized.length > 0 &&
    (normalized.length <= 16 || isShortLabel || isAcronymLike)
  );
};

const getLessonHighlightClassName = (value: string): string => {
  const tone = getLessonHighlightTone(value);
  const variant = shouldUseLessonHighlightPill(value) ? 'lesson-strong--pill' : 'lesson-strong--plain';
  const labelClass = isLessonHighlightLabel(value) ? 'lesson-strong--label' : '';

  return `lesson-strong ${variant} lesson-strong--${tone} ${labelClass}`.trim();
};

const decorateLessonHtml = (html: string): string => {
  if (!html || typeof DOMParser === 'undefined') {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;

  if (!root) {
    return html;
  }

  root.querySelectorAll('strong').forEach((element) => {
    const text = normalizeLessonText(element.textContent ?? '');
    element.className = [element.className, getLessonHighlightClassName(text)].filter(Boolean).join(' ');
  });

  root.querySelectorAll('em').forEach((element) => {
    element.className = [element.className, 'lesson-emphasis'].filter(Boolean).join(' ');
  });

  return root.innerHTML;
};

const splitSummaryLabel = (point: string): { label: string; body: string } | null => {
  const separatorIndex = point.indexOf(':');
  if (separatorIndex <= 0 || separatorIndex > 36) {
    return null;
  }

  return {
    label: point.slice(0, separatorIndex + 1).trim(),
    body: point.slice(separatorIndex + 1).trim(),
  };
};

const clampSlideIndex = (value: number, total: number): number => {
  if (!Number.isFinite(value) || total <= 0) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(value), 0), total - 1);
};

const storyCastById = new Map<string, StoryCastMember>(STORY_CAST.map((member) => [member.id, member]));

const getStoryCastMembers = (castIds: string[]): StoryCastMember[] =>
  castIds
    .map((castId) => storyCastById.get(castId))
    .filter((member): member is StoryCastMember => Boolean(member));

type RenderedLessonSlide =
  | { kind: 'lesson'; slide: LessonSlide }
  | { kind: 'story'; slideKey: 'cold_open' | 'callback'; story: LessonStory };

type CheckSlideMode = 'binary' | 'fill_blank' | 'multiple_choice' | 'multi_part' | 'case' | 'reflection';

interface CheckSlidePresentation {
  mode: CheckSlideMode;
  eyebrow: string;
  title: string;
  description: string;
  accentClass: string;
  buttonClass: string;
}

interface ChoiceOption {
  key: string;
  label: string;
}

interface FillBlankData {
  prompt: string;
  blankCount: number;
  options: ChoiceOption[];
  correctKeys: string[];
}

const extractChoiceOptions = (question: string): ChoiceOption[] => {
  if (/Options:/i.test(question)) {
    const optionsSection = question.split(/Options:/i)[1] ?? '';
    const matches = Array.from(optionsSection.matchAll(/\(([A-Za-z])\)\s*([^()]+?)(?=\s*\([A-Za-z]\)|$)/g));
    return matches.map((match) => ({
      key: (match[1] ?? '').toUpperCase(),
      label: (match[2] ?? '').trim(),
    }));
  }

  const inlineMatches = Array.from(question.matchAll(/\(([A-Za-z])\)\s*([^()]+?)(?=\s*\([A-Za-z]\)|$)/g));
  if (inlineMatches.length >= 2) {
    return inlineMatches.map((match) => ({
      key: (match[1] ?? '').toUpperCase(),
      label: (match[2] ?? '').trim(),
    }));
  }

  const sentenceMatches = Array.from(question.matchAll(/([A-Z])\.\s*([^A-Z][^]*?)(?=\s+[A-Z]\.\s|$)/g));
  if (sentenceMatches.length >= 2) {
    return sentenceMatches.map((match) => ({
      key: match[1] ?? '',
      label: (match[2] ?? '').trim(),
    }));
  }

  return [];
};

const isMultiPartPrompt = (question: string, options: ChoiceOption[]): boolean => {
  if (/for each|each of the four combinations|work through|sub-question|part \w+/i.test(question)) {
    return true;
  }

  if (options.length < 2) {
    return false;
  }

  const questionLikeOptions = options.filter((option) =>
    /[?]$/.test(option.label) ||
    /^(are|is|what|why|how|which|can|could|does|do|did|suppose|give|identify|select)\b/i.test(option.label),
  );

  return questionLikeOptions.length === options.length;
};

const getCheckSlidePresentation = (question: string): CheckSlidePresentation => {
  const choiceOptions = extractChoiceOptions(question);

  if (/true or false/i.test(question)) {
    return {
      mode: 'binary',
      eyebrow: 'Decision Point',
      title: 'True or false',
      description: 'Commit to a verdict before revealing the explanation.',
      accentClass: 'text-amber-300',
      buttonClass: 'border-amber-500/60 text-amber-200 hover:bg-amber-500/10',
    };
  }

  if (/fill in the blank|\[____\]/i.test(question)) {
    return {
      mode: 'fill_blank',
      eyebrow: 'Recall Prompt',
      title: 'Fill in the blank',
      description: 'Try to supply the missing term or relationship before checking the answer.',
      accentClass: 'text-cyan-300',
      buttonClass: 'border-cyan-500/60 text-cyan-200 hover:bg-cyan-500/10',
    };
  }

  if (choiceOptions.length > 0 && !isMultiPartPrompt(question, choiceOptions)) {
    return {
      mode: 'multiple_choice',
      eyebrow: 'Choose One',
      title: 'Multiple choice',
      description: 'Pick the best answer before opening the explanation.',
      accentClass: 'text-sky-300',
      buttonClass: 'border-sky-500/60 text-sky-200 hover:bg-sky-500/10',
    };
  }

  if (isMultiPartPrompt(question, choiceOptions)) {
    return {
      mode: 'multi_part',
      eyebrow: 'Break It Down',
      title: 'Work through the parts',
      description: 'Handle each part in order, then compare with the explanation.',
      accentClass: 'text-fuchsia-300',
      buttonClass: 'border-fuchsia-500/60 text-fuchsia-200 hover:bg-fuchsia-500/10',
    };
  }

  if (/suppose|assume|case|scenario|which phase|next action/i.test(question)) {
    return {
      mode: 'case',
      eyebrow: 'Case Analysis',
      title: 'Apply the concept',
      description: 'Treat this like an exam scenario and decide which distinction controls the answer.',
      accentClass: 'text-teal-300',
      buttonClass: 'border-teal-500/60 text-teal-200 hover:bg-teal-500/10',
    };
  }

  return {
    mode: 'reflection',
    eyebrow: 'Quick Reflection',
    title: 'Test your understanding',
    description: 'Pause, answer it in your own words, then open the explanation.',
    accentClass: 'text-violet-300',
    buttonClass: 'border-violet-500/60 text-violet-200 hover:bg-violet-500/10',
  };
};

const extractPartLabels = (question: string): string[] => {
  const matches = question.match(/\(([a-z])\)/gi) ?? [];
  return Array.from(new Set(matches.map((match) => `Part ${match.replace(/[()]/g, '').toUpperCase()}`)));
};

const extractFillBlankData = (question: string, answerHtml: string): FillBlankData | null => {
  if (!/fill in the blank|\[____\]/i.test(question)) {
    return null;
  }

  const prompt = question.split(/Options:/i)[0]?.trim() ?? question.trim();
  const blankCount = Math.max((prompt.match(/\[____\]/g) ?? []).length, 1);
  const options = extractChoiceOptions(question);
  const correctMatches = Array.from(answerHtml.matchAll(/\(([A-Z])\)/g)).map((match) => match[1] ?? '');
  const correctKeys = correctMatches.slice(0, blankCount);

  return {
    prompt,
    blankCount,
    options,
    correctKeys,
  };
};

const renderFillBlankPrompt = (
  prompt: string,
  assignedKeys: Array<string | null>,
  optionsByKey: Map<string, ChoiceOption>,
  onDropOption: (blankIndex: number, optionKey: string) => void,
  onClearBlank: (blankIndex: number) => void,
): JSX.Element => {
  const parts = prompt.split('[____]');

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-3 text-base leading-relaxed text-slate-100">
      {parts.map((part, index) => (
        <span key={`segment-${index}`} className="contents">
          {part ? <span>{part}</span> : null}
          {index < parts.length - 1 ? (
            <button
              type="button"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const optionKey = event.dataTransfer.getData('text/plain');
                if (optionKey) {
                  onDropOption(index, optionKey);
                }
              }}
              onClick={() => onClearBlank(index)}
              className={`inline-flex min-h-11 min-w-40 items-center justify-center rounded-xl border border-dashed px-4 py-2 text-sm font-semibold transition ${
                assignedKeys[index]
                  ? 'border-cyan-300 bg-cyan-400/10 text-cyan-100'
                  : 'border-slate-600 bg-slate-900/70 text-slate-400 hover:border-slate-400'
              }`}
            >
              {assignedKeys[index]
                ? optionsByKey.get(assignedKeys[index] ?? '')?.label ?? assignedKeys[index]
                : 'Drop option here'}
            </button>
          ) : null}
        </span>
      ))}
    </p>
  );
};

const getStoryLineDelayMs = (text: string): number => Math.min(3200, Math.max(1250, 700 + text.length * 18));

const STORY_USER_CHARACTER_ID = 'noah-reed';

const StoryConversationPlayer = ({
  title,
  eyebrow,
  badge,
  cast,
  lines,
  takeawayTitle,
  takeaway,
  accentClassName,
  shellClassName,
}: {
  title: string;
  eyebrow: string;
  badge: string;
  cast: StoryCastMember[];
  lines: Array<{ speakerId: string; text: string }>;
  takeawayTitle: string;
  takeaway: string;
  accentClassName: string;
  shellClassName: string;
}): JSX.Element => {
  const [revealedCount, setRevealedCount] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showFullScript, setShowFullScript] = useState(false);
  const [bubblePosition, setBubblePosition] = useState<{ left: number; top: number; tailLeft: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeAnchorRef = useRef<HTMLDivElement | null>(null);
  const activeBubbleRef = useRef<HTMLDivElement | null>(null);
  const clampedRevealedCount = Math.min(Math.max(revealedCount, 1), lines.length);
  const activeLineIndex = clampedRevealedCount - 1;
  const activeLine = lines[activeLineIndex];
  const isComplete = clampedRevealedCount >= lines.length;
  const activeSpeakerId = activeLine?.speakerId;
  const progressLabel = `${clampedRevealedCount} / ${lines.length}`;
  const leftStageMember = cast.find((member) => member.id === STORY_USER_CHARACTER_ID);
  const rightStageMembers = cast.filter((member) => member.id !== STORY_USER_CHARACTER_ID);

  useEffect(() => {
    setRevealedCount(1);
    setIsAutoPlaying(true);
    setShowFullScript(false);
    setBubblePosition(null);
  }, [lines, title]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const anchor = activeAnchorRef.current;
    const bubble = activeBubbleRef.current;

    if (!stage || !anchor || !bubble || !activeLine) {
      setBubblePosition(null);
      return;
    }

    const updatePosition = (): void => {
      const stageRect = stage.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const bubbleRect = bubble.getBoundingClientRect();
      const anchorCenter = anchorRect.left - stageRect.left + anchorRect.width / 2;
      const desiredLeft = anchorCenter - bubbleRect.width / 2;
      const minLeft = 12;
      const maxLeft = Math.max(minLeft, stageRect.width - bubbleRect.width - 12);
      const clampedLeft = Math.min(Math.max(desiredLeft, minLeft), maxLeft);
      const desiredTop = anchorRect.top - stageRect.top - bubbleRect.height - 10;
      const clampedTop = Math.max(10, desiredTop);
      const desiredTailLeft = anchorCenter - clampedLeft;
      const clampedTailLeft = Math.min(Math.max(desiredTailLeft, 18), bubbleRect.width - 18);

      setBubblePosition((current) => {
        if (
          current &&
          Math.abs(current.left - clampedLeft) < 1 &&
          Math.abs(current.top - clampedTop) < 1 &&
          Math.abs(current.tailLeft - clampedTailLeft) < 1
        ) {
          return current;
        }

        return {
          left: clampedLeft,
          top: clampedTop,
          tailLeft: clampedTailLeft,
        };
      });
    };

    updatePosition();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }

    const observer = new ResizeObserver(() => {
      updatePosition();
    });

    observer.observe(stage);
    observer.observe(anchor);
    observer.observe(bubble);
    window.addEventListener('resize', updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeLine, activeSpeakerId]);

  useEffect(() => {
    if (!isAutoPlaying || isComplete) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRevealedCount((count) => Math.min(lines.length, count + 1));
    }, getStoryLineDelayMs(activeLine?.text ?? ''));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeLine?.text, isAutoPlaying, isComplete, lines.length]);

  const handleNext = (): void => {
    if (isComplete) {
      return;
    }
    setIsAutoPlaying(false);
    setRevealedCount((count) => Math.min(lines.length, count + 1));
  };

  const handleSkip = (): void => {
    setIsAutoPlaying(false);
    setRevealedCount(lines.length);
  };

  const handleReplay = (): void => {
    setRevealedCount(1);
    setIsAutoPlaying(true);
    setShowFullScript(false);
  };

  return (
    <div className={`rounded-[1.75rem] p-6 shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-7 ${shellClassName}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={`text-xs font-bold uppercase tracking-[0.14em] ${accentClassName}`}>{eyebrow}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-50">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-600/70 bg-slate-950/40 px-3 py-1 text-xs font-semibold text-slate-300">
            {progressLabel}
          </span>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${accentClassName} border-current/30 bg-slate-950/35`}>
            {badge}
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-slate-700/80 bg-slate-950/50 px-4 py-5 sm:px-5 sm:py-6">
        <div ref={stageRef} className="relative grid min-h-[21rem] grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-4 sm:gap-6">
          {activeLine ? (
            <div
              ref={activeBubbleRef}
              className="absolute z-20 w-max max-w-[24rem] rounded-[1.35rem] border border-teal-300/55 bg-slate-900/95 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.24)]"
              style={{
                left: `${bubblePosition?.left ?? 12}px`,
                top: `${bubblePosition?.top ?? 10}px`,
                visibility: bubblePosition ? 'visible' : 'hidden',
              }}
            >
              <p className={`text-sm font-semibold ${storyCastById.get(activeSpeakerId ?? '')?.accentClassName ?? 'text-slate-100'}`}>
                {storyCastById.get(activeSpeakerId ?? '')?.name ?? ''}
              </p>
              <p className="mt-1 text-sm leading-7 text-slate-100">{activeLine.text}</p>
              <div
                className="absolute top-full h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-teal-300/55 bg-slate-900/95"
                style={{ left: `${bubblePosition?.tailLeft ?? 24}px` }}
              />
            </div>
          ) : null}

          <div className="flex h-full justify-start">
            {leftStageMember ? (
              <div className="flex h-full w-full flex-col justify-end items-start text-left">
                <div
                  ref={leftStageMember.id === activeSpeakerId ? activeAnchorRef : null}
                  className={`relative inline-flex flex-col items-center px-2 py-1 transition ${
                    leftStageMember.id === activeSpeakerId
                      ? 'translate-y-[-2px] brightness-110'
                      : 'opacity-90'
                  }`}
                >
                  <CastSprite
                    spriteSheet={leftStageMember.spriteSheet}
                    name={leftStageMember.name}
                    size={96}
                    unstyled
                  />
                  <p className={`mt-2 text-sm font-semibold ${leftStageMember.accentClassName}`}>{leftStageMember.name}</p>
                  <p className="text-xs text-slate-500">{leftStageMember.title}</p>
                </div>
              </div>
            ) : (
              <div className="invisible w-full" aria-hidden="true" />
            )}
          </div>

          <div className="flex h-full flex-wrap items-end justify-end gap-x-2 gap-y-4 sm:gap-x-4">
            {rightStageMembers.map((member) => {
              const isSpeaker = member.id === activeSpeakerId;

              return (
                <div key={member.id} className="flex flex-col items-end justify-end text-right">
                  <div
                    ref={isSpeaker ? activeAnchorRef : null}
                    className={`relative inline-flex flex-col items-center px-2 py-1 transition ${
                      isSpeaker
                        ? 'translate-y-[-2px] brightness-110'
                        : 'opacity-90'
                    }`}
                  >
                    <div className="scale-x-[-1]">
                      <CastSprite
                        spriteSheet={member.spriteSheet}
                        name={member.name}
                        size={96}
                        unstyled
                      />
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${member.accentClassName}`}>{member.name}</p>
                    <p className="text-xs text-slate-500">{member.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {!isComplete ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
            >
              Next line
            </button>
          ) : null}
          {!isComplete ? (
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900/60"
            >
              Skip to end
            </button>
          ) : null}
          {isComplete ? (
            <button
              type="button"
              onClick={handleReplay}
              className="rounded-lg border border-slate-600 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
            >
              Replay scene
            </button>
          ) : null}
          {isComplete ? (
            <button
              type="button"
              onClick={() => setShowFullScript((value) => !value)}
              className="rounded-lg border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-900/60"
            >
              {showFullScript ? 'Hide full script' : 'Reveal full script'}
            </button>
          ) : null}
          {!isComplete ? (
            <p className="self-center text-xs text-slate-500">
              {isAutoPlaying ? 'Playing automatically' : 'Auto-play paused'}
            </p>
          ) : null}
        </div>

        {isComplete && showFullScript ? (
          <div className="mt-5 rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Full Script</p>
            <div className="mt-3 space-y-3">
              {lines.map((line, index) => {
                const speaker = storyCastById.get(line.speakerId);

                return (
                  <div key={`${line.speakerId}-script-${index}`} className="rounded-xl border border-slate-800 bg-slate-950/45 px-4 py-3">
                    <p className={`text-sm font-semibold ${speaker?.accentClassName ?? 'text-slate-200'}`}>
                      {speaker?.name ?? line.speakerId}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-200">{line.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {isComplete ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">{takeawayTitle}</p>
          <p className="mt-2 text-sm leading-7 text-slate-200">{takeaway}</p>
        </div>
      ) : null}
    </div>
  );
};

const StoryColdOpen = ({ story }: { story: LessonStory }): JSX.Element => {
  const cast = getStoryCastMembers(story.coldOpen.cast);

  return (
    <StoryConversationPlayer
      title={story.coldOpen.title}
      eyebrow="Northwind Story Beat"
      badge="Cold Open"
      cast={cast}
      lines={story.coldOpen.lines}
      takeawayTitle="Concept Hook"
      takeaway={story.coldOpen.conceptHook}
      accentClassName="text-amber-300"
      shellClassName="border border-amber-400/25 bg-[linear-gradient(135deg,rgba(120,53,15,0.24),rgba(15,23,42,0.82))]"
    />
  );
};

const StoryCallbackCard = ({ story }: { story: LessonStory }): JSX.Element => {
  const cast = getStoryCastMembers(story.callback.cast);

  return (
    <StoryConversationPlayer
      title={story.callback.title}
      eyebrow="Northwind Callback"
      badge="Lesson Payoff"
      cast={cast}
      lines={story.callback.lines}
      takeawayTitle="Why It Matters"
      takeaway={story.callback.takeaway}
      accentClassName="text-cyan-300"
      shellClassName="border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(8,47,73,0.22),rgba(15,23,42,0.82))]"
    />
  );
};

const StoryCutsceneSlide = ({
  story,
  slideKey,
}: {
  story: LessonStory;
  slideKey: 'cold_open' | 'callback';
}): JSX.Element => (
  <div className={`${baseSlidePanelClass} overflow-hidden`}>
    {slideKey === 'cold_open' ? <StoryColdOpen story={story} /> : <StoryCallbackCard story={story} />}
  </div>
);

const SlideIntro = ({ slide }: { slide: IntroSlide }): JSX.Element => (
  <div className={`${baseSlidePanelClass} p-12 text-center sm:p-16`}>
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-400">{slide.week}</p>
    <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-bold leading-tight text-slate-50 sm:text-4xl">
      {slide.question}
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300">{slide.body}</p>
  </div>
);

const SlideConcept = ({ slide }: { slide: ConceptSlide }): JSX.Element => (
  <div className={`${baseSlidePanelClass} overflow-hidden`}>
    <div className={`${slideHeaderClass} text-teal-300`}>
      {slide.title}
    </div>
    <div
      className={`slide-body ${slideContentPaddingClass}`}
      dangerouslySetInnerHTML={{ __html: decorateLessonHtml(slide.body) }}
    />
  </div>
);

const SlideBullets = ({ slide }: { slide: BulletsSlide }): JSX.Element => (
  <div className={`${baseSlidePanelClass} overflow-hidden`}>
    <div className={`${slideHeaderClass} text-violet-300`}>
      {slide.title}
    </div>
    <ul className={`space-y-4 ${slideContentPaddingClass}`}>
      {slide.items.map((item, index) => (
        <li key={index} className="flex items-start gap-4 text-base leading-8 text-slate-100">
          <span
            aria-hidden="true"
            className="mt-[1rem] block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300"
          />
          <div
            className="lesson-inline-richtext flex-1"
            dangerouslySetInnerHTML={{ __html: decorateLessonHtml(item) }}
          />
        </li>
      ))}
    </ul>
  </div>
);

const SlideQuote = ({ slide }: { slide: QuoteSlide }): JSX.Element => (
  <div className={`${baseSlidePanelClass} border-l-4 border-l-teal-400 px-8 py-10 sm:px-10 sm:py-12`}>
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-400">{slide.label}</p>
    <blockquote className="mt-5 max-w-4xl text-xl italic leading-9 text-slate-100">{slide.text}</blockquote>
    <p
      className="lesson-inline-richtext mt-5 text-sm leading-7 text-slate-400"
      dangerouslySetInnerHTML={{ __html: decorateLessonHtml(slide.source) }}
    />
  </div>
);

const SlideTerm = ({ slide }: { slide: TermSlide }): JSX.Element => (
  <div className={`${baseSlidePanelClass} px-8 py-9 sm:px-10 sm:py-10`}>
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{slide.label}</p>
    <p className="mt-4 inline-block rounded-2xl border border-cyan-400/25 bg-cyan-500/10 px-5 py-3 text-2xl font-bold text-cyan-100">
      {slide.term}
    </p>
    <div
      className="slide-body mt-6"
      dangerouslySetInnerHTML={{ __html: decorateLessonHtml(slide.def) }}
    />
  </div>
);

const SlideCheck = ({ slide }: { slide: CheckSlide }): JSX.Element => {
  const [revealed, setRevealed] = useState(false);
  const [selectedBinaryChoice, setSelectedBinaryChoice] = useState<'True' | 'False' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const presentation = getCheckSlidePresentation(slide.q);
  const partLabels = presentation.mode === 'multi_part' ? extractPartLabels(slide.q) : [];
  const choiceOptions = extractChoiceOptions(slide.q);
  const fillBlankData = extractFillBlankData(slide.q, slide.a);
  const [assignedBlankKeys, setAssignedBlankKeys] = useState<Array<string | null>>(
    fillBlankData ? Array.from({ length: fillBlankData.blankCount }, () => null) : [],
  );
  const [fillBlankChecked, setFillBlankChecked] = useState<boolean | null>(null);
  const optionsByKey = new Map(choiceOptions.map((option) => [option.key, option]));

  useEffect(() => {
    setRevealed(false);
    setSelectedBinaryChoice(null);
    setSelectedOption(null);
    setFillBlankChecked(null);
    setAssignedBlankKeys(fillBlankData ? Array.from({ length: fillBlankData.blankCount }, () => null) : []);
  }, [slide.q, slide.a, fillBlankData?.blankCount]);

  const handleDropOption = (blankIndex: number, optionKey: string): void => {
    setAssignedBlankKeys((current) => {
      const next = current.map((value, index) =>
        value === optionKey && index !== blankIndex ? null : value,
      );
      next[blankIndex] = optionKey;
      return next;
    });
  };

  const handleClearBlank = (blankIndex: number): void => {
    setAssignedBlankKeys((current) => current.map((value, index) => (index === blankIndex ? null : value)));
  };

  const handleConfirmFillBlank = (): void => {
    if (!fillBlankData) {
      return;
    }

    const isCorrect = fillBlankData.correctKeys.every((key, index) => assignedBlankKeys[index] === key);
    setFillBlankChecked(isCorrect);
    setRevealed(true);
  };

  const availableChoiceOptions =
    fillBlankData && fillBlankData.options.length > 0
      ? fillBlankData.options.filter((option) => !assignedBlankKeys.includes(option.key))
      : choiceOptions;

  return (
    <div className={`${baseSlidePanelClass} px-8 py-8 sm:px-10 sm:py-9`}>
      <div className="max-w-4xl space-y-4">
        <p className={`text-xs font-bold uppercase tracking-[0.14em] ${presentation.accentClass}`}>
          {presentation.eyebrow}
        </p>
        <h3 className="text-2xl font-semibold text-slate-50 sm:text-[2rem]">{presentation.title}</h3>
        <p className="max-w-3xl text-base leading-8 text-slate-300">{presentation.description}</p>
      </div>

      <div className="mt-8 rounded-[1.5rem] border border-slate-800/90 bg-slate-950/55 p-6 shadow-[inset_0_1px_0_rgba(148,163,184,0.04)] sm:p-7">
        <p className="whitespace-pre-line text-base leading-8 text-slate-100 sm:text-[1.05rem]">{slide.q}</p>

        {presentation.mode === 'binary' ? (
          <div className="mt-5 flex gap-3">
            {(['True', 'False'] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setSelectedBinaryChoice(choice)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                  selectedBinaryChoice === choice
                    ? 'border-slate-200 bg-slate-100 text-slate-950'
                    : presentation.buttonClass
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : null}

        {fillBlankData && fillBlankData.options.length > 0 ? (
          <div className="mt-5 space-y-4">
            {renderFillBlankPrompt(
              fillBlankData.prompt,
              assignedBlankKeys,
              optionsByKey,
              handleDropOption,
              handleClearBlank,
            )}
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-300">Option cards</p>
              <div className="flex flex-wrap gap-3">
                {availableChoiceOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', option.key);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={() => {
                      const firstEmptyIndex = assignedBlankKeys.findIndex((value) => value === null);
                      if (firstEmptyIndex >= 0) {
                        handleDropOption(firstEmptyIndex, option.key);
                      }
                    }}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${presentation.buttonClass}`}
                  >
                    <span className="mr-2 opacity-70">{option.key}.</span>
                    {option.label}
                  </button>
                ))}
                {availableChoiceOptions.length === 0 ? (
                  <p className="text-sm text-slate-500">All options placed. Click a blank to clear it if needed.</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmFillBlank}
                disabled={assignedBlankKeys.some((value) => value === null)}
                className="rounded-lg border border-cyan-500/60 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirm answer
              </button>
              <button
                type="button"
                onClick={() => {
                  setAssignedBlankKeys(Array.from({ length: fillBlankData.blankCount }, () => null));
                  setFillBlankChecked(null);
                  setRevealed(false);
                }}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                Reset blanks
              </button>
            </div>
            {fillBlankChecked !== null ? (
              <p className={`text-sm font-medium ${fillBlankChecked ? 'text-emerald-300' : 'text-rose-300'}`}>
                {fillBlankChecked ? 'Correct. Review why below.' : 'Not quite. Review the explanation below.'}
              </p>
            ) : null}
          </div>
        ) : null}

        {choiceOptions.length > 0 && !fillBlankData ? (
          <div className="mt-5 space-y-3">
            <p className="text-sm font-medium text-slate-300">
              {presentation.mode === 'multi_part' ? 'Step through each part' : 'Choose an option'}
            </p>
            <div className="flex flex-wrap gap-3">
              {choiceOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedOption(option.key)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    selectedOption === option.key
                      ? 'border-slate-200 bg-slate-100 text-slate-950'
                      : presentation.buttonClass
                  }`}
                >
                  <span className="mr-2 opacity-70">{option.key}.</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {presentation.mode === 'fill_blank' && !fillBlankData && choiceOptions.length === 0 ? (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
            Fill in the missing term mentally first, then reveal the explanation to check the exact wording.
          </div>
        ) : null}

        {presentation.mode === 'multi_part' ? (
          <div className="mt-5 space-y-3">
            {partLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {partLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-200"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}
            {choiceOptions.length === 0 ? (
              <p className="text-sm leading-relaxed text-slate-400">
                Work through each part mentally, then reveal the explanation to compare your structure.
              </p>
            ) : null}
          </div>
        ) : null}

        {(presentation.mode === 'case' || presentation.mode === 'reflection') && choiceOptions.length === 0 ? (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
            Pause and make your call first. Then reveal the explanation and compare it with your reasoning.
          </div>
        ) : null}

        {!fillBlankData ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setRevealed((current) => !current)}
              className={`rounded-lg border bg-transparent px-5 py-2 text-sm font-semibold ${presentation.buttonClass}`}
            >
              {revealed ? 'Hide explanation' : 'Reveal explanation'}
            </button>
          </div>
        ) : null}

        {revealed ? (
          <div
            className="slide-body mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-5 py-4 text-slate-100"
            dangerouslySetInnerHTML={{ __html: decorateLessonHtml(slide.a) }}
          />
        ) : null}
      </div>
    </div>
  );
};

const SlideSummary = ({ slide }: { slide: SummarySlide }): JSX.Element => (
  <div className="min-h-full rounded-[1.75rem] border border-emerald-500/30 bg-slate-900/70 px-8 py-9 shadow-[0_24px_80px_rgba(6,78,59,0.16)] sm:px-10 sm:py-10">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">Summary</p>
    <h3 className="mt-4 text-xl font-semibold text-slate-50">{slide.title}</h3>
    <ul className="mt-6 space-y-3">
      {slide.points.map((point, index) => (
        <li key={index} className="flex gap-3 text-base leading-8 text-slate-100">
          <span className="mt-2 shrink-0 font-bold text-emerald-300">&#10003;</span>
          <span>
            {(() => {
              const summaryLabel = splitSummaryLabel(point);
              if (!summaryLabel) {
                return point;
              }

              return (
                <>
                  <span className={getLessonHighlightClassName(summaryLabel.label)}>{summaryLabel.label}</span>{' '}
                  {summaryLabel.body}
                </>
              );
            })()}
          </span>
        </li>
      ))}
    </ul>
    <p className="mt-8 border-t border-slate-700/80 pt-6 text-base leading-8 text-slate-300">{slide.cta}</p>
  </div>
);

const SlideDiagram = ({ slide, cropOverrideKey }: { slide: DiagramSlide; cropOverrideKey?: string }): JSX.Element => {
  const canvasStageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const crop = getLessonDiagramCrop(slide, cropOverrideKey);
  const renderKey = `${cropOverrideKey ?? 'no-override'}:${slide.src}:${slide.page}:${
    crop ? `${crop.x}:${crop.y}:${crop.width}:${crop.height}` : 'full'
  }`;

  useEffect(() => {
    const stage = canvasStageRef.current;
    if (!stage) return;

    const updateSize = (): void => {
      setContainerWidth((current) => {
        const rounded = Math.max(1, Math.round(stage.clientWidth));
        return current === rounded ? current : rounded;
      });
      setContainerHeight((current) => {
        const rounded = Math.max(1, Math.round(stage.clientHeight));
        return current === rounded ? current : rounded;
      });
    };

    updateSize();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(stage);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setStatus('loading');
    setErrorMsg('');
  }, [renderKey]);

  useEffect(() => {
    let cancelled = false;
    if (containerWidth <= 0 || containerHeight <= 0) return;

    const render = async (): Promise<void> => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjsLib = (await import('pdfjs-dist')) as any;
        const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default as string;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

        let pdf = pdfDocCache.get(slide.src);
        if (!pdf) {
          pdf = await pdfjsLib.getDocument(slide.src).promise;
          pdfDocCache.set(slide.src, pdf);
        }

        if (cancelled) return;

        const page = await pdf.getPage(slide.page);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / (baseViewport.width as number);
        const viewport = page.getViewport({ scale });

        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = viewport.width as number;
        fullCanvas.height = viewport.height as number;

        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) return;

        await page.render({ canvasContext: fullCtx, viewport }).promise;

        const sourceX = crop ? fullCanvas.width * crop.x : 0;
        const sourceY = crop ? fullCanvas.height * crop.y : 0;
        const sourceWidth = crop ? fullCanvas.width * crop.width : fullCanvas.width;
        const sourceHeight = crop ? fullCanvas.height * crop.height : fullCanvas.height;
        const widthLimitedHeight = (sourceHeight / sourceWidth) * containerWidth;
        const renderWidth = Math.max(
          1,
          Math.round(widthLimitedHeight > containerHeight ? (containerHeight * sourceWidth) / sourceHeight : containerWidth),
        );
        const renderHeight = Math.max(1, Math.round((sourceHeight / sourceWidth) * renderWidth));

        canvas.width = renderWidth;
        canvas.height = renderHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, renderWidth, renderHeight);
        ctx.drawImage(
          fullCanvas,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          renderWidth,
          renderHeight,
        );
        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to render diagram');
          setStatus('error');
        }
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [containerHeight, containerWidth, crop?.height, crop?.width, crop?.x, crop?.y, slide.page, slide.src]);

  return (
    <div className={`${baseSlidePanelClass} flex h-full min-h-0 flex-col overflow-hidden`}>
      <div className={`${slideHeaderClass} shrink-0 text-amber-300`}>
        Diagram - {slide.caption}
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-5">
        <div ref={canvasStageRef} className="relative flex min-h-0 flex-1 items-center justify-center">
          <canvas
            ref={canvasRef}
            className={`block h-auto max-h-full max-w-full rounded-lg ${status === 'error' ? 'hidden' : ''}`}
          />
          {status === 'loading' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-sm text-slate-500">
              Rendering page {slide.page}...
            </div>
          ) : null}
          {status === 'error' ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-rose-400">
              Could not render diagram: {errorMsg}
            </div>
          ) : null}
        </div>
        {status === 'ready' ? (
          <p className="mt-3 shrink-0 text-center text-xs text-slate-500">
            {slide.caption} - cropped from source PDF p.{slide.page}
          </p>
        ) : null}
      </div>
    </div>
  );
};

const RenderSlide = ({
  renderedSlide,
  cropOverrideKey,
}: {
  renderedSlide: RenderedLessonSlide;
  cropOverrideKey?: string;
}): JSX.Element => {
  if (renderedSlide.kind === 'story') {
    return <StoryCutsceneSlide story={renderedSlide.story} slideKey={renderedSlide.slideKey} />;
  }

  switch (renderedSlide.slide.type) {
    case 'intro':
      return <SlideIntro slide={renderedSlide.slide} />;
    case 'concept':
      return <SlideConcept slide={renderedSlide.slide} />;
    case 'bullets':
      return <SlideBullets slide={renderedSlide.slide} />;
    case 'quote':
      return <SlideQuote slide={renderedSlide.slide} />;
    case 'term':
      return <SlideTerm slide={renderedSlide.slide} />;
    case 'check':
      return <SlideCheck slide={renderedSlide.slide} />;
    case 'summary':
      return <SlideSummary slide={renderedSlide.slide} />;
    case 'diagram':
      return <SlideDiagram slide={renderedSlide.slide} cropOverrideKey={cropOverrideKey} />;
  }
};

const LessonViewer = (): JSX.Element => {
  const navigate = useNavigate();
  const { lessonIdx } = useParams<{ lessonIdx: string }>();
  const [searchParams] = useSearchParams();
  const idx = Number(lessonIdx ?? '0');
  const lesson = SECURITY_PLUS_LESSONS[idx];

  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const slideViewportRef = useRef<HTMLDivElement | null>(null);

  const lessonStory = lesson ? getLessonStory(lesson.id) : undefined;
  const renderedSlides: RenderedLessonSlide[] = lesson
    ? [
        ...(lessonStory ? [{ kind: 'story', slideKey: 'cold_open', story: lessonStory } as const] : []),
        ...lesson.slides.map((slide) => ({ kind: 'lesson', slide } as const)),
        ...(lessonStory ? [{ kind: 'story', slideKey: 'callback', story: lessonStory } as const] : []),
      ]
    : [];
  const total = renderedSlides.length;
  const requestedSlideParam = Number(searchParams.get('slide') ?? '1') - 1;
  const hasRequestedSlide = searchParams.has('slide');
  const requestedSlideIndex = clampSlideIndex(requestedSlideParam, total);
  const isLast = current === total - 1;
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  const goNext = useCallback(() => {
    if (!lesson) {
      return;
    }
    if (current >= total - 1) {
      markLessonDone(lesson.id);
      setFinished(true);
      return;
    }
    setCurrent((value) => value + 1);
  }, [current, lesson, total]);

  const goPrev = useCallback(() => {
    setCurrent((value) => Math.max(0, value - 1));
  }, []);

  useEffect(() => {
    if (finished) {
      return;
    }
    const handler = (event: KeyboardEvent): void => {
      const active = document.activeElement as HTMLElement | null;
      if (active && ['INPUT', 'SELECT', 'TEXTAREA'].includes(active.tagName)) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        goPrev();
      }
      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [finished, goNext, goPrev]);

  useEffect(() => {
    slideViewportRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [current, lesson?.id]);

  useEffect(() => {
    setCurrent(hasRequestedSlide ? requestedSlideIndex : 0);
    setFinished(false);
  }, [hasRequestedSlide, lesson?.id, requestedSlideIndex]);

  if (!lesson) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <button
          type="button"
          onClick={() => navigate('/lessons')}
          className="rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm hover:bg-slate-800"
        >
          &larr; Back to Lessons
        </button>
      </section>
    );
  }

  if (finished) {
    const hasNext = idx < SECURITY_PLUS_LESSONS.length - 1;
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-10 text-center">
          <p className="text-4xl">Target complete</p>
          <h2 className="mt-4 text-2xl font-bold text-teal-300">{lesson.title} Complete</h2>
          <p className="mt-2 text-slate-400">
            You finished all {total} slides for {lesson.subtitle}.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/lessons')}
              className="rounded-md bg-primary px-5 py-2 font-semibold text-white hover:bg-teal-600"
            >
              &larr; Back to Lessons
            </button>
            {hasNext ? (
              <button
                type="button"
                onClick={() => {
                  setFinished(false);
                  setCurrent(0);
                  navigate(`/lessons/${idx + 1}`);
                }}
                className="rounded-md border border-slate-700 bg-transparent px-5 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Start {SECURITY_PLUS_LESSONS[idx + 1]?.title} &rarr;
              </button>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  const renderedSlide = renderedSlides[current];
  const cropOverrideKey =
    renderedSlide?.kind === 'lesson' && renderedSlide.slide.type === 'diagram'
      ? getDiagramStorageKey(lesson.id, renderedSlide.slide)
      : undefined;

  return (
    <section className="mx-auto grid h-full w-full max-w-none min-h-0 grid-rows-[auto_auto_minmax(0,7fr)_minmax(5.5rem,1fr)] gap-6 overflow-hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/lessons')}
          className="rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-teal-300"
        >
          &larr; Lessons
        </button>
        <div>
          <p className="text-sm font-semibold">
            {lesson.title} - {lesson.subtitle}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            Slide {current + 1} of {total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div
        ref={slideViewportRef}
        data-testid="lesson-slide-viewport"
        className="min-h-0 overflow-y-auto px-1 sm:px-2"
      >
        <div className="mx-auto h-full min-h-full w-full" key={`${lesson.id}-${current}`}>
          {renderedSlide ? <RenderSlide renderedSlide={renderedSlide} cropOverrideKey={cropOverrideKey} /> : null}
        </div>
      </div>

      <div
        data-testid="lesson-nav"
        className="flex min-h-0 items-end border-t border-slate-800 bg-slate-950/90 pt-4 backdrop-blur"
      >
        <div className="w-full space-y-3">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={current === 0}
              className="rounded-md border border-slate-700 bg-transparent px-6 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
            >
              &larr; Prev
            </button>
            <span className="min-w-[60px] text-center text-xs text-slate-500">
              {current + 1} / {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              className={`rounded-md px-6 py-2 text-sm font-semibold ${
                isLast
                  ? 'bg-violet-600 text-white hover:bg-violet-500'
                  : 'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800'
              }`}
            >
              {isLast ? 'Finish' : 'Next ->'}
            </button>
          </div>
          <p className="text-center text-xs text-slate-600">
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[0.65rem]">
              &larr;
            </kbd>{' '}
            prev{' '}
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[0.65rem]">
              &rarr;
            </kbd>{' '}
            /{' '}
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 font-mono text-[0.65rem]">
              Space
            </kbd>{' '}
            next
          </p>
        </div>
      </div>
    </section>
  );
};

export default LessonViewer;
