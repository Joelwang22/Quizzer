import { GENERATED_SECURITY_PLUS_LESSONS } from './securityPlusLessons.generated';

export interface Slide {
  type: 'intro' | 'concept' | 'bullets' | 'quote' | 'term' | 'check' | 'summary' | 'diagram';
}

export interface DiagramSlide extends Slide {
  type: 'diagram';
  /** URL path to the PDF (relative to the app root, served from public/) */
  src: string;
  /** 1-based page number to render */
  page: number;
  /** Short caption shown below the rendered page */
  caption: string;
}

export interface IntroSlide extends Slide {
  type: 'intro';
  week: string;
  question: string;
  body: string;
}

export interface ConceptSlide extends Slide {
  type: 'concept';
  title: string;
  body: string;
}

export interface BulletsSlide extends Slide {
  type: 'bullets';
  title: string;
  items: string[];
}

export interface QuoteSlide extends Slide {
  type: 'quote';
  label: string;
  text: string;
  source: string;
}

export interface TermSlide extends Slide {
  type: 'term';
  label: string;
  term: string;
  def: string;
}

export interface CheckSlide extends Slide {
  type: 'check';
  q: string;
  a: string;
}

export interface SummarySlide extends Slide {
  type: 'summary';
  title: string;
  points: string[];
  cta: string;
}

export type LessonSlide =
  | IntroSlide
  | ConceptSlide
  | BulletsSlide
  | QuoteSlide
  | TermSlide
  | CheckSlide
  | SummarySlide
  | DiagramSlide;

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  slides: LessonSlide[];
}

const STORAGE_KEY = 'security_plus_lessons_done';

export function getDoneLessons(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function markLessonDone(id: string): void {
  const done = getDoneLessons();
  if (!done.includes(id)) {
    done.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }
}

const SUPPLEMENTAL_SECURITY_PLUS_LESSONS: Lesson[] = [
  {
    id: '4-9-data-sources-support-investigations',
    title: 'Lesson 101',
    subtitle: '4.9 - Data Sources to Support Investigations',
    icon: 'DS',
    slides: [
      {
        type: 'intro',
        week: '4.9 - Data Sources to Support Investigations',
        question: 'Given a specific investigative scenario, which data source most directly answers the question in front of you?',
        body: 'SY0-701 objective 4.9 is scenario-based: given an investigation type, choose the right data source. This is different from simply cataloguing log types. The exam tests whether you can match a behavior — account compromise, data exfiltration, malware execution, C2 communication — to the source that most directly validates it. The best source is always the one closest to the behavior you need to confirm.',
      },
      {
        type: 'concept',
        title: 'Match Source to Investigative Question',
        body: '<p>Every investigation starts with a question. The source you reach for first should be the one that most directly answers that question:</p><ul><li><strong>Authentication abuse / account compromise</strong> — Identity and directory logs (Active Directory, Azure AD, LDAP), authentication event logs, MFA challenge logs. Look for failed logins, impossible travel, token reuse, and privilege escalation events.</li><li><strong>Malware execution on a host</strong> — Endpoint/EDR telemetry, Windows Security Event Log (Event ID 4688 process creation, 7045 new service), Sysmon process tree, application logs. Look for unexpected parent-child process relationships and unsigned binaries.</li><li><strong>Data exfiltration</strong> — NetFlow/IPFIX (large outbound volume to unfamiliar IPs), DLP alerts, proxy/web filter logs, DNS logs (DNS tunneling). Look for sustained high-volume outbound sessions at odd hours.</li><li><strong>Network intrusion path</strong> — Firewall logs, IDS/IPS alerts, NetFlow, packet captures. Reconstruct the lateral movement path from the initial entry point inward.</li><li><strong>C2 communication</strong> — DNS logs (beaconing, tunneling), NetFlow (regular timed connections), proxy logs (unusual user-agents, encoded URIs). Beaconing appears as periodic connections at regular intervals.</li><li><strong>Insider threat</strong> — DLP, UEBA behavior baselines, file access audit logs, badge and physical access records. Correlate digital access with physical presence.</li></ul>',
      },
      {
        type: 'concept',
        title: 'NetFlow, sFlow, and IPFIX',
        body: '<p><strong>NetFlow</strong> (Cisco), <strong>sFlow</strong> (sampling-based), and <strong>IPFIX</strong> (IETF standard, the successor to NetFlow v9) capture IP flow metadata — not payload content. A flow record includes: source and destination IP and port, protocol, packet count, byte count, and session duration.</p><p><strong>Why flow data matters for investigations:</strong></p><ul><li>Detects large outbound data transfers without needing to decrypt or capture payload.</li><li>Reveals C2 beaconing patterns — regular connections to the same external IP every N minutes are visible in flow timing and byte counts.</li><li>Shows lateral movement — unusual internal east-west connections between workstations not normally communicating.</li><li>Low storage cost compared to full packet captures — flow data can be retained for months, enabling retrospective investigation after an indicator is discovered.</li></ul><p><strong>Limitation</strong> — NetFlow/IPFIX show that traffic occurred and how much, but not what it contained. Confirm the payload with packet captures when content-level verification is required.</p>',
      },
      {
        type: 'concept',
        title: 'Vulnerability Scans and Threat Intelligence as Investigative Context',
        body: '<p><strong>Vulnerability scan data in investigations</strong> — When investigating a compromise, vulnerability scan results tell you which weaknesses existed on affected systems at the time of the incident. This helps establish the likely attack vector (was CVE-2023-XXXX patched before or after the breach?), validate attacker capability, and prioritize remediation. Scan results are not real-time; they represent a point-in-time snapshot.</p><p><strong>Threat intelligence as investigative context</strong> — Published indicators of compromise (IOCs) — IP addresses, domains, file hashes, YARA rules — let investigators check whether observed artifacts match known threat actor infrastructure. Sources include commercial threat intel feeds, government advisories (CISA KEV), open-source platforms (MISP, VirusTotal, Shodan), and ISAC sharing communities.</p><p><strong>How to use it:</strong> If a suspicious outbound IP appears in NetFlow, query threat intel to see if it is attributed to a known threat actor or malware family. If it matches, you have both confirmation of the incident type and context for the threat actor TTPs — which tells you what else to look for.</p>',
      },
      {
        type: 'concept',
        title: 'Correlation Beats Single-Source Assumptions',
        body: '<p>No single source tells the complete story. Each source has blind spots:</p><ul><li>Firewall logs show traffic was allowed but not whether the payload was malicious.</li><li>IDS/IPS alerts confirm a signature matched but not whether the exploit succeeded.</li><li>Endpoint logs show process execution but not the network activity that followed.</li></ul><p><strong>Strong investigations stack sources.</strong> A suspicious authentication event in the identity log becomes high-confidence when the endpoint log shows a new scheduled task created seconds later and NetFlow shows beaconing outbound traffic that began at the same timestamp.</p><p><strong>On exam questions</strong> — when two sources both seem relevant, choose the one closest to the specific behavior described. If the question involves network volume or exfiltration, NetFlow beats firewall logs. If it involves process execution, EDR beats network logs. If it involves file content or protocol detail, packet captures beat flow data.</p>',
      },
      {
        type: 'term',
        label: '4.9',
        term: 'NetFlow / IPFIX',
        def: 'A network telemetry protocol that records IP flow metadata — source and destination IP and port, protocol, packet count, byte count, and session duration — without capturing payload content. Originally developed by Cisco as NetFlow; standardized by the IETF as IPFIX. Used in investigations to detect data exfiltration by volume, identify C2 beaconing patterns, and map lateral movement paths. Low storage cost compared to full packet captures, enabling months of historical retention.',
      },
      {
        type: 'check',
        q: 'An analyst suspects data exfiltration to an external IP. No IDS/IPS alerts have fired. The analyst needs to confirm large outbound data transfers without examining packet contents. Which data source is MOST useful?\n\n(A) Windows Security Event Log on the suspected host\n(B) IDS/IPS signature alert log\n(C) NetFlow or IPFIX flow records\n(D) Vulnerability scan report',
        a: 'C — NetFlow/IPFIX records capture byte counts, packet counts, and session duration for every IP flow. An unusually large outbound session to an unfamiliar IP is immediately visible in flow data without inspecting payload. IDS/IPS (B) fires on signatures — if no alert fired, the traffic pattern is not in the signature database. Windows Event Log (A) shows host-level activity, not network volume. Vulnerability scans (D) show patch posture, not active traffic.',
      },
      {
        type: 'summary',
        title: '4.9 - Data Sources to Support Investigations — Summary',
        points: [
          'Match the data source to the investigative question — the best source is the one closest to the specific behavior you need to confirm.',
          'NetFlow/IPFIX captures flow metadata (volume, timing, endpoints) without payload — essential for detecting exfiltration and C2 beaconing.',
          'Vulnerability scan results establish attack-vector context; threat intelligence enriches observed indicators with known actor attribution.',
          'Strong investigations correlate identity, host, application, and network sources — no single feed tells the complete story.',
        ],
        cta: 'You have completed the full Security+ SY0-701 lesson path. Review any lessons where you scored below your mastery threshold before your exam.',
      },
    ],
  },
];

export const SECURITY_PLUS_LESSONS: Lesson[] = [
  ...GENERATED_SECURITY_PLUS_LESSONS.slice(0, 100),
  ...SUPPLEMENTAL_SECURITY_PLUS_LESSONS,
  ...GENERATED_SECURITY_PLUS_LESSONS.slice(100),
];

export interface LessonSearchResult {
  lessonId: Lesson['id'];
  lessonIndex: number;
  lessonTitle: string;
  lessonSubtitle: string;
  slideIndex: number;
  slideType: LessonSlide['type'];
  slideLabel: string;
  snippet: string;
}

const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ');

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

export const getSlideLabel = (slide: LessonSlide): string => {
  switch (slide.type) {
    case 'intro':
      return slide.question;
    case 'concept':
    case 'bullets':
    case 'summary':
      return slide.title;
    case 'quote':
      return slide.label;
    case 'term':
      return slide.term;
    case 'check':
      return slide.q;
    case 'diagram':
      return slide.caption;
  }
};

const getSlideSearchText = (slide: LessonSlide): string => {
  switch (slide.type) {
    case 'intro':
      return normalizeWhitespace([slide.week, slide.question, slide.body].join(' '));
    case 'concept':
      return normalizeWhitespace([slide.title, stripHtml(slide.body)].join(' '));
    case 'bullets':
      return normalizeWhitespace([slide.title, ...slide.items.map(stripHtml)].join(' '));
    case 'quote':
      return normalizeWhitespace([slide.label, slide.text, stripHtml(slide.source)].join(' '));
    case 'term':
      return normalizeWhitespace([slide.label, slide.term, stripHtml(slide.def)].join(' '));
    case 'check':
      return normalizeWhitespace([slide.q, stripHtml(slide.a)].join(' '));
    case 'summary':
      return normalizeWhitespace([slide.title, ...slide.points, slide.cta].join(' '));
    case 'diagram':
      return normalizeWhitespace(slide.caption);
  }
};

const createSnippet = (searchText: string, queryTerms: string[]): string => {
  const lowerText = searchText.toLowerCase();
  const firstMatchTerm = queryTerms.find((term) => lowerText.includes(term)) ?? queryTerms[0] ?? '';
  const matchIndex = firstMatchTerm ? lowerText.indexOf(firstMatchTerm) : -1;

  if (matchIndex === -1) {
    return searchText.slice(0, 160).trim();
  }

  const start = Math.max(0, matchIndex - 55);
  const end = Math.min(searchText.length, matchIndex + Math.max(firstMatchTerm.length, 24) + 85);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < searchText.length ? '...' : '';

  return `${prefix}${searchText.slice(start, end).trim()}${suffix}`;
};

export const searchLessons = (query: string): LessonSearchResult[] => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) {
    return [];
  }

  const queryTerms = trimmedQuery.split(/\s+/).filter(Boolean);
  const results: LessonSearchResult[] = [];

  SECURITY_PLUS_LESSONS.forEach((lesson, lessonIndex) => {
    lesson.slides.forEach((slide, slideIndex) => {
      const searchText = getSlideSearchText(slide);
      const lowerText = searchText.toLowerCase();
      const isMatch = queryTerms.every((term) => lowerText.includes(term));

      if (!isMatch) {
        return;
      }

      results.push({
        lessonId: lesson.id,
        lessonIndex,
        lessonTitle: lesson.title,
        lessonSubtitle: lesson.subtitle,
        slideIndex,
        slideType: slide.type,
        slideLabel: getSlideLabel(slide),
        snippet: createSnippet(searchText, queryTerms),
      });
    });
  });

  return results.slice(0, 24);
};
