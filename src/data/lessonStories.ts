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
          text: 'And this is the server room. Access is restricted. That sign has been there since 2019.',
        },
        {
          speakerId: 'noah-reed',
          text: 'The sign is the restriction?',
        },
        {
          speakerId: 'marty-bell',
          text: 'It clearly states authorized personnel only. We had it laminated.',
        },
        {
          speakerId: 'priya-nair',
          text: 'It has been moved three times and has never stopped anyone. I know this because I checked.',
        },
      ],
      conceptHook:
        'Different controls do different jobs. A sign can direct or deter, but it does not replace the preventive, detective, and corrective controls around it.',
    },
    callback: {
      title: 'Noah Labels The Damage',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'I put the sign down as a preventive control in my notes. Was that wrong?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes. A sign tells people what not to do. It does not stop them.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So it is directive. Not preventive.',
        },
        {
          speakerId: 'priya-nair',
          text: 'He already has. It was in a slide deck.',
        },
      ],
      takeaway:
        'The key exam move is identifying who implements the control and what it is actually doing in the scenario — not just that it exists.',
    },
  },
  '1-2-the-cia-triad': {
    coldOpen: {
      title: 'Three Different Problems, One Very Loud Morning',
      cast: ['glen-foster', 'denise-park', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'Sales cannot log into the CRM. I want it noted that this is not my fault.',
        },
        {
          speakerId: 'denise-park',
          text: 'Someone edited the payroll spreadsheet overnight. Three people now have overtime I cannot account for.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'A personnel file went to the wrong inbox. I would rather not say whose.',
        },
        {
          speakerId: 'noah-reed',
          text: 'None of those are the same kind of problem, are they.',
        },
      ],
      conceptHook:
        'The CIA Triad matters because "security issue" is too vague. The right fix depends on whether the failure is disclosure, tampering, or loss of access — and those are different problems.',
    },
    callback: {
      title: 'Marty Wants One Universal Fix',
      cast: ['marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Can we fix the confidentiality one first? Data exposure sounds the most press-worthy.',
        },
        {
          speakerId: 'priya-nair',
          text: 'They are different problems. They get different responses.',
        },
        {
          speakerId: 'marty-bell',
          text: 'What if we addressed all three with one announcement?',
        },
        {
          speakerId: 'priya-nair',
          text: 'We cannot.',
        },
      ],
      takeaway:
        'Confidentiality, integrity, and availability are separate properties. You diagnose and defend each one differently.',
    },
  },
  '1-2-non-repudiation': {
    coldOpen: {
      title: 'Everyone Denies Clicking Approve',
      cast: ['denise-park', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'A payment went out at 6:12 a.m. from the shared finance account. Nobody is claiming it.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'The log attributes it to finance-shared. That is technically all four of you.',
        },
        {
          speakerId: 'denise-park',
          text: 'I want it on record that I was not in at 6 a.m.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Which is exactly the problem. The system cannot tell the difference between you and anyone else who had that password.',
        },
      ],
      conceptHook:
        'Non-repudiation exists so actions stay attributable. If a system cannot prove who performed an action, denials are very hard to challenge — even legitimate ones.',
    },
    callback: {
      title: 'The Shared-Account Problem',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'If everyone had their own login, this argument would already be over.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Denise is probably still going to say it was not her.',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is why we have cryptographic signatures. So it does not matter what she says.',
        },
      ],
      takeaway:
        'Non-repudiation depends on actions being attributable to a specific identity — not a shared login that four people knew the password to.',
    },
  },
  '1-2-authentication-authorization-and-accounting': {
    coldOpen: {
      title: 'Logged In Does Not Mean Invited Everywhere',
      cast: ['glen-foster', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'I logged in fine but the finance dashboard will not open. I think there is a bug.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Can we just give Glen access? He says it is for a report.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Logging in proves who you are. It does not mean finance invited you.',
        },
        {
          speakerId: 'glen-foster',
          text: 'That feels like a technicality.',
        },
        {
          speakerId: 'priya-nair',
          text: 'It is the entire point of having separate steps.',
        },
      ],
      conceptHook:
        'AAA comes up constantly on the exam because people blend these steps. Identity, permission, and logging are related but not interchangeable.',
    },
    callback: {
      title: 'Marty Wants A Shortcut For The Shortcut',
      cast: ['marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Authentication, authorisation, accounting. Is there a shorter way to say all three?',
        },
        {
          speakerId: 'noah-reed',
          text: 'Triple-A. Like the roadside service.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Do they come out when the server goes down?',
        },
        {
          speakerId: 'noah-reed',
          text: 'Not that kind.',
        },
      ],
      takeaway:
        'Authentication proves identity, authorisation grants access, and accounting records what happened. Keeping them separate is what makes each one enforceable.',
    },
  },
  '1-2-gap-analysis': {
    coldOpen: {
      title: 'The Compliance Binder Archaeology Dig',
      cast: ['marty-bell', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'Before we spend anything, can we confirm we are roughly compliant already?',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'I found three binders. One covers software we retired in 2021. One still lists fax as a data transfer method.',
        },
        {
          speakerId: 'noah-reed',
          text: 'What is in the third one?',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'A DVD.',
        },
      ],
      conceptHook:
        'Gap analysis compares the real environment to a target framework. It measures what actually exists, what is missing, and what only exists on paper or in a binder nobody opens.',
    },
    callback: {
      title: 'Confidence Is Not A Control',
      cast: ['priya-nair', 'noah-reed'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'Stop asking whether a control probably exists.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So you need to be able to prove it exists, not just assume it does.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes. Marty believing something is in place is not the same as it being in place.',
        },
      ],
      takeaway:
        'Gap analysis means assessing people, process, and technology against a defined standard — not asking whether someone thinks the organisation is probably fine.',
    },
  },
  '1-2-zero-trust': {
    coldOpen: {
      title: 'But They Work Here',
      cast: ['glen-foster', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The VPN made me verify again. I already verified this morning.',
        },
        {
          speakerId: 'marty-bell',
          text: 'There should be a grace period for people who have worked here a long time.',
        },
        {
          speakerId: 'priya-nair',
          text: 'A stolen credential inside a trusted network is how most breaches actually start.',
        },
        {
          speakerId: 'glen-foster',
          text: 'I do not think that was about me specifically.',
        },
        {
          speakerId: 'priya-nair',
          text: 'It was about the principle. But also a little bit about you.',
        },
      ],
      conceptHook:
        'Zero Trust rejects the assumption that being on the network means being trustworthy. Every request still has to earn access, regardless of where it comes from.',
    },
    callback: {
      title: 'Marty Is Going To Keep Asking For A Grace Period',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'Marty is going to keep asking for a grace period for long-term employees.',
        },
        {
          speakerId: 'priya-nair',
          text: 'I know. The answer is still no.',
        },
        {
          speakerId: 'noah-reed',
          text: 'What if he frames it as a morale thing?',
        },
        {
          speakerId: 'priya-nair',
          text: 'One stolen password. Trusted perimeter. That is the whole argument against it.',
        },
        {
          speakerId: 'noah-reed',
          text: 'And if he still thinks it is unreasonable?',
        },
        {
          speakerId: 'priya-nair',
          text: 'You wait for the incident and say nothing.',
        },
      ],
      takeaway:
        'Verify explicitly, enforce least privilege, and assume breach. Location inside the network is not a reason to skip any of those.',
    },
  },
  '1-2-physical-security': {
    coldOpen: {
      title: 'The Doorstop Threat Model',
      cast: ['ethan-cole', 'noah-reed', 'marty-bell'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The side door is propped open again. Rubber wedge, labeled deliveries only.',
        },
        {
          speakerId: 'noah-reed',
          text: 'How long has it been like that?',
        },
        {
          speakerId: 'ethan-cole',
          text: 'Since Tuesday, officially. Realistically, March.',
        },
        {
          speakerId: 'marty-bell',
          text: 'The lobby camera covers that corridor. We are not completely blind.',
        },
        {
          speakerId: 'noah-reed',
          text: 'The camera records it. It does not close the door.',
        },
      ],
      conceptHook:
        'Physical controls matter because technical defences collapse fast when someone can just walk in, plug in, or tailgate through a door that has been open since March.',
    },
    callback: {
      title: 'The Badge Reader Was Fine',
      cast: ['noah-reed', 'ethan-cole'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'Someone labeled the wedge. They genuinely thought that was the system.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'Most physical gaps start as shortcuts and become unwritten policy. Nobody notices until something goes wrong.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the badge reader was fine. The habit around it was not.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'I have been trying not to think about that.',
        },
      ],
      takeaway:
        'Doors, locks, cameras, guards, and access processes are all security controls. The exam treats them the same way as technical ones.',
    },
  },
  '1-2-deception-and-disruption': {
    coldOpen: {
      title: 'Priya Wants To Deploy Something Fake On Purpose',
      cast: ['priya-nair', 'marty-bell', 'glen-foster'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'I want to set up fake servers that look real. Anything that touches them is suspicious by definition.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Is that entrapment? It feels a bit like entrapment.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Legitimate users have no reason to go near a resource they were never told about.',
        },
        {
          speakerId: 'glen-foster',
          text: 'Can I see what one looks like? Just to understand it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'You have already demonstrated the concept, Glen.',
        },
      ],
      conceptHook:
        'Not every control blocks directly. Some defences detect, delay, or mislead so the team can observe and respond — and contact with a decoy is itself the alert.',
    },
    callback: {
      title: 'What Counts As Detection',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'Nobody who belongs on the network would ever find the fake server.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. You do not need to block anything. You just need to watch the right place.',
        },
        {
          speakerId: 'noah-reed',
          text: 'What if someone stumbles on one by accident?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Then we have a different conversation about what they were looking for.',
        },
      ],
      takeaway:
        'Deception and disruption controls are useful because contact with them is suspicious and informative — legitimate users have no reason to go there.',
    },
  },
  '1-3-change-management': {
    coldOpen: {
      title: 'One Small Change, Three Unrelated Outages',
      cast: ['priya-nair', 'ethan-cole', 'marty-bell'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'A printer config update broke remote access, payroll exports, and a workstation nobody can identify.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'That workstation belongs to a conference room that was renumbered in 2022. The asset record was not.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Would a change ticket have caught this?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes, Marty. That is exactly the kind of thing a change ticket catches.',
        },
        {
          speakerId: 'marty-bell',
          text: 'We should probably start doing those.',
        },
      ],
      conceptHook:
        'Change management exists so risk, approval, communication, and rollback are handled before a routine update turns into an all-hands recovery effort.',
    },
    callback: {
      title: 'The Missing Approval Trail',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'Who approved the change?',
        },
        {
          speakerId: 'noah-reed',
          text: 'There is no ticket. I have checked.',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is your answer.',
        },
      ],
      takeaway:
        'Good change management documents the what, why, who, when, impact, and backout plan before the change happens — not as a retrospective.',
    },
  },
  '1-3-technical-change-management': {
    coldOpen: {
      title: 'We Saved Four Hours',
      cast: ['marty-bell', 'priya-nair', 'denise-park'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'We pushed straight to production. Saved about four hours.',
        },
        {
          speakerId: 'priya-nair',
          text: 'And how long have we been fixing it?',
        },
        {
          speakerId: 'marty-bell',
          text: 'That is not the relevant comparison.',
        },
        {
          speakerId: 'denise-park',
          text: 'When you say rollback — do you mean the system, or is someone going to call me again?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Both, in that order.',
        },
      ],
      conceptHook:
        'Technical change management is the practical discipline underneath policy: staging environments, test runs, maintenance windows, validation steps, and a backout plan that exists before anything touches production.',
    },
    callback: {
      title: 'The Backout Plan',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'The backout plan is supposed to exist before the change goes in.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Before anyone says the phrase quick production fix. That is the line.',
        },
        {
          speakerId: 'noah-reed',
          text: 'What about minor update?',
        },
        {
          speakerId: 'priya-nair',
          text: 'Same rule.',
        },
      ],
      takeaway:
        'Management approves the process, but technical change management is what makes the change survivable — staging, testing, validation, and a rollback path that works.',
    },
  },
};

export const getLessonStory = (lessonId: Lesson['id']): LessonStory | undefined =>
  LESSON_STORIES_BY_ID[lessonId];
