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
  '1-4-public-key-infrastructure': {
    coldOpen: {
      title: 'The Browser Warning Nobody Wants To Read',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The vendor portal says the connection is secure now. Yesterday it said something about trust and certificates and I clicked away from it.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the browser has to decide whether the public key really belongs to the site it claims to be.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Encryption without trust just gives you a private conversation with the wrong party.',
        },
      ],
      conceptHook:
        'PKI matters because public keys only help when you can trust whose key you received. Certificates and trusted authorities provide that binding.',
    },
    callback: {
      title: 'Fast Enough To Use',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the expensive asymmetric part only gets used long enough to establish the session.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Then the connection switches to symmetric encryption because we are protecting traffic, not making a math demonstration.',
        },
      ],
      takeaway:
        'Hybrid encryption is the practical PKI pattern: asymmetric methods establish trust and exchange secrets, then symmetric encryption handles the bulk data efficiently.',
    },
  },
  '1-4-encrypting-data': {
    coldOpen: {
      title: 'HR Wants The SSNs Locked Down',
      cast: ['rosa-jimenez', 'denise-park', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Testing can use fake records, but production HR data still contains Social Security numbers and bank details.',
        },
        {
          speakerId: 'denise-park',
          text: 'I only need a few fields protected. If we encrypt everything, reporting is going to get slower.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Then you choose the encryption scope carefully. Data at rest is not one control. It is several design choices.',
        },
      ],
      conceptHook:
        'Encrypting data is about matching the control to where the data lives and how it is used: full disk, transport, database-wide, or field-level.',
    },
    callback: {
      title: 'The Wrong Layer Solves The Wrong Problem',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So full-disk encryption protects the server, but it does not selectively protect one field from the application.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Correct. If the requirement is specific columns, the answer has to live at the column layer.',
        },
      ],
      takeaway:
        'Encryption answers are layer-specific. Full-disk encryption, TDE, VPNs, and column encryption solve different problems and are not interchangeable.',
    },
  },
  '1-4-key-exchange': {
    coldOpen: {
      title: 'What If Someone Saves The Traffic',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'We archive packet captures for troubleshooting. If someone stole those later, how bad would that be?',
        },
        {
          speakerId: 'noah-reed',
          text: 'Depends whether the long-term server key could unlock old sessions after the fact.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Which is why ephemeral session keys matter. You do not want one future breach opening every past conversation.',
        },
      ],
      conceptHook:
        'Key exchange is not just about establishing a secret today. The design also determines whether captured traffic stays safe if keys are compromised later.',
    },
    callback: {
      title: 'One Session At A Time',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'Perfect forward secrecy means each session dies with its own key.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes. The server private key should not be a skeleton key for every archive anyone ever captured.',
        },
      ],
      takeaway:
        'PFS with ephemeral exchange protects past sessions even if a server private key is stolen later. That is the exam distinction.',
    },
  },
  '1-4-encryption-technologies': {
    coldOpen: {
      title: 'Do Not Leave The Root Key In A Drawer',
      cast: ['priya-nair', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'If Northwind runs an internal CA, the root signing key is one of the most dangerous things we own.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Dangerous like expensive, or dangerous like if we lose it everyone panics.',
        },
        {
          speakerId: 'noah-reed',
          text: 'If that key is compromised, the trust chain is compromised with it.',
        },
      ],
      conceptHook:
        'Encryption technologies are not interchangeable. TPMs, HSMs, enclaves, and KMS platforms each protect different kinds of keys at different scales.',
    },
    callback: {
      title: 'Infrastructure Keys Need Infrastructure Protection',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'A TPM protects one machine well, but a root CA key needs something built for signing infrastructure.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. High-value enterprise keys belong in hardware designed for tamper resistance, auditing, and controlled use.',
        },
      ],
      takeaway:
        'When the question is about the organization most critical signing key, the answer is usually HSM, not a device-bound hardware feature.',
    },
  },
  '1-4-obfuscation': {
    coldOpen: {
      title: 'The Test Dataset Argument',
      cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The developers want customer records that look real enough to test with, but legal does not want production data leaving prod.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'Which seems reasonable, given the phrase production customer records leaving prod.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Then we give them data that preserves the shape and usefulness, not the actual identities.',
        },
      ],
      conceptHook:
        'Obfuscation is different from encryption. The goal is often to preserve utility while hiding the sensitive original values.',
    },
    callback: {
      title: 'Useful But Not Real',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if the developers can still test formatting and workflows, but the names and emails are fake, that is masking.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Encryption would make the data unreadable. Masking keeps it usable while removing the exposure.',
        },
      ],
      takeaway:
        'Data masking is the safe-test-data answer because it preserves realism without exposing the original sensitive values.',
    },
  },
  '1-4-hashing-and-digital-signatures': {
    coldOpen: {
      title: 'Someone Stole A Password Dump',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The incident report says the attacker got a credentials database, but the passwords were hashed.',
        },
        {
          speakerId: 'noah-reed',
          text: 'That only helps so much if the attacker can compare those hashes against precomputed tables.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Hashing alone is not enough if every user with the same password gets the same output.',
        },
      ],
      conceptHook:
        'Hashing protects integrity and password storage, but implementation details like salting determine whether the protection actually holds against common attacks.',
    },
    callback: {
      title: 'Make Precomputation Useless',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'A unique salt means the attacker cannot rely on one giant password-to-hash lookup table anymore.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. You want every password hash to become its own problem instead of one precomputed shortcut.',
        },
      ],
      takeaway:
        'Salting defeats rainbow table logic by making each password hash unique even when two users choose the same password.',
    },
  },
  '1-4-blockchain-technology': {
    coldOpen: {
      title: 'Denise Wants A Shipment Trail Nobody Can Rewrite',
      cast: ['denise-park', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'If a supplier changes a shipment record after the fact, I want to know immediately and I want everyone else to know too.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So this is provenance, not secrecy.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Meaning the value is in making tampering obvious across every copy of the record.',
        },
      ],
      conceptHook:
        'Blockchain is useful when the requirement is tamper-evident shared history. Its main value is not confidentiality but integrity across a distributed ledger.',
    },
    callback: {
      title: 'Everyone Sees The Same Tampering',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'The point is that one party cannot quietly rewrite the past without every other copy disagreeing.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That is what makes provenance tracking viable. The ledger is shared, and tampering does not stay local.',
        },
      ],
      takeaway:
        'For blockchain questions, immutability is usually the key property when the scenario is about traceability, provenance, or tamper-evident history.',
    },
  },
  '1-4-certificates': {
    coldOpen: {
      title: 'The Private Key Leak',
      cast: ['ethan-cole', 'priya-nair', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The web server key may have leaked during the last backup incident.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So even if we issue a replacement certificate today, clients still need a reason to distrust the old one.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Correct. Replacing the certificate is only half the job. Trust revocation has to be explicit.',
        },
      ],
      conceptHook:
        'Certificates are about trust distribution, and compromised trust must be revoked in a way clients can verify before expiration.',
    },
    callback: {
      title: 'Old Trust Does Not Die Automatically',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So unless the CA says the old certificate is revoked, clients may still accept it until it expires.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is why CRLs and OCSP exist. The client needs a live trust decision, not optimism.',
        },
      ],
      takeaway:
        'When a private key is compromised, revocation is the key action. Issuing a new certificate does not invalidate the old one by itself.',
    },
  },
  '2-1-threat-actors': {
    coldOpen: {
      title: 'The Attack Log Looks Embarrassingly Unoriginal',
      cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The scans hit every common port, every default path, and every exploit module the internet has loved for a decade.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So we are under attack by someone nostalgic.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Or someone using whatever kit they downloaded without changing much of anything.',
        },
      ],
      conceptHook:
        'Threat actor questions are often about capability, motive, and resources. The tooling style tells you a lot about the actor category.',
    },
    callback: {
      title: 'Not Sophisticated, Still Dangerous',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So low skill does not mean harmless. It just means the attacker is borrowing someone else\'s work.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Script-driven attackers can still hurt you if your defenses are weak enough to meet them halfway.',
        },
      ],
      takeaway:
        'Unskilled attackers are defined by dependence on prebuilt tools and low custom capability, not by lack of impact.',
    },
  },
  '2-2-common-threat-vectors': {
    coldOpen: {
      title: 'There Are USB Drives In The Parking Lot Again',
      cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'I found three branded USB drives by the side entrance this morning. None of them are ours.',
        },
        {
          speakerId: 'glen-foster',
          text: 'I am guessing this is not a community outreach program.',
        },
        {
          speakerId: 'noah-reed',
          text: 'No. It is the kind of attack that depends on someone being curious enough to plug one in.',
        },
      ],
      conceptHook:
        'Threat vectors describe how the attacker reaches the target. The medium matters because the defensive controls differ across email, network, software, and physical-device pathways.',
    },
    callback: {
      title: 'The Delivery Method Is The Lesson',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the trick is not just naming the attack. It is identifying the path the attacker used to reach the victim.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. If the payload arrives on removable media, the vector answer should start there.',
        },
      ],
      takeaway:
        'Threat-vector questions are about the attacker path. A bait USB drive is a removable-media vector, regardless of what malware is on it.',
    },
  },
  '2-2-phishing': {
    coldOpen: {
      title: 'Denise Gets An Urgent Wire Request',
      cast: ['denise-park', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'The CEO just emailed me asking for an urgent wire transfer to a new vendor, and naturally it arrived five minutes before lunch.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Does the message look fake, or does it look dangerously normal?',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is the problem with business email compromise. The message often looks normal because the attacker is abusing a trusted identity, not a broken template.',
        },
      ],
      conceptHook:
        'Phishing is broader than spammy fake emails. Some attacks succeed by abusing trust, urgency, and routine financial workflows instead of obvious technical red flags.',
    },
    callback: {
      title: 'Authenticity Checks Are Not Intent Checks',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So passing SPF and DKIM does not guarantee the request itself is legitimate.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Correct. Those checks help validate the sending path. They do not prove the sender was uncompromised or the business request was safe.',
        },
      ],
      takeaway:
        'BEC scenarios often survive basic email-authentication checks because the attacker is using a trusted mailbox or convincingly impersonating one.',
    },
  },
  '2-2-impersonation': {
    coldOpen: {
      title: 'The Help Desk Call Nobody Wants To Take',
      cast: ['marty-bell', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'If I were locked out at the airport, I would also sound stressed. That is what worries me about these calls.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Because a good impersonator sounds exactly like someone with a reasonable problem.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The attacker brings just enough real detail to make the lie feel expensive to challenge.',
        },
      ],
      conceptHook:
        'Impersonation attacks succeed when pressure, context, and believable identity clues override verification discipline.',
    },
    callback: {
      title: 'Urgency Is Part Of The Payload',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'The phone call gets attention, and the travel-story pretext explains why the caller needs special handling immediately.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The channel is vishing. The fabricated scenario is the pretext. You need both pieces to classify it correctly.',
        },
      ],
      takeaway:
        'Many impersonation questions are layered. The attacker may be using a voice channel, a pretext, and harvested personal details at the same time.',
    },
  },
  '2-2-watering-hole-attacks': {
    coldOpen: {
      title: 'The Finance Team All Visited The Same Site',
      cast: ['ethan-cole', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The malware alerts all started after finance employees visited the same trade association site.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So nobody had to click a sketchy email. They just went where they normally go.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Which means the attacker targeted the place the victims already trusted.',
        },
      ],
      conceptHook:
        'Watering hole attacks work by compromising a site the target group is likely to visit, turning normal browsing behavior into the delivery mechanism.',
    },
    callback: {
      title: 'The Site Was The Ambush Point',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the key clue is that the attacker poisoned a trusted destination instead of sending the victims something directly.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes. When the delivery path is a legitimate site your targets already visit, think watering hole first.',
        },
      ],
      takeaway:
        'Watering hole attacks are about target behavior. The attacker studies where the victims already go and compromises that location.',
    },
  },
  '2-2-other-social-engineering': {
    coldOpen: {
      title: 'That Support Domain Looks Almost Right',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'I only noticed the fake support page because the second o in Microsoft was actually a zero.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the attacker is borrowing a trusted brand and counting on people to skim, not inspect.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The visual copy sells the lie, and the lookalike domain closes the trap.',
        },
      ],
      conceptHook:
        'Social engineering is not always a direct message. It can combine brand familiarity, lookalike infrastructure, and user habit into a convincing credential trap.',
    },
    callback: {
      title: 'Two Labels, One Scam',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the fake page is brand impersonation, and the zero-for-o domain is typosquatting.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Some questions want both labels because each one explains a different part of how the deception works.',
        },
      ],
      takeaway:
        'When a scenario uses a cloned brand plus a lookalike domain, the answer is often a pair: brand impersonation and typosquatting.',
    },
  },
  '2-3-memory-injections': {
    coldOpen: {
      title: 'The Malware Never Started A New Process',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The endpoint agent never saw a suspicious new process, but a SYSTEM process suddenly started behaving like it had new opinions.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the attacker probably moved their code into a process that already existed and already had the privileges they wanted.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That is the appeal of memory injection. Hide inside something trusted and inherit its access.',
        },
      ],
      conceptHook:
        'Memory-injection techniques let attackers execute code inside legitimate processes, often avoiding obvious on-disk indicators and inheriting the victim process privileges.',
    },
    callback: {
      title: 'The Process Was The Disguise',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So CreateRemoteThread plus a malicious DLL is not just code execution. It is code execution inside somebody else\'s address space.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is why DLL injection questions emphasize the target process and the inherited privilege level.',
        },
      ],
      takeaway:
        'DLL injection scenarios usually hinge on code being inserted into an existing process, not a new process being launched openly.',
    },
  },
  '2-3-buffer-overflows': {
    coldOpen: {
      title: 'Seven Hundred Bytes Into Five Hundred And Twelve',
      cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The developer allocated 512 bytes. The attacker sent 700. The return address stopped belonging to us somewhere in the middle.',
        },
        {
          speakerId: 'marty-bell',
          text: 'I am starting to feel like the number 512 had one job.',
        },
        {
          speakerId: 'noah-reed',
          text: 'And the real problem is not the number. It is that the language let the write happen without stopping it.',
        },
      ],
      conceptHook:
        'Buffer overflows come from unsafe memory handling. The strongest prevention is eliminating the ability to write past bounds in the first place.',
    },
    callback: {
      title: 'Fix The Root Cause, Not The Perimeter',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'A firewall cannot stop a program from corrupting its own memory after bad input gets inside.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. For a language-level mitigation question, think memory-safe language before network control.',
        },
      ],
      takeaway:
        'When the scenario asks for the language-level fix to a buffer overflow, the answer is usually memory safety or bounds checking, not a compensating perimeter control.',
    },
  },
  '2-3-race-conditions': {
    coldOpen: {
      title: 'Both Purchases Passed The Check',
      cast: ['denise-park', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'The account only had enough for one purchase, yet both orders were approved and settled.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the system checked the balance twice before either transaction finished changing the balance.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The gap between check and use is the vulnerability when timing can be manipulated.',
        },
      ],
      conceptHook:
        'Race conditions exploit timing, not bad input. The issue is that the system acts on stale assumptions after a check that is no longer valid.',
    },
    callback: {
      title: 'The Window Is The Bug',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So TOCTOU is really about the unsafe window between verifying something and relying on it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Yes. If two operations can squeeze through that gap together, the logic stops matching reality.',
        },
      ],
      takeaway:
        'Race condition questions often describe two operations both passing the same check before either update is committed. That is the classic TOCTOU pattern.',
    },
  },
  '2-3-malicious-updates': {
    coldOpen: {
      title: 'The Update Was Signed And Still Malicious',
      cast: ['ethan-cole', 'rosa-jimenez', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Customers trusted the update because it was signed correctly. The problem was that the build pipeline had already been compromised.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So the signature confirmed the vendor distributed it, not that the vendor remained trustworthy internally.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Which means the attack happened upstream before delivery, not on the customer side after the download.',
        },
      ],
      conceptHook:
        'Malicious update attacks compromise the software supply chain itself. Legitimate signing and delivery can still distribute malicious code if the build pipeline is poisoned.',
    },
    callback: {
      title: 'Trust Was Abused At The Source',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the key clue is that the product was tampered with before distribution and then shipped through the normal vendor channel.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That is the supply-chain pattern. The trusted update path becomes the attack path.',
        },
      ],
      takeaway:
        'If the scenario says the vendor build or signing process was compromised, the answer is malicious update or supply chain attack.',
    },
  },
  '2-3-os-vulnerabilities': {
    coldOpen: {
      title: 'The Patch Is Two Weeks Late And Facing The Internet',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The scanner found an RCE flaw on the public web server, and the vendor released the patch two weeks ago.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Two weeks is not very long in calendar terms and somehow feels catastrophic in security terms.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Because remote code execution plus internet exposure is emergency language. The attacker does not need local access or patience.',
        },
      ],
      conceptHook:
        'Patch urgency comes from exploitability and exposure. Internet-facing remote code execution is one of the strongest signals that a patch cannot wait.',
    },
    callback: {
      title: 'Exposure Multiplies Severity',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the emergency call is not about the patch day or the operating system family. It is about remote takeover on a public target.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. When the system is reachable and the flaw is RCE, the justification is already strong enough.',
        },
      ],
      takeaway:
        'For patch-priority questions, pair the vulnerability type with the system exposure. RCE on an internet-facing host is a top-tier patching priority.',
    },
  },
  '2-3-sql-injection': {
    coldOpen: {
      title: 'The Query Let The User Finish Writing It',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The developer built the query by pasting user input directly into the WHERE clause and then acted surprised when the attacker improved the query.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the input was treated like SQL syntax instead of just data.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The fix is not to guess bad patterns better. It is to stop data from being interpreted as code at all.',
        },
      ],
      conceptHook:
        'SQL injection happens when application input changes query structure. The strongest fix is structural separation between SQL commands and user-supplied values.',
    },
    callback: {
      title: 'Do Not Filter, Separate',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So a WAF might catch some attempts, but prepared statements solve the root problem in the code path itself.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Parameterization beats pattern matching because the database never treats the input as executable SQL.',
        },
      ],
      takeaway:
        'For SQL injection fixes, parameterized queries are the primary answer. Defensive filters and perimeter tools are secondary controls.',
    },
  },
  '2-3-cross-site-scripting': {
    coldOpen: {
      title: 'The Review Page Started Stealing Sessions',
      cast: ['glen-foster', 'ethan-cole', 'noah-reed'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'Someone posted a product review, and now everyone who loads the page seems to hand their session to the attacker.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the site is faithfully serving malicious script to every visitor because it stored the payload as normal content.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Which means the browser is doing exactly what the page told it to do. The issue is what got saved there in the first place.',
        },
      ],
      conceptHook:
        'XSS abuses trusted application pages to execute attacker-controlled JavaScript in the victim browser. Where the payload lives determines the XSS subtype.',
    },
    callback: {
      title: 'Stored Means Repeatable',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if every future visitor gets hit automatically, the malicious script is living on the site, not just in one crafted link.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Persistent XSS is the version that keeps paying out because the application stores the payload for the attacker.',
        },
      ],
      takeaway:
        'Stored XSS is the answer when the malicious script is saved by the application and then served to every later viewer.',
    },
  },
  '2-3-hardware-vulnerabilities': {
    coldOpen: {
      title: 'The MRI Workstation Nobody Can Retire',
      cast: ['rosa-jimenez', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The imaging vendor says the hospital still needs those Windows XP workstations because the scanner software was never updated for anything newer.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the machines are still operationally important and permanently stuck in the past.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Which means every newly discovered weakness after end of support just stays there with no vendor patch coming.',
        },
      ],
      conceptHook:
        'Hardware and legacy-platform risk often comes from dependency lock-in. Unsupported systems become permanent exposure because fixes stop arriving while attackers keep discovering flaws.',
    },
    callback: {
      title: 'Unsupported Does Not Mean Unreachable',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the danger is not that the old system is slow. It is that its vulnerabilities can age forward while the patch stream stops forever.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. EOSL turns future vulnerabilities into permanent debt unless you isolate, replace, or otherwise compensate for the platform.',
        },
      ],
      takeaway:
        'End-of-support questions are usually testing patch absence. Once the vendor stops shipping fixes, new weaknesses become durable exposure.',
    },
  },
  '2-3-virtualization-vulnerabilities': {
    coldOpen: {
      title: 'One VM Peeking Into Another',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'A guest VM should never be able to read memory that belongs to neighboring tenants, yet the hypervisor bug says it can.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the isolation boundary the cloud depends on is leaking across virtual machines.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Virtualization is only safe if the hypervisor actually keeps tenants separated from one another.',
        },
      ],
      conceptHook:
        'Virtualization security depends on strong isolation. When hypervisor flaws let workloads cross those boundaries, the whole multi-tenant model is at risk.',
    },
    callback: {
      title: 'Isolation Was The Control',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So whether you call it VM escape or resource reuse, the real clue is cross-tenant access that should have been impossible.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The exam is testing whether you noticed the broken virtualization boundary, not whether you memorized a cloud marketing term.',
        },
      ],
      takeaway:
        'For virtualization questions, focus on the boundary failure. If one guest can reach another guest memory or the hypervisor, isolation has failed.',
    },
  },
  '2-3-cloud-specific-vulnerabilities': {
    coldOpen: {
      title: 'The Bucket Was Public Because We Made It Public',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The storage service did exactly what the access policy said. Unfortunately, the access policy said everyone on the internet was invited.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the provider secured the platform, but we misconfigured our use of it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Shared responsibility does not mean shared blame for customer ACL mistakes.',
        },
      ],
      conceptHook:
        'Cloud security questions often hinge on the shared responsibility model. The provider secures the service; the customer secures their configuration and access decisions.',
    },
    callback: {
      title: 'Managed Service, Customer Mistake',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So when the bucket policy is wrong, the failure belongs to the customer side of the model even if the service itself is provider-managed.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The cloud does not remove responsibility. It just changes which layers you own directly.',
        },
      ],
      takeaway:
        'Misconfigured cloud access controls usually map to customer responsibility under the shared responsibility model.',
    },
  },
  '2-3-supply-chain-vulnerabilities': {
    coldOpen: {
      title: 'The HVAC Vendor Did Not Need That Much Access',
      cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The retailer got breached through credentials stolen from an HVAC contractor that still had broad remote access.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So the weak link was not the contractor alone. It was the amount of trust the contractor account carried.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. Third-party access becomes a supply-chain problem when vendors can reach far more than their job requires.',
        },
      ],
      conceptHook:
        'Supply-chain risk is often access risk. Vendors, contractors, and partners become attacker paths when their privileges are broader than the business need.',
    },
    callback: {
      title: 'Least Privilege Applies To Vendors Too',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the missing control was not a specific appliance. It was restricting the vendor to only the systems and functions they actually needed.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Third-party accounts should be scoped aggressively. Otherwise one vendor breach becomes your breach.',
        },
      ],
      takeaway:
        'When a vendor account is the entry point, check for excessive access and lack of least privilege before you look for exotic answers.',
    },
  },
  '2-3-misconfiguration-vulnerabilities': {
    coldOpen: {
      title: 'Telnet On Port 23 With Factory Credentials',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The server is accepting Telnet, and the default vendor account still works. It is almost aggressively misconfigured.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So both the protocol choice and the login choice are separate failures, and both are easy for attackers to abuse.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Misconfiguration questions often stack multiple weaknesses in one scenario and expect you to identify each one.',
        },
      ],
      conceptHook:
        'Misconfigurations are dangerous because they are often preventable and often compound. One insecure default plus one insecure protocol can turn a manageable system into an easy target.',
    },
    callback: {
      title: 'Two Problems, Same Server',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the answer is not one vulnerability wearing two hats. It is two distinct configuration failures at once.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Cleartext management plus default credentials is exactly the kind of paired mistake the exam likes to test.',
        },
      ],
      takeaway:
        'When a scenario lists multiple configuration clues, expect multiple misconfiguration findings rather than a single umbrella answer.',
    },
  },
  '2-3-mobile-device-vulnerabilities': {
    coldOpen: {
      title: 'The Phone Says Compliant And Still Cannot Be Trusted',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The phone is jailbroken, yet the MDM dashboard still claims everything is compliant and healthy.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the real issue is not just sideloaded apps. It is that the device can no longer be trusted to report its own state honestly.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Once the platform security boundary is broken, policy enforcement and compliance attestations become suspect too.',
        },
      ],
      conceptHook:
        'Mobile-device risk is not just about bad apps. Rooting and jailbreaking undermine the platform trust model that management and security controls rely on.',
    },
    callback: {
      title: 'Compliant According To A Compromised Device',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if the device is jailbroken, the MDM signal itself may no longer be reliable.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The management tool can only enforce policy as far as the underlying OS trust boundary still exists.',
        },
      ],
      takeaway:
        'For jailbreaking or rooting questions, the primary concern is often broken trust and weakened policy enforcement, not just app-store bypass.',
    },
  },
  '2-3-zero-day-vulnerabilities': {
    coldOpen: {
      title: 'The Vendor Does Not Even Know Yet',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The attacker is exploiting the VPN product in the wild, but the vendor is unaware and there is no CVE yet.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So there is no patch, no official identifier, and no simple fix to roll out today.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The dangerous part of a zero-day is the time before the defender community can coordinate around it.',
        },
      ],
      conceptHook:
        'Zero-days are defined by asymmetry: the attacker has knowledge and opportunity before the vendor and defenders have a patch or mature detection path.',
    },
    callback: {
      title: 'The Window Closes Only After Discovery And Patch',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the exploitation window lasts until the vendor learns about the flaw and ships a fix, not until defenders wish very hard.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Before disclosure and patching, you are mostly working with mitigations, monitoring, and containment.',
        },
      ],
      takeaway:
        'For zero-day questions, remember that there may be no CVE, no signature, and no vendor patch yet. The exposure lasts until the flaw is discovered and fixed.',
    },
  },
  '2-4-an-overview-of-malware': {
    coldOpen: {
      title: 'This One Walks The Network By Itself',
      cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The infection jumped from host to host across the network without anyone opening files or clicking prompts.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So this is not user-assistance malware. It sounds much more self-motivated than that.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. The distinction is whether the malware needs a person to help it spread after the first compromise.',
        },
      ],
      conceptHook:
        'Malware classification often comes down to propagation behavior. How it spreads can be more important than how it first arrives.',
    },
    callback: {
      title: 'No User Required',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if it replicates across the network on its own, we are in worm territory, not virus territory.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Viruses usually need user execution or some host action. Worms turn propagation into their own job.',
        },
      ],
      takeaway:
        'When the scenario emphasizes autonomous network spread, the answer is usually worm.',
    },
  },
  '2-4-viruses-and-worms': {
    coldOpen: {
      title: 'The Word Document Asked For Macros',
      cast: ['glen-foster', 'ethan-cole', 'noah-reed'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The attachment looked like a normal Word document right up until it asked the user to enable macros to see the content.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the file itself was the carrier, and the user supplied the last bit of permission it needed.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Which points to a very specific virus subtype tied to document automation features.',
        },
      ],
      conceptHook:
        'Virus questions often hinge on the host file and execution method. Documents, executables, boot sectors, and memory-only payloads point to different malware types.',
    },
    callback: {
      title: 'The Macro Was The Trigger',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the Word document mattered because the malware was embedded in the macro system, not because it was just any attachment.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. If the user has to enable document macros and then the malware fires, the classification clue is sitting right in front of you.',
        },
      ],
      takeaway:
        'Macro-virus scenarios usually spell themselves out: document file, enable macros, then compromise.',
    },
  },
  '2-4-spyware-and-bloatware': {
    coldOpen: {
      title: 'The Free Utility Came With A Listener',
      cast: ['glen-foster', 'ethan-cole', 'noah-reed'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The free download manager looked harmless until we saw it capturing every keystroke and beaconing out to an external host.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the useful feature was just the wrapper. The real payload was silent surveillance bundled into the installer.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. Spyware questions often hide the attack inside freeware, fake tools, or installer extras the user barely notices.',
        },
      ],
      conceptHook:
        'Spyware is defined by covert observation and data theft. The delivery vehicle may look benign, but the behavior gives it away.',
    },
    callback: {
      title: 'The Keystrokes Were The Clue',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So once the software is logging credentials and shipping them offsite, we are firmly in spyware and keylogger territory.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Capturing input before encryption is the giveaway, not whether the software also pretended to help with downloads.',
        },
      ],
      takeaway:
        'If a scenario emphasizes covert monitoring, credential capture, or outbound exfiltration from a helper app, spyware is the likely answer.',
    },
  },
  '2-4-other-malware-types': {
    coldOpen: {
      title: 'The Payroll Sabotage Was Waiting For A Date',
      cast: ['rosa-jimenez', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The fired administrator left code in payroll that does nothing until the last day of the month, then deletes the salary records.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So the malware is dormant by design. It is waiting for a trigger, not spreading or hiding itself in the kernel.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. This kind of question usually hinges on the trigger condition and the insider angle.',
        },
      ],
      conceptHook:
        'Malware categories differ by behavior. Dormant-until-triggered code points toward logic bombs, especially in insider sabotage scenarios.',
    },
    callback: {
      title: 'It Was Planted To Wait',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the defining feature is not destruction alone. It is that the code stayed quiet until a specific date activated it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. When the scenario gives you delayed execution plus a trigger, logic bomb is the intended label.',
        },
      ],
      takeaway:
        'Time- or event-triggered destructive code, especially from a disgruntled insider, usually maps to a logic bomb.',
    },
  },
  '2-4-physical-attacks': {
    coldOpen: {
      title: 'The Badge Was Copied In The Elevator',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'Security footage shows the attacker never touched the employee badge, but somehow walked in later with a working copy.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the credential was probably read wirelessly and duplicated, not stolen outright or brute-forced at the door.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Physical attack questions often look low-tech, but the mechanism still matters.',
        },
      ],
      conceptHook:
        'Physical attacks bypass digital controls by targeting the credential, barrier, or environment directly. Badge technologies create their own attack surface.',
    },
    callback: {
      title: 'Single-Factor Badge Access Failed',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if the attacker can clone the badge, the real fix is not just thicker plastic. It is treating RFID as only one factor.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. RFID cloning is why physical security still needs layered controls and secondary verification.',
        },
      ],
      takeaway:
        'When a badge is read and duplicated without contact, think RFID cloning and remember that MFA applies to physical access too.',
    },
  },
  '2-4-denial-of-service': {
    coldOpen: {
      title: 'Tiny Requests, Huge Flood',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The target went down under a flood of large NTP responses, but the attacker barely sent any traffic directly to them.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So the attacker weaponized third-party servers by spoofing the victim address and letting reflection do the heavy lifting.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The exam clue is the mismatch between tiny requests and outsized replies.',
        },
      ],
      conceptHook:
        'DoS questions are often about asymmetry. Reflection and amplification let attackers multiply their bandwidth by abusing trusted infrastructure.',
    },
    callback: {
      title: 'The Amplifiers Did The Damage',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the attack is not just volume. It is reflected and amplified volume using someone else\'s servers.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Small spoofed requests plus large reflected responses is the classic DDoS amplification pattern.',
        },
      ],
      takeaway:
        'If a scenario highlights spoofed victim IPs and oversized protocol responses from third parties, the answer is reflection or amplification.',
    },
  },
  '2-4-dns-attacks': {
    coldOpen: {
      title: 'The Domain Pointed Somewhere Else',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Customers typed the real company URL, but the registrar records had been changed and the traffic landed on a perfect clone.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the attacker did not poison a cache this time. They changed the source of truth for the domain itself.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That distinction matters because registrar compromise is a different problem than resolver poisoning.',
        },
      ],
      conceptHook:
        'DNS attacks are really traffic-control attacks. The exam often separates cache poisoning, registrar takeover, and lookalike domains by where the attacker gained control.',
    },
    callback: {
      title: 'The Registrar Was The Battleground',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the legitimate domain itself was repointed, this is domain hijacking rather than typosquatting or cache poisoning.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. When the authoritative registration changes, the attacker effectively becomes the site for everyone who trusts DNS.',
        },
      ],
      takeaway:
        'If the real domain was altered at the registrar, think domain hijacking, not poisoning or typosquatting.',
    },
  },
  '2-4-wireless-attacks': {
    coldOpen: {
      title: 'The Wi-Fi Kept Kicking Everyone Off',
      cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Clients keep getting thrown off the corporate Wi-Fi, and every reconnect attempt is followed by another forged disconnect.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the weakness is in the management frames. The attacker is impersonating the access point, not cracking the password first.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. The standard to remember is the one that finally protected those frames.',
        },
      ],
      conceptHook:
        'Wireless attacks often exploit assumptions in management traffic rather than encryption itself. Deauth questions usually point to 802.11w.',
    },
    callback: {
      title: 'The Frames Needed Protection',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the fix is not a faster Wi-Fi standard. It is management-frame protection.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. 802.11w exists specifically because deauthentication frames used to be trivially forgeable.',
        },
      ],
      takeaway:
        'Forged deauthentication and disassociation frames point to 802.11w as the relevant defense standard.',
    },
  },
  '2-4-on-path-attacks': {
    coldOpen: {
      title: 'The Gateway Suddenly Had Two Faces',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Clients on the subnet suddenly think my laptop is the default gateway, and now their traffic is passing through me first.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So someone is abusing ARP\'s lack of authentication to rewrite the local trust map.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The check question is probably about the switch-level control that catches those fake bindings.',
        },
      ],
      conceptHook:
        'On-path attacks usually start by corrupting how a network resolves trust. Local subnet scenarios with fake gateway ownership point to ARP poisoning.',
    },
    callback: {
      title: 'The Switch Has To Judge The ARP Replies',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the defense is not DNSSEC or certificate pinning. It is validating ARP replies against known IP-to-MAC bindings.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Dynamic ARP Inspection is built for exactly this layer of deception.',
        },
      ],
      takeaway:
        'When the attacker wins by forging ARP replies on a local switch, DAI is the primary technical defense to remember.',
    },
  },
  '2-4-replay-attacks': {
    coldOpen: {
      title: 'They Logged In With The Hash Alone',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The researcher never cracked the captured NTLM hash. They just replayed it to the file server and got in as the user.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So this is not password guessing. The hash itself became the credential.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Replay questions often hinge on what was reused: a token, a cookie, or in this case the hash.',
        },
      ],
      conceptHook:
        'Replay attacks reuse captured proof instead of discovering the underlying secret. Windows NTLM makes pass-the-hash the canonical example.',
    },
    callback: {
      title: 'The Secret Was Never Recovered',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the scary part is that the password stayed unknown the whole time, yet authentication still succeeded.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. If the captured hash alone authenticates, that is pass-the-hash by definition.',
        },
      ],
      takeaway:
        'If the scenario reuses a captured NTLM hash directly, the answer is pass-the-hash rather than brute force.',
    },
  },
  '2-4-application-attacks': {
    coldOpen: {
      title: 'The Browser Sent The Request For Them',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The victim was already logged into the bank. Then a malicious page silently submitted a transfer form using that live session.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the server trusted the browser because the cookie looked valid, even though the user never intended the action.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The trust failure here is about intent, not identity.',
        },
      ],
      conceptHook:
        'Application attacks often exploit what the server assumes. CSRF abuses the assumption that any authenticated browser request reflects user intent.',
    },
    callback: {
      title: 'Authenticated Did Not Mean Authorized',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the cookie proved the session, but it did not prove the user wanted that transfer.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That gap between valid session and valid intent is why anti-CSRF tokens exist.',
        },
      ],
      takeaway:
        'Silent state-changing requests from a logged-in browser usually indicate CSRF, especially when cookies are sent automatically.',
    },
  },
  '2-4-cryptographic-attacks': {
    coldOpen: {
      title: 'HTTPS On One Side, HTTP On The Other',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The attacker intercepted the victim before the HTTPS redirect, kept a secure session to the server, and fed plain HTTP back to the browser.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the victim never sees a certificate warning because the browser never reaches the secure connection in the first place.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. This is not a weaker cipher-suite negotiation problem. It is the initial redirect being hijacked.',
        },
      ],
      conceptHook:
        'Cryptographic attacks often target implementation flow, not the algorithm itself. SSL stripping lives in the gap before HTTPS is enforced.',
    },
    callback: {
      title: 'The Redirect Was The Weak Moment',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the attacker downgraded the client side to HTTP while keeping HTTPS upstream, this is SSL stripping specifically.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. HSTS exists to remove that first insecure step and deny the attacker room to strip the session.',
        },
      ],
      takeaway:
        'If the attacker intercepts the initial HTTP request and prevents the browser from ever upgrading safely, think SSL stripping.',
    },
  },
  '2-4-password-attacks': {
    coldOpen: {
      title: 'One Password Against Everyone',
      cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The attacker tried the same seasonal password against every user in Active Directory and never triggered a single lockout.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So they avoided hammering one account and spread the guesses across the whole directory instead.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. The trick is the distribution pattern, not the complexity of the password they chose.',
        },
      ],
      conceptHook:
        'Password-attack questions often hinge on attack shape. One password across many accounts points to spraying, not brute force.',
    },
    callback: {
      title: 'No Lockouts Was The Point',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the attacker succeeded by staying under each account lockout threshold rather than cracking anything offline.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Password spraying is designed to keep each account quiet while the campaign stays wide.',
        },
      ],
      takeaway:
        'If the scenario uses one or two common passwords across many accounts and avoids lockouts, think password spraying.',
    },
  },
  '2-4-indicators-of-compromise': {
    coldOpen: {
      title: 'Chicago And Singapore At The Same Time',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The same account is logged in from Chicago and Singapore at the same time, and both sessions are active right now.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So either we discovered teleportation or one of those sessions belongs to an attacker.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The clue is not resource usage or missing logs. It is geography and simultaneity.',
        },
      ],
      conceptHook:
        'Indicators of compromise are often behavioral contradictions. A user being in two distant places at once is a classic high-confidence signal.',
    },
    callback: {
      title: 'The User Could Not Be In Two Places',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the SIEM is really flagging a travel impossibility and concurrent-session anomaly at the same time.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Impossible travel is just a human-readable way of saying the authentication pattern is physically impossible.',
        },
      ],
      takeaway:
        'Simultaneous or near-simultaneous logins from incompatible locations point to impossible travel or concurrent sessions.',
    },
  },
  '2-5-segmentation-and-access-control': {
    coldOpen: {
      title: 'The Database VLAN Did Not Blink',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The workstation is compromised, but every attempt to reach the database server dies at the firewall between the user VLAN and the database VLAN.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So the malware landed, but the architecture kept the breach from turning into lateral movement.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The point of the scenario is containment through network design.',
        },
      ],
      conceptHook:
        'Segmentation turns one compromise into one zone problem instead of an organization-wide problem. The exam often frames this as blast-radius reduction.',
    },
    callback: {
      title: 'The Firewall Between Zones Did Its Job',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So this was not about disk protection or login strength. The winning control was the boundary between network segments.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Segmentation with ACLs is what kept the attacker stranded in the user zone.',
        },
      ],
      takeaway:
        'When a compromised host cannot laterally reach a more sensitive subnet because traffic is blocked between zones, think segmentation with ACLs.',
    },
  },
  '2-5-mitigation-techniques': {
    coldOpen: {
      title: 'No Single Log Could See The Pattern',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'One login came from the user home country, then another successful login appeared from a new country almost immediately afterward.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the signal only emerges if something correlates events across time and sources instead of staring at one host in isolation.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The question is really about cross-source visibility.',
        },
      ],
      conceptHook:
        'Mitigation is not only prevention. Good monitoring reduces attacker dwell time by linking weak individual signals into one strong conclusion.',
    },
    callback: {
      title: 'Correlation Made It Visible',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So a SIEM wins here because it can stitch together the story no single endpoint or firewall could tell alone.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Correlation is the feature, not just log storage.',
        },
      ],
      takeaway:
        'If detection depends on linking events across systems or time, the expected answer is usually SIEM correlation.',
    },
  },
  '2-5-hardening-techniques': {
    coldOpen: {
      title: 'The Contractor Laptop Hit The Quarantine VLAN',
      cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The contractor plugged in, and NAC immediately flagged missing patches plus an outdated EDR agent and dropped the laptop into a restricted segment.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the network checked the device posture before granting trust instead of letting remediation happen after the fact.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. This is hardening as an admission-control process.',
        },
      ],
      conceptHook:
        'Hardening is not only how you build systems. It is also how you decide whether a device gets normal access at all.',
    },
    callback: {
      title: 'Trust Had To Be Earned At Connection Time',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the key control is active posture checking and quarantine, not just a static ACL on the switch.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Configuration enforcement is about evaluating compliance on connect and isolating failures automatically.',
        },
      ],
      takeaway:
        'If a device is checked for patches, EDR, certificates, or similar health signals at connection time and quarantined when it fails, think posture assessment or configuration enforcement.',
    },
  },
  '2-5-endpoint-hardening': {
    coldOpen: {
      title: 'Word Spawned PowerShell And Started Calling Out',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The malware had no known signature, but the endpoint agent saw Word spawn PowerShell and open outbound connections, then isolated the machine automatically.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the control recognized suspicious behavior and acted without waiting for a human to read an alert.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That is the modern EDR story in one sentence.',
        },
      ],
      conceptHook:
        'Endpoint hardening increasingly depends on behavior, not signatures. Novel attack chains still leave recognizable process relationships and response opportunities.',
    },
    callback: {
      title: 'The Process Tree Told On The Malware',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the magic was not knowing the sample hash ahead of time. It was noticing a dangerous behavior chain and isolating the host.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Behavioral detection plus automated response is exactly what separates EDR from older signature-only tools.',
        },
      ],
      takeaway:
        'If the tool catches suspicious process behavior from a previously unknown sample and isolates the endpoint automatically, think EDR behavioral detection and response.',
    },
  },
  '3-1-cloud-infrastructures': {
    coldOpen: {
      title: 'The Provider Runs The Database Stack',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The cloud provider handles the database engine, operating system, and hardware, while Northwind just manages the data and who can access it.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So we are no longer down at raw VMs, but we also are not consuming a finished end-user application.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The answer lives in the responsibility boundary.',
        },
      ],
      conceptHook:
        'Cloud service models are really boundary questions. What the provider manages versus what the customer manages determines IaaS, PaaS, and SaaS.',
    },
    callback: {
      title: 'The Platform Was Managed For Them',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the provider owns the OS and runtime but we still own the data and access logic, this lands in PaaS.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. PaaS sits in that middle ground where the customer writes and secures what runs on top, not the underlying platform layers.',
        },
      ],
      takeaway:
        'If the provider manages the platform layer and the customer mainly manages data and application-level access, the expected model is PaaS.',
    },
  },
  '3-1-cloud-architecture': {
    coldOpen: {
      title: 'The Payment Service Failed Alone',
      cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The payment component was breached, but inventory kept running because each service had its own API boundary and database.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the design intentionally kept one failure from becoming an application-wide collapse.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. The architecture itself provided the containment clue.',
        },
      ],
      conceptHook:
        'Cloud architecture questions often hinge on decomposition. Separate services, APIs, and isolated data stores point to microservices rather than one big application.',
    },
    callback: {
      title: 'The Breach Stayed Inside One Service',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So this is not just virtualization and not serverless functions. It is independent services with their own boundaries.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Microservices are prized partly because failure and compromise can be contained service by service.',
        },
      ],
      takeaway:
        'If the scenario emphasizes independently scalable services that talk over APIs and isolate their own data, think microservices.',
    },
  },
  '3-1-network-infrastructure': {
    coldOpen: {
      title: 'Finance And Guest Must Stay Apart',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Finance and Guest share the same physical switch, but the engineer needs them isolated with only controlled traffic between the VLANs.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So VLANs give the Layer 2 separation, but any approved communication still has to be mediated somewhere higher.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The question is about what enables inter-VLAN control, not what creates the VLANs.',
        },
      ],
      conceptHook:
        'Infrastructure questions often separate Layer 2 isolation from Layer 3 routing. VLANs isolate locally, but controlled communication requires a routing or firewall boundary.',
    },
    callback: {
      title: 'The VLAN Boundary Needed A Gatekeeper',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So a second NIC or another switch is not the key. The important requirement is a Layer 3 device to route and inspect between VLANs.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Once traffic must cross VLANs in a controlled way, a router or firewall becomes the decision point.',
        },
      ],
      takeaway:
        'If devices in separate VLANs need limited communication, the expected answer is a Layer 3 device such as a router or firewall between them.',
    },
  },
  '3-1-specialized-infrastructure': {
    coldOpen: {
      title: 'IT Malware Reached The Turbines',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The utility connected SCADA monitoring directly to the corporate network for convenience, and malware from an office workstation rode that path into operations.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the real failure happened before the malware executed on SCADA. The environments should never have been that reachable from each other.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. OT and IT are not supposed to share a casually convenient trust relationship.',
        },
      ],
      conceptHook:
        'Specialized infrastructure lives closest to physical consequence. For SCADA and ICS, segmentation from corporate IT is often the primary safety control.',
    },
    callback: {
      title: 'Convenience Collapsed The Safety Boundary',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So while patching and local controls matter, the root cause here is that the corporate breach had a direct path into operational technology.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. SCADA environments need extensive segmentation or air-gapping precisely to prevent that crossover.',
        },
      ],
      takeaway:
        'If IT malware reaches SCADA or OT through an organizational connection that should have been isolated, the core failure is insufficient segmentation or air-gap between the environments.',
    },
  },
  '3-1-infrastructure-considerations': {
    coldOpen: {
      title: 'The Insurance Policy Did Not Stop The Attack',
      cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Finance bought cyber liability coverage for ransomware payouts and business interruption, but that obviously does not harden a single system.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So the company changed who eats the financial loss, not whether the incident is likely to happen.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Infrastructure and risk questions often hinge on whether you reduced the risk or moved the consequences.',
        },
      ],
      conceptHook:
        'Risk-management questions often separate prevention from financing. Insurance changes the financial exposure, not the attack surface.',
    },
    callback: {
      title: 'The Cost Moved, The Risk Stayed',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So buying insurance did not avoid, accept, or technically mitigate the problem. It shifted the financial burden outward.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is textbook risk transference.',
        },
      ],
      takeaway:
        'If an organization uses insurance or a contract to hand financial consequences to a third party, the answer is risk transference.',
    },
  },
  '3-2-secure-infrastructures': {
    coldOpen: {
      title: 'The Public Servers Needed Their Own Zone',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The web servers must stay reachable from the internet, but no one wants them sitting directly inside the internal corporate network.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So we need a buffer zone that accepts external traffic without letting a single server compromise become an internal free pass.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Secure-infrastructure questions love that specific placement pattern.',
        },
      ],
      conceptHook:
        'Device placement is a control in itself. Public-facing systems belong in an intermediate zone designed to absorb risk without collapsing the trusted network.',
    },
    callback: {
      title: 'Reachable, But Not Trusted',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the answer is not just some generic external segment. It is the screened subnet built for public-facing workloads.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. A DMZ exists so internet exposure does not imply internal trust.',
        },
      ],
      takeaway:
        'If servers must be internet-facing but separated from the internal network by firewalls, the expected zone is a DMZ or screened subnet.',
    },
  },
  '3-2-intrusion-prevention': {
    coldOpen: {
      title: 'The Sensor Could See Everything And Stop Nothing',
      cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The new monitoring box gets a mirrored copy of all traffic from the switch, raises alerts on attack patterns, and has no way to block packets.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So it lives off a SPAN-port copy. That means visibility without inline control.',
        },
        {
          speakerId: 'noah-reed',
          text: 'Exactly. The whole question turns on passive versus inline placement.',
        },
      ],
      conceptHook:
        'IDS and IPS are mostly about topology and authority. If the device only sees a copy, detection is possible but prevention is not.',
    },
    callback: {
      title: 'Passive Meant Detect-Only',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the SPAN port tells you this box is observing, not sitting in the traffic path.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Copy-only monitoring plus alerts equals IDS, not IPS.',
        },
      ],
      takeaway:
        'If a device receives mirrored traffic via TAP or SPAN and can only alert, the expected answer is IDS.',
    },
  },
  '3-2-network-appliances': {
    coldOpen: {
      title: 'Every Employee Click Went Through The Same Gate',
      cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'All employee web requests are being intercepted, scanned for malware, filtered by category, and cached for speed before they reach the internet.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So this appliance is controlling outbound user browsing, not protecting inbound server traffic.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Proxy questions usually hinge on which direction of traffic is being mediated.',
        },
      ],
      conceptHook:
        'Forward and reverse proxies can look similar until you ask who is being shielded. Outbound user control points to a forward proxy or secure web gateway.',
    },
    callback: {
      title: 'The Users Browsed Through It',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because it filters employee web access, blocks categories, and caches outbound content, this is the user-side proxy.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is a forward proxy or secure web gateway, not a reverse proxy.',
        },
      ],
      takeaway:
        'If the appliance intercepts outbound employee browsing for inspection, filtering, and caching, think forward proxy or secure web gateway.',
    },
  },
  '3-2-firewall-types': {
    coldOpen: {
      title: 'Port 443 Was Not Specific Enough',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Leadership wants Dropbox and Google Drive blocked on every port, even when they hide inside normal HTTPS on 443.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So a port-based rule is useless. We need something that recognizes the application itself inside allowed traffic.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. This is the classic distinction between traditional and next-generation firewalls.',
        },
      ],
      conceptHook:
        'Firewall-type questions often hinge on whether IP and port are enough. When policy depends on application identity, Layer 7 inspection becomes mandatory.',
    },
    callback: {
      title: 'HTTPS Needed To Be Split By Application',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the firewall had to allow some 443 traffic and block other 443 traffic based on the app, not the port.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is exactly why NGFWs exist.',
        },
      ],
      takeaway:
        'If the organization wants to block specific apps regardless of port, the expected control is an NGFW.',
    },
  },
  '3-2-port-security-802-1x': {
    coldOpen: {
      title: 'The Port Stayed Quiet Until The Laptop Proved Itself',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The visitor plugged into the conference-room jack, but the switch only allowed EAP messages until the laptop authenticated.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the port itself was enforcing a before-access checkpoint rather than trusting whatever got plugged in.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The clue is the unauthorized state with EAP-only traffic.',
        },
      ],
      conceptHook:
        'Port-security questions often hinge on timing. If normal traffic is withheld until authentication succeeds, you are in 802.1X territory.',
    },
    callback: {
      title: 'Only EAP Got Through At First',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So MAC filtering is too weak and VLAN tagging misses the point. The real control was port-based NAC before access.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Holding everything except EAP until auth completes is the textbook 802.1X pattern.',
        },
      ],
      takeaway:
        'If a switch or AP allows only EAP until a client authenticates, the answer is 802.1X port-based NAC.',
    },
  },
  '3-2-secure-communication': {
    coldOpen: {
      title: 'The Remote Tunnel Rode On 443',
      cast: ['rosa-jimenez', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Remote employees connect from home with a VPN client over port 443, and there are no site-to-site shared secrets or certificate requirements involved.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So this is aimed at user remote access through TLS-friendly paths, not a network-to-network IPsec design.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The protocol, port, and user scenario all point in the same direction.',
        },
      ],
      conceptHook:
        'Secure-communication questions often separate remote-user VPNs from site-to-site VPNs by transport details and operational shape.',
    },
    callback: {
      title: 'Remote Access, Not Site-To-Site',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So port 443 plus remote-user access steers us toward SSL or TLS VPN, not IPsec.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The lesson is to match the tunnel style to the access scenario.',
        },
      ],
      takeaway:
        'If remote users connect over port 443 with a client-oriented tunnel, the expected answer is SSL/TLS VPN.',
    },
  },
  '3-3-data-types-and-classifications': {
    coldOpen: {
      title: 'The Medical Records Were More Than Just PII',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The database holds patient names, diagnoses, treatment dates, and insurance payments. It is personal data, but that label is still too broad.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the question is asking for the healthcare-specific regulatory category, not just whether the data identifies a person.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. US healthcare law gives this dataset its own protected classification.',
        },
      ],
      conceptHook:
        'Data-classification questions often distinguish general sensitivity from legally defined categories. In healthcare, the regulatory label matters.',
    },
    callback: {
      title: 'Healthcare Context Changed The Label',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So even though it contains identifying information, the medical and payment context pushes it into PHI under HIPAA.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The healthcare relationship is what makes the classification specific.',
        },
      ],
      takeaway:
        'If health information is tied to an identifiable person in the US, the expected classification is PHI under HIPAA.',
    },
  },
  '3-3-states-of-data': {
    coldOpen: {
      title: 'The Card Number Was Safe Until It Reached RAM',
      cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The payment data was encrypted on disk and on the wire, but the malware scraped it directly from memory while the terminal processed the sale.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the attackers waited for the one moment the protections had to come off so the system could actually use the data.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That is the hardest data state to protect.',
        },
      ],
      conceptHook:
        'States-of-data questions often hinge on where the protection fails. If the system is actively processing the information, the exposure is in use, not at rest or in transit.',
    },
    callback: {
      title: 'The Data Was Exposed Only While Processing',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the encryption worked in storage and over the network, but the attack succeeded in memory during computation.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. RAM scraping is the classic data-in-use example.',
        },
      ],
      takeaway:
        'If malware reads sensitive values from memory during active processing, the state under attack is data in use.',
    },
  },
  '3-3-protecting-data': {
    coldOpen: {
      title: 'The Database Stored A Stand-In, Not The Card Number',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The payment system keeps a surrogate value in the database, and even a full breach would not let the attacker reconstruct the real card number from what they stole.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So this is stronger than masking and different from encryption because there is no reversible mathematical relationship in the stored value itself.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The useful clue is the separate vault and the uselessness of the database copy alone.',
        },
      ],
      conceptHook:
        'Data-protection questions often separate appearance from recoverability. If the stored replacement is unrelated to the original, you are in tokenization rather than masking or encryption.',
    },
    callback: {
      title: 'The Stolen Value Was Useless By Design',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the attacker walked away with placeholders, not encrypted card numbers waiting for a key.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Tokenization wins by keeping the real value somewhere else entirely.',
        },
      ],
      takeaway:
        'If the database stores a non-reversible stand-in while the real sensitive value lives in a separate vault, the answer is tokenization.',
    },
  },
  '3-4-resiliency': {
    coldOpen: {
      title: 'Both Servers Were Live Before Anything Broke',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The load balancer is already sending traffic to both web servers, so when one dies the other just keeps carrying the site.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So the spare capacity was active all along. This is not a standby box waking up after the failure.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Resiliency questions often hinge on whether the redundant node was already serving traffic.',
        },
      ],
      conceptHook:
        'Resiliency patterns differ by how redundancy is used before failure. If every node is active under normal conditions, you are usually looking at active/active design.',
    },
    callback: {
      title: 'Failover Happened Without Waking Anything Up',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So nothing had to start, sync, or switch roles after the outage. The surviving node just absorbed the full load.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is the core active/active clue.',
        },
      ],
      takeaway:
        'If multiple nodes already handle live traffic and one fails without interruption, think active/active load balancing or clustering.',
    },
  },
  '3-4-site-resiliency': {
    coldOpen: {
      title: 'The Building Was Ready, But The Hardware Was Not There Yet',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The disaster site has power, racks, and network connectivity, but the production hardware still has to be shipped there after the declaration.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So it is not empty enough to be cold and not complete enough to be hot.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The answer lives in that middle ground between instant and weeks-long recovery.',
        },
      ],
      conceptHook:
        'Site-resiliency questions are mainly about readiness versus cost. Warm sites sit in the expensive but practical middle.',
    },
    callback: {
      title: 'Ready Infrastructure, Delayed Compute',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the hours-to-days recovery time comes from the hardware and setup gap, not from rebuilding an entire facility from scratch.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is why this is a warm site.',
        },
      ],
      takeaway:
        'If the site has infrastructure in place but still needs equipment or configuration before use, the expected answer is warm site.',
    },
  },
  '3-4-recovery-testing-and-backups': {
    coldOpen: {
      title: 'The Fake Phish Told Them More Than A Meeting Ever Would',
      cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The team sent live fake phishing emails, watched who clicked, tracked what bypassed filters, and measured how fast the help desk reacted.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So this went beyond a discussion. Real user behavior was part of the test, even though the event was controlled.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The scenario is realistic but intentionally safe, which is the whole point.',
        },
      ],
      conceptHook:
        'Recovery and preparedness testing differs by realism. Simulations create controlled but realistic behavior, while tabletops stay discussion-only.',
    },
    callback: {
      title: 'They Tested Reactions, Not Just Plans',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because people actually clicked or reported the email, this was more than a tabletop and less than a real attack.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That puts it squarely in simulation territory.',
        },
      ],
      takeaway:
        'If a controlled exercise is realistic enough to generate actual user and system responses, the expected answer is simulation.',
    },
  },
  '3-4-power-resiliency': {
    coldOpen: {
      title: 'The Servers Could Not Blink When Power Failed',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The data center team says even a millisecond of interruption is unacceptable when utility power drops.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So standby transfer delays are already too slow. They need the power path to be battery-backed all the time.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Zero transfer time narrows the UPS choice fast.',
        },
      ],
      conceptHook:
        'Power-resiliency questions usually hinge on transfer behavior. If there can be no interruption at all, only one UPS topology fits.',
    },
    callback: {
      title: 'The Battery Path Was Never Optional',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the equipment had to be continuously fed through the UPS conversion path, not switched onto it after failure.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is why online double-conversion is the answer.',
        },
      ],
      takeaway:
        'If the requirement is zero transfer time with no interruption, the expected answer is online or double-conversion UPS.',
    },
  },
  '4-1-secure-baselines': {
    coldOpen: {
      title: 'Five Hundred Workstations Could Not Be Checked By Hand',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Northwind rolled out a new application to 500 workstations, and now security has to prove every one of them still matches the baseline.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the problem is scale as much as configuration. Manual inspection dies immediately at that number.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Baselines only work in large environments when deployment and validation are automated.',
        },
      ],
      conceptHook:
        'Secure baselines are not just a document. They need centralized enforcement and automated compliance checks to matter at scale.',
    },
    callback: {
      title: 'Centralized Control Was The Only Realistic Path',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So Group Policy plus automated scanning is doing the real work here, not user self-attestation or spot checks.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Baseline verification across hundreds of endpoints is an automation problem.',
        },
      ],
      takeaway:
        'If hundreds of systems must be checked against a standard configuration, the expected answer is centralized policy plus automated compliance scanning.',
    },
  },
  '4-1-hardening-targets': {
    coldOpen: {
      title: 'The Factory Floor Could Not Be Treated Like Office IT',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The engineer needs to harden a SCADA system on the factory floor, and half the usual IT playbook feels dangerous or irrelevant.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the most important control is not convenience updates or cloud agents. It is making sure that industrial system is cut off from casual external reach.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. SCADA hardening starts with isolation and segmentation.',
        },
      ],
      conceptHook:
        'Hardening targets differ by environment. For OT and SCADA, network isolation often matters more than the endpoint controls you would prioritize on office systems.',
    },
    callback: {
      title: 'Segmentation Was The First Safety Measure',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So before antivirus or cloud tooling, the real priority is keeping the industrial control network separate from outside access paths.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Extensive segmentation is the core hardening answer for SCADA.',
        },
      ],
      takeaway:
        'If the target is SCADA or ICS, the expected hardening priority is extensive segmentation with no external access.',
    },
  },
  '4-1-securing-wireless-and-mobile': {
    coldOpen: {
      title: 'The Phone Was Theirs, But The Email Was Ours',
      cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'Employees want to use their own smartphones for corporate email, but Northwind still needs real control over company data.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So full device ownership is off the table, yet unmanaged personal apps touching corporate mail is not acceptable either.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The trick is separating corporate control from personal ownership.',
        },
      ],
      conceptHook:
        'Mobile-security ownership models are mostly tradeoff questions. BYOD with managed containment is the compromise when the device stays personal but the data cannot.',
    },
    callback: {
      title: 'They Needed To Own The Data, Not The Phone',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the best fit is a managed container on the employee device, not full corporate takeover of the whole phone.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. BYOD with MDM containerization is the balance point.',
        },
      ],
      takeaway:
        'If the device remains employee-owned but the company wants strong control over corporate data, the expected answer is BYOD with MDM containerization.',
    },
  },
  '4-1-wireless-security-settings': {
    coldOpen: {
      title: 'The Handshake Was Enough To Start Guessing',
      cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The attacker captured the WPA2 four-way handshake, and now they can work on the password without staying anywhere near the network.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the dangerous part is not immediate decryption. It is that the handshake gives them material for offline guessing.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That captured exchange becomes the starting point for brute-force work.',
        },
      ],
      conceptHook:
        'Wireless-security questions often hinge on what an attacker can do after capture. WPA2 PSK turns the handshake into offline cracking fuel.',
    },
    callback: {
      title: 'They Took The Guessing Offline',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So once the handshake is captured, the attacker can try dictionary and brute-force guesses without bothering the access point anymore.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is the core WPA2-PSK weakness WPA3 SAE removes.',
        },
      ],
      takeaway:
        'If an attacker captures a WPA2 four-way handshake, the expected next step is an offline brute-force or dictionary attack against the PSK.',
    },
  },
  '4-1-application-security': {
    coldOpen: {
      title: 'Two Hundred Findings Did Not Mean Two Hundred Bugs',
      cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The static analyzer flagged 200 findings, including buffer overflows and SQL injection risks, and the team is wondering how much to trust the list.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the tool is useful, but the report is not the same thing as a finished security verdict.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. SAST is powerful for common code flaws, but it is noisy and blind to some categories.',
        },
      ],
      conceptHook:
        'Application-security tooling questions often hinge on limitations. SAST is valuable, but it still needs human review and cannot infer every kind of logic flaw.',
    },
    callback: {
      title: 'The Report Needed Human Judgment',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the team has to triage false positives and still look elsewhere for authentication and crypto design flaws.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That limitation is what the exam is testing, not whether SAST can find injections at all.',
        },
      ],
      takeaway:
        'If the question is about SAST limitations, remember false positives and the inability to reliably catch authentication or cryptographic logic flaws.',
    },
  },
  '4-2-asset-management': {
    coldOpen: {
      title: 'The Drives Needed To Die With Paperwork',
      cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Northwind is retiring 500 drives from a hospital environment, and both irrecoverable destruction and compliance evidence matter.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So wiping alone is not enough for the scenario. They also need documentation proving the disposal happened correctly.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. This is about destruction plus audit trail.',
        },
      ],
      conceptHook:
        'Asset-management questions often couple technical disposal with governance. For regulated data, how you prove destruction can matter almost as much as destruction itself.',
    },
    callback: {
      title: 'Destruction Needed A Receipt',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the best answer is third-party physical destruction paired with a certificate, not just one more overwrite pass.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Sensitive healthcare media needs irrecoverable disposal and a compliance paper trail.',
        },
      ],
      takeaway:
        'If regulated media must be destroyed and the organization also needs evidence for auditors, the expected answer is physical destruction with a certificate of destruction.',
    },
  },
  '4-3-vulnerability-scanning': {
    coldOpen: {
      title: 'The Test Build Started Crashing On Garbage Input',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'I pointed a test harness at the customer portal and started throwing malformed input at every field. After a few thousand requests, it crashed hard.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So this was not a port scan or a code review. You were trying to break the running app by feeding it nonsense.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Dynamic analysis is useful when you want the software to reveal edge-case failures instead of just reading the code.',
        },
      ],
      conceptHook:
        'Vulnerability scanning is broader than a single tool. Port scans, SAST, package monitoring, and fuzzing each expose different kinds of weakness.',
    },
    callback: {
      title: 'The Crash Was The Evidence',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the tell was the random malformed input plus the application crash, which points straight to fuzzing.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. When the exam gives you garbage input and a live app failure, it wants dynamic analysis.',
        },
      ],
      takeaway:
        'If a team is sending random or malformed input to a running application and watching for crashes, the expected answer is fuzzing.',
    },
  },
  '4-3-threat-intelligence': {
    coldOpen: {
      title: 'Northwind Found Itself For Sale',
      cast: ['rosa-jimenez', 'glen-foster', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'A monitoring vendor flagged a dark web post listing Northwind employee credentials and asking whether anyone wanted network access bundled with them.',
        },
        {
          speakerId: 'glen-foster',
          text: 'I would prefer it if our company name stopped appearing in sentences that include the phrase network access bundled with them.',
        },
        {
          speakerId: 'priya-nair',
          text: 'That is why threat intelligence is not just reading public headlines. Some of the useful warning signs live where normal search engines do not.',
        },
      ],
      conceptHook:
        'Threat intelligence pulls from different sources for different jobs. OSINT is public, proprietary feeds are curated, and dark web monitoring surfaces activity that public tools will not.',
    },
    callback: {
      title: 'The Source Was Not Public At All',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the clue was stolen credentials being discussed in a criminal forum, which rules out normal OSINT.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is dark web intelligence monitoring, not social media scraping.',
        },
      ],
      takeaway:
        'When the scenario involves criminal forums, stolen credentials, or Tor-only spaces, the expected intelligence source is dark web monitoring.',
    },
  },
  '4-3-penetration-testing': {
    coldOpen: {
      title: 'The Pentest Moved Sideways Fast',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The pentest team landed on a receptionist workstation, then used it to reach a database VLAN that was never exposed to the internet.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So they were not just moving laterally across similar systems. They used the first foothold as a relay into a network they could not touch directly.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The workstation became the bridge.',
        },
      ],
      conceptHook:
        'Penetration testing is about exploitation, not just discovery. Once access exists, the process includes lateral movement, persistence, and pivoting into otherwise unreachable areas.',
    },
    callback: {
      title: 'The Workstation Became The Lever',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the key difference is that the compromised host was used to reach deeper network space. That makes it the pivot.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. If the first host becomes your stepping stone, the question is asking about pivoting.',
        },
      ],
      takeaway:
        'When an attacker uses one compromised host as a relay to reach systems that were otherwise inaccessible, that technique is the pivot.',
    },
  },
  '4-3-analyzing-vulnerabilities': {
    coldOpen: {
      title: 'Not Every Critical Finding Was Equally Critical',
      cast: ['marty-bell', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'The scanner marked two systems critical. One runs a customer payment portal. The other is a research lab box no one outside the building can reach.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So the score alone is not the whole story. Business context changes the queue.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Severity matters, but exposure and impact matter too.',
        },
      ],
      conceptHook:
        'Vulnerability analysis is where raw findings become real priorities. CVSS gives severity, but exposure factor and environmental context decide what gets fixed first.',
    },
    callback: {
      title: 'Context Broke The Tie',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So identical findings still separate once one is public-facing and tied to revenue while the other sits in an isolated lab.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Same vulnerability, different remediation priority.',
        },
      ],
      takeaway:
        'If two systems share the same vulnerability, the one with higher exposure and business impact gets remediated first.',
    },
  },
  '4-3-vulnerability-remediation': {
    coldOpen: {
      title: 'The Legacy Device Was Never Getting A Patch',
      cast: ['ethan-cole', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The hospital imaging device is still vulnerable, but the vendor stopped supporting it years ago and the replacement budget is next quarter.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So patch now is not a real option, and ignore it is not an option either.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. When the ideal fix is unavailable, you contain the exposure immediately.',
        },
      ],
      conceptHook:
        'Remediation is not always patch and move on. Segmentation, access restriction, compensating controls, and documented exceptions exist for the cases where patching is delayed or impossible.',
    },
    callback: {
      title: 'Containment Came First',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the best immediate move is isolating the device and tightening access, not pretending insurance or paperwork fixes the risk.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Compensating controls buy time. They do not replace the long-term plan.',
        },
      ],
      takeaway:
        'If a legacy system cannot be patched, the expected immediate answer is compensating controls such as segmentation and restricted access.',
    },
  },
  '4-4-security-monitoring': {
    coldOpen: {
      title: 'The Login Failures Spiked While Everyone Slept',
      cast: ['noah-reed', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'The overnight report shows one account had a five-hundred-percent jump in failed logins between 2:00 and 4:00 a.m.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So not an availability issue or a firewall throughput problem. This is abnormal authentication behavior.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Monitoring only matters if it spots the pattern fast enough to act on it.',
        },
      ],
      conceptHook:
        'Security monitoring ties together systems, applications, and infrastructure signals. Authentication anomalies are one of the most common examples of useful alerting.',
    },
    callback: {
      title: 'The Pattern Triggered The Alert',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the mechanism was authentication monitoring with anomaly alerting, because it compared the spike against normal behavior.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The ratio and the timing are what make it stand out.',
        },
      ],
      takeaway:
        'If a scenario highlights unusual login volume, strange hours, or baseline deviation, the answer is usually authentication monitoring with anomaly alerting.',
    },
  },
  '4-4-security-tools': {
    coldOpen: {
      title: 'The Switch Did Not Wait To Be Asked',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The core switch threw an alert to the console the instant CPU hit ninety percent. Nobody had to poll it first.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So that rules out ordinary SNMP polling. The device initiated the warning itself.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The protocol matters because the exam is testing push versus pull.',
        },
      ],
      conceptHook:
        'Security tooling questions often separate similar technologies by workflow. SNMP polls retrieve stats on demand; SNMP traps proactively send alerts when thresholds are crossed.',
    },
    callback: {
      title: 'The Device Sent The First Word',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So immediate threshold-based notification from the device itself means SNMP trap, not a collector query.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. If the device speaks first, it is the trap model.',
        },
      ],
      takeaway:
        'When a monitored device pushes an alert the moment a threshold is crossed, the expected answer is SNMP trap.',
    },
  },
  '4-5-firewalls': {
    coldOpen: {
      title: 'The Allow Rule Was Too Low To Matter',
      cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Someone added an allow rule for SSH, but they dropped it below an older deny rule covering the whole 10.0.0.0 slash 8 range.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the new rule looked helpful and changed absolutely nothing for anyone in that subnet.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Firewalls do not care what you meant. They care what matches first.',
        },
      ],
      conceptHook:
        'Firewall questions often hinge on rule order. Specific allows only matter if a broader deny above them does not catch the traffic first.',
    },
    callback: {
      title: 'First Match Won',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the SSH traffic from 10.1.1.5 dies at the deny rule before the allow can even be considered.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Top-to-bottom processing is the whole lesson there.',
        },
      ],
      takeaway:
        'If a deny rule appears above an allow rule and both match the traffic, the deny wins because firewalls evaluate rules top to bottom.',
    },
  },
  '4-5-web-filtering-and-os-security': {
    coldOpen: {
      title: 'The Laptop Took Policy Home With It',
      cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'A salesperson tried to open a gambling site from home on a company laptop and still hit the corporate block page.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So the control was living on the endpoint, not waiting at the office perimeter.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Off-network enforcement is the clue.',
        },
      ],
      conceptHook:
        'Web filtering can happen in several places. If policy follows the user off-site, the question is usually pointing to an on-device agent rather than a network choke point.',
    },
    callback: {
      title: 'The Filter Never Needed The Office Network',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the laptop was on a home network and the site still got blocked, the local agent had to be doing the enforcement.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That is the whole reason agent-based filtering exists.',
        },
      ],
      takeaway:
        'If a company laptop enforces web policy while off-site, the expected answer is agent-based filtering on the endpoint.',
    },
  },
  '4-5-email-security-and-data-monitoring': {
    coldOpen: {
      title: 'Spoofed Mail Kept Borrowing Northwind\'s Name',
      cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'Customers keep receiving fake invoices that appear to come from Northwind, and SPF plus DKIM alone are only telling recipients something failed.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So we know the message is bad, but we have not yet told receiving mail servers what to do about it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Detection without enforcement still leaves too much room for the spoof to land.',
        },
      ],
      conceptHook:
        'Email security is layered. SPF and DKIM establish validation, while DMARC tells receivers whether to accept, quarantine, or reject failed mail.',
    },
    callback: {
      title: 'The Missing Piece Was Enforcement',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So SPF and DKIM identify the failure, but DMARC with a reject policy is what actually tells receivers to throw the message away.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. DMARC is the enforcement layer that makes the other two actionable.',
        },
      ],
      takeaway:
        'If the question asks which control tells receiving mail servers to reject failed messages, the answer is DMARC policy set to reject.',
    },
  },
  '4-5-endpoint-security': {
    coldOpen: {
      title: 'The Laptop Isolated Itself Before Anyone Woke Up',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'An endpoint started spawning suspicious processes, correlated the behavior with outbound traffic to a sketchy host, and cut itself off from the network before the analyst on call even logged in.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So this was not just passive logging. The tool detected behavior and executed containment on its own.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The automatic response is the clue, not just the detection.',
        },
      ],
      conceptHook:
        'Endpoint security has moved beyond signature-only antivirus. Modern endpoint tools combine behavior analysis with automated response and, in XDR, broader telemetry correlation.',
    },
    callback: {
      title: 'The Response Was The Differentiator',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So when the question says the endpoint detected suspicious behavior and isolated the device itself, it is pointing to EDR with automated response.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Detection plus immediate endpoint containment is the pattern to remember.',
        },
      ],
      takeaway:
        'If the endpoint detects behavior and automatically isolates or remediates the device, the expected answer is EDR with automated response.',
    },
  },
  '4-6-identity-and-access-management': {
    coldOpen: {
      title: 'The Calendar App Wanted Only One Slice Of Access',
      cast: ['glen-foster', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'A partner scheduling app wants access to my Google Calendar, but I am not handing it my main account password just so it can read meetings.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the right system gives the app limited permission to one resource instead of full identity control over everything.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The scope of access is the whole point.',
        },
      ],
      conceptHook:
        'IAM questions often separate authentication from authorization. OAuth is about scoped authorization, while SSO and related protocols handle identity and session trust.',
    },
    callback: {
      title: 'Scoped Access Was The Tell',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So once the scenario says a third-party app got limited access to Calendar data, the answer is OAuth.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Authentication may be nearby, but the resource permission itself is OAuth territory.',
        },
      ],
      takeaway:
        'If an application receives limited, scoped access to a user resource without getting the user password, the expected answer is OAuth.',
    },
  },
  '4-6-access-controls': {
    coldOpen: {
      title: 'No One Owned The Secret Files',
      cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The government contract data is labeled Confidential, Secret, or Top Secret, and even the person who creates a file cannot decide who else gets access to it.',
        },
        {
          speakerId: 'marty-bell',
          text: 'So ownership is irrelevant because the system clearance rules outrank individual preference.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. That rigidity is the distinguishing feature.',
        },
      ],
      conceptHook:
        'Access-control models matter because they answer different policy needs. When the operating system enforces label-based access that users cannot change, that is MAC, not DAC or RBAC.',
    },
    callback: {
      title: 'The Labels Made The Decision',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because administrators assign the clearances and users cannot override them, the model has to be mandatory access control.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Owner discretion would point somewhere else. This scenario does not allow it.',
        },
      ],
      takeaway:
        'If objects and users have security labels enforced by the system and users cannot grant access themselves, the answer is MAC.',
    },
  },
  '4-6-multifactor-authentication': {
    coldOpen: {
      title: 'Two Secrets Did Not Make Two Factors',
      cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The vendor swears their login is multifactor because users enter both a password and a PIN.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So they doubled up on secrets and hoped no one would notice those are still the same kind of proof.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Quantity does not matter if the categories do not change.',
        },
      ],
      conceptHook:
        'MFA depends on using different factor categories. Two secrets from the same category are still single-factor authentication with extra steps.',
    },
    callback: {
      title: 'Same Category, Same Factor',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So password plus PIN still fails the test because both are something you know.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. True MFA needs a second category, not just a second secret.',
        },
      ],
      takeaway:
        'If both credentials come from the same factor category, it is not multifactor authentication.',
    },
  },
  '4-6-password-security': {
    coldOpen: {
      title: 'Root Access Arrived On A Timer',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The Linux admin asked a central system for root access, received temporary credentials for the maintenance window, and watched them disappear when the session ended.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So there was no standing admin password sitting in a vault waiting to be reused forever.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The time limit is the important design decision.',
        },
      ],
      conceptHook:
        'Password security is not just complexity rules. JIT access and vaulting reduce the blast radius of privileged credentials by keeping elevation temporary and tightly controlled.',
    },
    callback: {
      title: 'Privilege Expired On Purpose',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So when the admin has to request elevated access and gets short-lived credentials that vanish afterward, the model is JIT.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. No permanent privileged account is the whole point.',
        },
      ],
      takeaway:
        'If elevated access is requested from a central system, granted temporarily, and removed after the task, the expected answer is JIT permissions.',
    },
  },
  '4-7-scripting-and-automation': {
    coldOpen: {
      title: 'HR Hired Someone And The Accounts Appeared',
      cast: ['rosa-jimenez', 'glen-foster', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The moment HR finalized a new hire, the account existed, the right security groups were assigned, and the laptop provisioning workflow had already started.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the system turned an HR event into a full onboarding sequence without waiting for three separate manual tickets.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. This is automation doing identity setup work at machine speed.',
        },
      ],
      conceptHook:
        'Security automation shines when repetitive processes need to be fast, consistent, and tied to external triggers such as HR events, alerts, or API responses.',
    },
    callback: {
      title: 'Provisioning Was The Main Benefit',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the scenario is really about automated user provisioning, even though laptop setup and group assignment came along for the ride.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The trigger and the identity lifecycle work are the giveaway.',
        },
      ],
      takeaway:
        'If an HR or similar event automatically creates accounts, assigns groups, and starts onboarding, the expected answer is user provisioning automation.',
    },
  },
  '4-8-incident-response': {
    coldOpen: {
      title: 'The Malware Was Already Running',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The analyst confirmed malware had been executing on a workstation for two hours and might already be trying to move laterally.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So we are past debating whether an incident exists. The next decision is how fast to isolate and stop spread.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Detection happened already. The lifecycle has moved on.',
        },
      ],
      conceptHook:
        'The NIST incident response lifecycle depends on recognizing the phase you are in. Once the incident is confirmed, the priority becomes containment, eradication, and recovery.',
    },
    callback: {
      title: 'Confirmation Changed The Phase',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the malware is confirmed and active, the team should move immediately into containment, eradication, and recovery.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Do not stay in analysis mode after the answer is already obvious.',
        },
      ],
      takeaway:
        'If malware is confirmed and the question asks what happens next in the NIST lifecycle, the answer is containment, eradication, and recovery.',
    },
  },
  '4-8-incident-planning': {
    coldOpen: {
      title: 'The Fake Phish Was Measuring Everyone',
      cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The company sent a fake phishing email to every employee, then counted clicks, reports, and whether the spam filter missed it.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So this was not a conference-room discussion. They generated real user behavior and measured it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The realism is what matters here.',
        },
      ],
      conceptHook:
        'Incident-planning exercises vary by realism. Tabletop exercises are discussion-only, while simulations create controlled real-world conditions and measure actual outcomes.',
    },
    callback: {
      title: 'Discussion Was Not Enough',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because they sent real messages to real users and measured results, the exercise type is simulation.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Tabletop would have stopped at talking through the scenario.',
        },
      ],
      takeaway:
        'If a team creates a realistic but controlled test and measures user or system behavior, the expected answer is simulation exercise.',
    },
  },
  '4-8-digital-forensics': {
    coldOpen: {
      title: 'The Hash Had To Match Before Anyone Trusted The Copy',
      cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The investigator imaged the suspect drive, hashed the original and the copy, and logged every handoff before anyone started analysis.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the copy is only useful if they can prove it is identical and untouched, not just convenient to work from.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Forensics falls apart fast if integrity is only assumed.',
        },
      ],
      conceptHook:
        'Digital forensics is as much about evidence integrity as analysis. Hash validation, write blockers, and chain-of-custody records are what make the evidence defensible later.',
    },
    callback: {
      title: 'Integrity Had To Be Proven First',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the primary reason for the hash comparison is proving the forensic image is an exact, unaltered copy of the original drive.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. That proof is foundational for admissibility and trust.',
        },
      ],
      takeaway:
        'If the scenario compares hashes on the source and the forensic image, the point is to verify an exact, unaltered replica.',
    },
  },
  '4-8-log-data': {
    coldOpen: {
      title: 'The Flow Logs Were Not Detailed Enough',
      cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The firewall showed the compromised host talking to an external command-and-control server, but the investigator needed the exact packet sequence and payload details.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So high-level flow records and signature hits were useful, just not detailed enough for reconstruction.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Sometimes only the highest-fidelity source will answer the question.',
        },
      ],
      conceptHook:
        'Different log sources answer different investigative questions. When the task requires exact protocol exchanges rather than summaries, packet captures outrank dashboards and flow logs.',
    },
    callback: {
      title: 'Metadata Was Not Enough Anymore',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if the investigator needs the precise sequence and content of packets, the answer has to be packet captures.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Summaries tell you that traffic happened. Captures tell you exactly how.',
        },
      ],
      takeaway:
        'If an investigator needs the exact bytes and sequence of communications, the expected source is packet captures.',
    },
  },
  '5-1-security-policies': {
    coldOpen: {
      title: 'The Crypto Miner Was Not A Creative Use Of Company Time',
      cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'Someone turned a company laptop into a personal cryptocurrency miner and then argued that nobody had explicitly told them not to do it.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So now the question is which policy actually gives the company a clean basis to act, not just which policy sounds generally security-related.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Broad principles are not enough if the behavior rule lives somewhere more specific.',
        },
      ],
      conceptHook:
        'Security policies define expectations, roles, and boundaries. The exam often tests whether you can choose the policy that directly governs a specific behavior.',
    },
    callback: {
      title: 'The Right Policy Was The Behavioral One',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So even though information security policy matters overall, the document that directly covers misuse of company devices is the AUP.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The most direct governing document is the answer the exam wants.',
        },
      ],
      takeaway:
        'If the scenario is about unacceptable use of company devices or services, the expected answer is the acceptable use policy.',
    },
  },
  '5-1-security-standards-and-procedures': {
    coldOpen: {
      title: 'The Database Upgrade Needed More Than Optimism',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The infrastructure team wants to upgrade the production database tonight, and the first version of the plan was basically do the upgrade and hope for the best.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Hope is not a backout plan, I assume.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Correct. The board review and rollback plan exist precisely because critical changes fail at inconvenient times.',
        },
      ],
      conceptHook:
        'Standards and procedures turn policy into repeatable action. Change control is one of the clearest examples because it formalizes risky production changes before they happen.',
    },
    callback: {
      title: 'Formal Review Was The Whole Point',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So when the scenario mentions review board approval plus a documented rollback, it is describing change control, not disaster planning.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Planned production change with governance and a backout path means change control.',
        },
      ],
      takeaway:
        'If a production change needs formal approval, risk review, and a rollback plan, the expected process is change control.',
    },
  },
  '5-1-governance-and-considerations': {
    coldOpen: {
      title: 'The CMO Owned The Data, Not The ACLs',
      cast: ['denise-park', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'The clinical systems team encrypts patient records, labels them as PHI, and manages access daily, but the Chief Medical Officer still signs off on how that data is used.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So one role handles the daily protective work while another carries the senior accountability.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Governance questions often split responsibility that way on purpose.',
        },
      ],
      conceptHook:
        'Governance assigns decision authority and accountability. Data owner, controller, processor, and custodian are related roles, but they are not interchangeable.',
    },
    callback: {
      title: 'Accountability Sat Above Operations',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the security team doing labels, access, and encryption is the custodian role, while the executive accountable for the dataset is the owner.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Day-to-day stewardship and senior accountability are separate on purpose.',
        },
      ],
      takeaway:
        'If a technical team manages access and protection daily while an executive retains ultimate accountability, the team is the custodian and the executive is the owner.',
    },
  },
  '5-2-risk-management': {
    coldOpen: {
      title: 'The Card Audit Was Not Optional Or One-Off',
      cast: ['marty-bell', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'The payment team keeps asking why they have to repeat the risk assessment every year if the environment has not dramatically changed.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'Because when an outside standard mandates the cadence, recurring is the feature, not the annoyance.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Scheduled by regulation is a distinct assessment pattern.',
        },
      ],
      conceptHook:
        'Risk management is ongoing, and assessment cadence matters. One-time, ad hoc, and recurring assessments solve different needs and are triggered for different reasons.',
    },
    callback: {
      title: 'The Calendar Requirement Was The Clue',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So if PCI DSS says do it every year, the right label is recurring mandated assessment.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. External schedule plus annual repetition gives the answer away.',
        },
      ],
      takeaway:
        'If an assessment happens on a required recurring schedule because a standard mandates it, the answer is recurring mandated assessment.',
    },
  },
  '5-2-risk-analysis': {
    coldOpen: {
      title: 'Priya Wanted The Fire Control Budget To Defend Itself',
      cast: ['priya-nair', 'marty-bell', 'noah-reed'],
      lines: [
        {
          speakerId: 'priya-nair',
          text: 'If Marty wants a stronger fire suppression system for the web stack, I want the annual expected loss calculated first so we can justify the spend without theatrics.',
        },
        {
          speakerId: 'marty-bell',
          text: 'I can provide theatrics if required, but I assume math is preferred.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So this is the AV, EF, SLE, ARO, ALE chain, not just a heat map and a worried expression.',
        },
      ],
      conceptHook:
        'Risk analysis turns concern into prioritization. Quantitative analysis uses formulas like SLE and ALE to compare annual expected loss against control cost.',
    },
    callback: {
      title: 'The Annual Loss Was Manageable Because Of Frequency',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So full destruction of a fifty-thousand-dollar server with a one-in-ten-year fire rate yields an ALE of five thousand dollars.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The event is severe, but the low ARO keeps the annualized loss lower than the one-time damage.',
        },
      ],
      takeaway:
        'For ALE, calculate SLE first, then multiply by ARO. Low frequency can reduce annualized loss even when the one-time loss is large.',
    },
  },
  '5-2-risk-strategies': {
    coldOpen: {
      title: 'The Legacy System Could Not Meet The Rule',
      cast: ['ethan-cole', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'The vendor abandoned the legacy system, the required patch path no longer exists, and management still wants the process running under compensating controls.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So the company is not simply ignoring the risk. It is formally acknowledging that the required control cannot be satisfied.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The reason the rule is being bypassed matters here.',
        },
      ],
      conceptHook:
        'Risk strategy questions often hinge on subtle wording. Accept, avoid, transfer, mitigate, exemption, and exception are close enough to confuse people unless the constraint is explicit.',
    },
    callback: {
      title: 'The Constraint Made It An Exemption',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the organization cannot comply with the required control due to a hard constraint, management is accepting with exemption, not just making an internal exception.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Exemption is the right word when the requirement cannot realistically be met.',
        },
      ],
      takeaway:
        'If a required control cannot be followed because it is not feasible for the system or environment, the expected strategy is accept with exemption.',
    },
  },
  '5-2-business-impact-analysis': {
    coldOpen: {
      title: 'Six Hours Of Missing Orders Was Not A Recovery Success',
      cast: ['denise-park', 'noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'denise-park',
          text: 'The database came back online, but six hours of order data vanished, and finance is insisting that does not count as a clean recovery.',
        },
        {
          speakerId: 'noah-reed',
          text: 'So the uptime target may have been fine, but the acceptable data-loss target clearly was not.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Recovery time and recovery point are separate promises.',
        },
      ],
      conceptHook:
        'Business impact analysis separates how fast systems recover from how much data can be lost. RTO and RPO answer different questions and are easy to mix up under pressure.',
    },
    callback: {
      title: 'The System Returned, But The Point In Time Did Not',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So losing six hours against a two-hour allowance is an RPO failure, even if the database restarted quickly.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Data-loss tolerance is the point objective, not the time objective.',
        },
      ],
      takeaway:
        'If the issue is how much data was lost after recovery, the metric in question is RPO, not RTO.',
    },
  },
  '5-3-third-party-risk-assessment': {
    coldOpen: {
      title: 'The Signed Update Was The Trap Door',
      cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'A vendor shipped an update with a valid signature, and that trust let malware walk through every downstream customer that installed it.',
        },
        {
          speakerId: 'marty-bell',
          text: 'Which is a special kind of infuriating because the compromise arrived looking legitimate.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. This is why vendor risk is not just questionnaires and procurement paperwork.',
        },
      ],
      conceptHook:
        'Third-party risk exists because partners and suppliers can become your attack surface. Supply-chain compromise is the benchmark case because trust in the vendor becomes the delivery mechanism.',
    },
    callback: {
      title: 'Trust In The Vendor Became The Attack Path',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the defining feature is malware inserted upstream into a legitimate vendor update, which makes it a supply chain compromise.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The vendor relationship is the attack vector.',
        },
      ],
      takeaway:
        'If a trusted vendor distributes malicious code through a legitimate update, the risk category is supply chain compromise.',
    },
  },
  '5-3-agreement-types': {
    coldOpen: {
      title: 'They Agreed To Work Together, Just Not In Court Yet',
      cast: ['marty-bell', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'marty-bell',
          text: 'The prospective cloud vendor sent over a document saying both sides share security goals, plan to cooperate on migration, and will keep discussions confidential, but no signatures are required.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So it is coordination language, not a full binding contract with teeth.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The absence of signatures and enforceable obligations narrows this down quickly.',
        },
      ],
      conceptHook:
        'Agreement types matter because similar documents carry very different legal weight. The exam often distinguishes informal intent documents from signed, enforceable contracts.',
    },
    callback: {
      title: 'Intent Was Enough For The Scenario',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So shared goals plus optional confidentiality without required signatures points to an MOU, not an NDA or SLA.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Informal alignment is the hallmark there.',
        },
      ],
      takeaway:
        'If a document expresses shared intent and may mention confidentiality but does not require signatures or enforceable promises, the expected answer is MOU.',
    },
  },
  '5-4-compliance-and-privacy': {
    coldOpen: {
      title: 'The EU User Wanted Northwind To Forget Them Entirely',
      cast: ['rosa-jimenez', 'denise-park', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'A customer in the EU asked Northwind to delete their email address, browsing history, and related personal records from the website systems entirely.',
        },
        {
          speakerId: 'denise-park',
          text: 'So this is not just a customer service preference. It is a regulatory demand with a named right behind it.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Location of the user matters more than location of the company here.',
        },
      ],
      conceptHook:
        'Compliance and privacy questions usually test whether you can match a scenario to the governing regulation. GDPR is especially common because it applies beyond the EU when EU personal data is involved.',
    },
    callback: {
      title: 'The Geography Followed The User',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So because the user is in the EU and wants their personal data erased, the relevant rule is GDPR and its right to be forgotten.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. The company being US-based does not remove that obligation.',
        },
      ],
      takeaway:
        'If an EU resident requests deletion of personal data held by an organization, the expected governing regulation is GDPR.',
    },
  },
  '5-5-audits-and-penetration-tests': {
    coldOpen: {
      title: 'The Auditor Wanted To See What An Attacker Would See',
      cast: ['rosa-jimenez', 'ethan-cole', 'priya-nair'],
      lines: [
        {
          speakerId: 'rosa-jimenez',
          text: 'The new tester was given no network diagrams, no architecture notes, and no advance briefing beyond the company name.',
        },
        {
          speakerId: 'ethan-cole',
          text: 'So the engagement is trying to mimic an outsider starting cold, not a consultant handed the answers up front.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The amount of prior knowledge is one half of the question, and the reconnaissance style is the other.',
        },
      ],
      conceptHook:
        'Audit and penetration-test questions often combine engagement type with reconnaissance method. Blind tests plus passive recon are a common pairing the exam expects you to recognize quickly.',
    },
    callback: {
      title: 'Starting Cold Was The Point',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So no prior information means unknown environment, and public-source mapping without touching the target is passive reconnaissance.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Those two clues travel together a lot in exam wording.',
        },
      ],
      takeaway:
        'If a tester starts with no internal knowledge and gathers information only from public sources, the expected answer is unknown environment with passive reconnaissance.',
    },
  },
  '5-6-security-awareness': {
    coldOpen: {
      title: 'The Click Rate Was Finally Going The Right Way',
      cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
      lines: [
        {
          speakerId: 'glen-foster',
          text: 'The awareness dashboard shows simulated phishing clicks dropping from eighteen percent to nine percent after the last training cycle.',
        },
        {
          speakerId: 'rosa-jimenez',
          text: 'So for once the story is not about someone clicking the fake phish. It is about how the program proves it is improving behavior.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. The metric itself is the lesson.',
        },
      ],
      conceptHook:
        'Awareness programs live or die on measurable outcomes. Phishing simulations are common because they generate a concrete behavioral metric instead of a vague sense of improvement.',
    },
    callback: {
      title: 'The Program Needed A Number, Not A Feeling',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the tracked measure is the phishing simulation click rate, because it directly shows whether users are falling for the bait less often.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. If the percentage moves, the training outcome is visible.',
        },
      ],
      takeaway:
        'If a security awareness program is measuring how many users clicked a simulated phishing email, the metric is phishing simulation click rate.',
    },
  },
  '5-6-user-training': {
    coldOpen: {
      title: 'The USB Label Was The Bait',
      cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
      lines: [
        {
          speakerId: 'ethan-cole',
          text: 'Someone found a USB drive in the parking lot labeled Salary Information Q4, plugged it into a work laptop, and handed malware a front-door invitation.',
        },
        {
          speakerId: 'glen-foster',
          text: 'So the attacker did not need a phishing email at all. Curiosity plus removable media did the job.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Exactly. Physical bait is still social engineering if it manipulates user behavior.',
        },
      ],
      conceptHook:
        'User training is broader than email safety. Physical attack awareness, removable media discipline, and situational awareness all matter because attackers use whatever people will touch.',
    },
    callback: {
      title: 'The Right Training Topic Was The Physical One',
      cast: ['noah-reed', 'priya-nair'],
      lines: [
        {
          speakerId: 'noah-reed',
          text: 'So the preventive lesson is removable media and physical attack awareness, not password policy or abstract OPSEC.',
        },
        {
          speakerId: 'priya-nair',
          text: 'Right. Unknown USB devices are a never-plug-it-in problem.',
        },
      ],
      takeaway:
        'If a user plugs in a found USB drive and gets compromised, the relevant training topic is removable media and physical attack awareness.',
    },
  },
};

export const getLessonStory = (lessonId: Lesson['id']): LessonStory | undefined =>
  LESSON_STORIES_BY_ID[lessonId];
