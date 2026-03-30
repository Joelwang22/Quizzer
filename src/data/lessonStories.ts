import type { Lesson } from './securityPlusLessons';
import type { StoryCastMember } from './storyCast';

type StoryCastId = StoryCastMember['id'];

export interface StoryDialogueLine {
  speakerId: StoryCastId;
  text: string;
}

export interface LessonStoryScene {
  title: string;
  cast: StoryCastId[];
  lines: StoryDialogueLine[];
  conceptHook: string;
}

export interface LessonStoryCallback {
  title: string;
  cast: StoryCastId[];
  lines: StoryDialogueLine[];
  takeaway: string;
}

export interface LessonStory {
  coldOpen: LessonStoryScene;
  callback: LessonStoryCallback;
}

const LESSON_STORIES_BY_ID: Partial<Record<Lesson['id'], LessonStory>> = {
  '1-1-security-controls': {
    coldOpen: {
      title: 'The Security Strategy Is A Laminated Sign',
      cast: ['noah-reed', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Welcome to Northwind. As you can see, the server room is protected by a laminated AUTHORIZED PERSONNEL ONLY sign.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Does the sign connect to anything, or is it more of a motivational control?',
        },
        {
          speakerId: 'priya-nair',
          text: 'It is a directive control with delusions of grandeur.',
        },
      ],
      conceptHook:
        'The joke only works because different controls do different jobs. A sign can direct or deter, but it does not replace the preventive, detective, and corrective controls around it.',
    },
    callback: {
      title: 'Noah Labels The Damage',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So next time I should label the control by who implements it and by what it actually does?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes. If you call a deterrent sign a full security strategy again, Marty will put it in a budget meeting.',
        },
      ],
      takeaway:
        'That is the key exam move: identify who implements the control and what the control is actually doing in the scenario.',
    },
  },
  '1-2-the-cia-triad': {
    coldOpen: {
      title: 'Three Different Problems, One Very Loud Morning',
      cast: ['glen-foster', 'denise-park', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The CRM is down, so sales is operating on vibes.',
        },
        {
          speakerId: 'denise-park',
          text: 'Payroll numbers changed in the spreadsheet, and now overtime looks fictional.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'A personnel file just showed up in the wrong inbox, which feels bad in a deeply specific way.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So availability is down, integrity is compromised, and confidentiality just walked into legal exposure.',
        },
      ],
      conceptHook:
        'The CIA Triad matters because "security issue" is too vague. The right fix depends on whether the failure is disclosure, tampering, or loss of access.',
    },
    callback: {
      title: 'Marty Wants One Universal Fix',
      cast: ['marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Can we restore the confidentiality one first and circle back to the rest after lunch?',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is not how properties work. Disclosure, tampering, and downtime are different failures with different fixes.',
        },
      ],
      takeaway:
        'Confidentiality, integrity, and availability are separate properties, so you diagnose and defend them differently.',
    },
  },
  '1-2-non-repudiation': {
    coldOpen: {
      title: 'Everyone Denies Clicking Approve',
      cast: ['denise-park', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'A questionable vendor payment was approved at 6:12 a.m., and three people have already told me it absolutely was not them.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'In fairness, the approval used the shared finance account, so the logs currently identify the culprit as "everyone."',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is not accountability. That is a group project with legal consequences.',
        },
      ],
      conceptHook:
        'Non-repudiation exists so actions stay attributable. If a system cannot prove who performed the action, denials become very hard to challenge.',
    },
    callback: {
      title: 'Noah\'s First Shared-Account Headache',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'What would stop this argument from happening again?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Individual identities, verifiable signatures, and audit records that point to one person instead of an entire department.',
        },
      ],
      takeaway:
        'Non-repudiation depends on actions being attributable to a specific identity, not a communal login.',
    },
  },
  '1-2-authentication-authorization-and-accounting': {
    coldOpen: {
      title: 'Logged In Does Not Mean Invited Everywhere',
      cast: ['glen-foster', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'I authenticated successfully, so naturally I assumed I could open the finance dashboard.',
        },
        {
          speakerId: 'marty-bell',
          text: 'That seems efficient. We should reward initiative.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Authentication proves who you are. Authorization decides what you can do. Accounting records the mess after you try both.',
        },
      ],
      conceptHook:
        'AAA shows up constantly on the exam because people blend these steps together. Identity, permission, and logging are related, but they are not interchangeable.',
    },
    callback: {
      title: 'The Roadside Assistance Theory Of AAA',
      cast: ['marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Explain the roadside assistance thing again, but this time make it exam legal.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Authentication proves identity, authorization grants permissions, and accounting records what happened.',
        },
      ],
      takeaway:
        'If the learner can separate proving identity, enforcing access, and recording activity, most introductory IAM scenarios become straightforward.',
    },
  },
  '1-2-gap-analysis': {
    coldOpen: {
      title: 'The Compliance Binder Archaeology Dig',
      cast: ['marty-bell', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Before we spend money, can we confirm we are basically compliant already?',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'I found three policy binders. Two reference software we retired, and one still mentions fax cover sheets as a data-loss control.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the current state is "optimistic filing."',
        },
      ],
      conceptHook:
        'Gap analysis compares the real environment to a target framework or requirement set. It measures what exists, what is missing, and what only exists on paper.',
    },
    callback: {
      title: 'Priya Asks For Evidence, Not Vibes',
      cast: ['priya-nair', 'noah-reed'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'Stop asking whether a control probably exists.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Ask for proof, ownership, and maturity against the target standard. Right.',
        },
      ],
      takeaway:
        'That is the practical version of gap analysis: assess people, process, and technology against a defined standard instead of relying on confidence.',
    },
  },
  '1-2-zero-trust': {
    coldOpen: {
      title: 'But They Work Here',
      cast: ['glen-foster', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'Why is the VPN asking me for more checks? I am internal in spirit.',
        },
        {
          speakerId: 'marty-bell',
          text: 'I agree. We should trust employees more. It is good for culture.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Attackers also enjoy being treated as trusted insiders after stealing one password.',
        },
      ],
      conceptHook:
        'Zero Trust is memorable because it rejects the lazy assumption that location equals legitimacy. Every request still has to earn trust.',
    },
    callback: {
      title: 'Noah Writes The Least Popular Poster',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'I made a poster that says internal network is not a personality trait.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Excellent. Now make one that says trust is earned per request, not granted by zip code.',
        },
      ],
      takeaway:
        'The principle is the point: verify explicitly, enforce least privilege, and assume breach rather than trusting by default.',
    },
  },
  '1-2-physical-security': {
    coldOpen: {
      title: 'The Doorstop Threat Model',
      cast: ['ethan-cole', 'noah-reed', 'marty-bell'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Someone propped open the side entrance again because the badge reader slows down deliveries.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So our layered physical security is currently being defeated by a wedge and impatience.',
        },
        {
          speakerId: 'marty-bell',
          text: 'The lobby ficus has a direct line of sight to that hallway. We are not undefended.',
        },
      ],
      conceptHook:
        'Physical controls matter because technical defenses collapse fast when an attacker can just walk in, plug in, steal hardware, or tailgate past the badge reader.',
    },
    callback: {
      title: 'Noah Inventories The Obvious Bypasses',
      cast: ['noah-reed', 'ethan-cole'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the problem is not the badge reader. It is the habit of bypassing it.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'Exactly. Most physical weaknesses begin life as a convenience feature someone forgot to feel guilty about.',
        },
      ],
      takeaway:
        'Doors, locks, cameras, guards, barriers, and access processes are all part of security, not a separate topic.',
    },
  },
  '1-2-deception-and-disruption': {
    coldOpen: {
      title: 'Priya Suggests Lying To The Attacker Professionally',
      cast: ['priya-nair', 'marty-bell', 'glen-foster'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'I want to add decoy resources so suspicious behavior hits fake targets before it hits real ones.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Is this ethical, or are we gaslighting the network?',
        },
        {
          speakerId: 'glen-foster',
          text: 'If the fake server has a good dashboard, can I still include it in quarterly asset utilization?',
        },
      ],
      conceptHook:
        'Not every control blocks directly. Some defenses detect, delay, mislead, or waste attacker time so the blue team can observe and respond.',
    },
    callback: {
      title: 'Noah Learns That A Trap Is Still A Control',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'Does a fake target really count as security if the wrong person is supposed to touch it?',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is exactly why it counts. Legitimate users ignore it. Attackers tell on themselves.',
        },
      ],
      takeaway:
        'Deception and disruption controls are useful precisely because contact with them is suspicious and informative.',
    },
  },
  '1-3-change-management': {
    coldOpen: {
      title: 'One Small Change, Three Very Unrelated Outages',
      cast: ['priya-nair', 'ethan-cole', 'marty-bell'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'A printer configuration change just broke remote access, payroll exports, and one mystery workstation no one admits owning.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'That workstation technically belongs to a conference room no longer on the floor plan.',
        },
        {
          speakerId: 'marty-bell',
          text: 'I assume this is what agile looks like from the infrastructure side.',
        },
      ],
      conceptHook:
        'Change management exists so risk, approval, communication, and rollback are handled before a simple update turns into an organizational scavenger hunt.',
    },
    callback: {
      title: 'The Missing Approval Trail',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'Who approved the change and where is the record?',
        },
        {
          speakerId: 'noah-reed',
          text: 'The silence after that question feels like a control failure all by itself.',
        },
      ],
      takeaway:
        'Good change management documents the what, why, who, when, impact, and backout plan before the change happens.',
    },
  },
  '1-3-technical-change-management': {
    coldOpen: {
      title: 'Testing Is For Slower Organizations',
      cast: ['marty-bell', 'priya-nair', 'denise-park'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'We pushed the update straight to production to save time.',
        },
        {
          speakerId: 'priya-nair',
          text: 'You have not saved time. You have borrowed chaos at a violent interest rate.',
        },
        {
          speakerId: 'denise-park',
          text: 'Before we continue, when you say rollback, do you mean technically or emotionally?',
        },
      ],
      conceptHook:
        'Technical change management is the hands-on discipline underneath policy: staging, testing, maintenance windows, validation, monitoring, and rollback procedures.',
    },
    callback: {
      title: 'Noah Builds The Backout Plan',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So rollback steps should exist before production starts smoking?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Ideally before anyone says the phrase quick production fix out loud.',
        },
      ],
      takeaway:
        'That is the implementation difference the exam cares about: management approves the process, but technical change management makes the change survivable.',
    },
  },
};

export const getLessonStory = (lessonId: Lesson['id']): LessonStory | undefined =>
  LESSON_STORIES_BY_ID[lessonId];
