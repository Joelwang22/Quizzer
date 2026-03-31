import type { Lesson } from './securityPlusLessons';
import type { StoryCastMember } from './storyCast';

type StoryCastId = StoryCastMember['id'];

export interface LessonCheckStoryLine {
  speakerId: StoryCastId;
  text: string;
}

export interface LessonCheckStory {
  title: string;
  cast: StoryCastId[];
  setupLines: LessonCheckStoryLine[];
  postRevealLine: LessonCheckStoryLine;
  questionOverride: string;
  answerOverride: string;
}

const LESSON_CHECK_STORIES_BY_ID: Partial<Record<Lesson['id'], LessonCheckStory>> = {
  '1-1-security-controls': {
    title: 'The Server Room Stopgap',
    cast: ['priya-nair', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'priya-nair',
        text: 'The vulnerable server-room badge controller cannot be patched until the vendor window on Friday, so I blocked its remote management port at the firewall for now.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So we are using a temporary safeguard while we wait for the proper fix.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Meaning the firewall rule is covering the gap because the preferred control is delayed.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Exactly. The patch is the real fix. The firewall block is the compensating control that keeps the gap from staying open.',
    },
    questionOverride:
      'Northwind cannot patch the vulnerable server-room badge controller immediately, so Priya blocks all remote traffic to its management port on the firewall until the vendor window opens. Which control type best describes this firewall rule?\n\n(A) Preventive\n(B) Corrective\n(C) Compensating\n(D) Directive',
    answerOverride:
      'C — Compensating. The firewall rule substitutes for the preferred control, which is patching the vulnerable badge controller. It provides interim protection until the real fix can be applied. (A) Preventive would be the patch itself or another direct technical safeguard. (B) Corrective restores operations after an incident. (D) Directive tells people what to do but does not enforce the restriction technically.',
  },
  '1-2-the-cia-triad': {
    title: 'Denise Locks Down Payroll Approvals',
    cast: ['denise-park', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'After this morning\'s payroll mess, I want every approval digitally signed so nobody can deny sending it later.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the spreadsheet tampering was an integrity problem, but denial of authorship is the accountability piece next to it.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Right. The signature is there so the sender cannot walk the action back afterward.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Digital signatures do more than protect the document. They bind the approval to the person who sent it.',
    },
    questionOverride:
      'After the payroll spreadsheet incident, Denise sends a digitally signed payroll approval at Northwind and later claims she never sent it. Which security property prevents her from successfully making that claim?\n\n(A) Confidentiality\n(B) Integrity\n(C) Availability\n(D) Non-repudiation',
    answerOverride:
      'D — Non-repudiation. A digital signature allows others to verify that the signed action came from Denise\'s private key, so she cannot credibly deny sending it. (A) Confidentiality protects against unauthorized disclosure, not denial. (B) Integrity shows the content was not altered but does not by itself address sender denial as specifically as non-repudiation. (C) Availability is unrelated.',
  },
  '1-2-non-repudiation': {
    title: 'Denise Sends The Corrected Guidance',
    cast: ['denise-park', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'I need to send the vendor corrected accounting guidance from the payment mess and prove the message really came from me.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Without encrypting the whole document itself?',
      },
      {
        speakerId: 'priya-nair',
        text: 'Right. You are proving authorship and integrity here, not confidentiality.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That is the signature pattern: hash the document, then sign the hash with the sender\'s private key.',
    },
    questionOverride:
      'Denise needs to send accounting guidance to a vendor and prove she authored it without encrypting the document itself. What should she do?\n\n(A) Encrypt the document with the vendor\'s public key\n(B) Hash the document and encrypt the hash with her private key, then send both\n(C) Hash the document and send the hash over a different channel\n(D) Encrypt the document with her own public key',
    answerOverride:
      'B — Hash the document and encrypt the hash with her private key, then send both. That creates a digital signature. The recipient decrypts the signature with Denise\'s public key to recover the hash, then hashes the received document independently. If the values match, the message integrity and sender authenticity are confirmed. (A) Encrypting with the vendor\'s public key provides confidentiality, not proof of authorship. (C) Sending a hash separately proves integrity at best, but not who created it. (D) Encrypting with Denise\'s public key would not authenticate her.',
  },
  '1-2-authentication-authorization-and-accounting': {
    title: 'Glen Tries Finance Again',
    cast: ['glen-foster', 'priya-nair', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'I logged in successfully, so I assumed the finance dashboard was included.',
      },
      {
        speakerId: 'priya-nair',
        text: 'That proves you are Glen. It does not prove finance wants to see you.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So logging in solved one problem, not all of them.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Authentication got Glen through the login screen. Authorization decided where he stopped.',
    },
    questionOverride:
      'Glen enters his username and password at Northwind, then the system checks whether he is allowed to access the finance file share. Which step of AAA is the system performing when it checks those file-share permissions?\n\n(A) Identification\n(B) Authentication\n(C) Authorization\n(D) Accounting',
    answerOverride:
      'C — Authorization. Glen has already identified himself and authenticated with his password. The system is now deciding what resources that authenticated identity may access. (A) Identification is the username claim itself. (B) Authentication is the password verification. (D) Accounting would record what happened after access is granted or denied.',
  },
  '1-2-gap-analysis': {
    title: 'The Contract Packet Rosa Found',
    cast: ['rosa-jimenez', 'marty-bell', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'One of the old binders had a draft Defense Department contract packet tucked inside it.',
      },
      {
        speakerId: 'marty-bell',
        text: 'Please tell me the packet did not also come with another DVD.',
      },
      {
        speakerId: 'noah-reed',
        text: 'If the deal involves Controlled Unclassified Information, the gap analysis has to target the exact CUI baseline.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Exactly. If the requirement is CUI in non-federal systems, NIST SP 800-171 is the target, not a generic audit goal.',
    },
    questionOverride:
      'Northwind finds a Department of Defense contract packet in its compliance materials and realizes it must demonstrate protection of Controlled Unclassified Information. Which framework should its gap analysis target?\n\n(A) ISO/IEC 27001\n(B) NIST SP 800-171\n(C) PCI DSS\n(D) SOC 2 Type II',
    answerOverride:
      'B — NIST SP 800-171. That publication specifically covers protection of Controlled Unclassified Information in non-federal systems, which is the exact requirement here. (A) ISO/IEC 27001 is a broad ISMS framework, not a CUI-specific control baseline. (C) PCI DSS applies to payment card environments. (D) SOC 2 Type II is an audit/reporting standard, not the required CUI protection framework.',
  },
  '1-2-zero-trust': {
    title: 'The VPN Still Does Not Trust Glen',
    cast: ['glen-foster', 'priya-nair', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The VPN challenged me again when I tried to open the finance app from home.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So after the request comes in, something still has to weigh your identity, device state, and risk.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. One component makes the decision. Another one enforces it.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'The Policy Engine makes the decision. The Policy Enforcement Point carries it out.',
    },
    questionOverride:
      'At Northwind, Glen requests access to a sensitive internal application in a Zero Trust workflow. Which component evaluates his request against policy and contextual risk signals to decide whether access should be granted or denied?\n\n(A) Policy Enforcement Point (PEP)\n(B) Policy Engine\n(C) Data plane\n(D) Security zone controller',
    answerOverride:
      'B — Policy Engine. The Policy Engine is the decision-making component within the Policy Decision Point. It evaluates identity, device state, location, and resource sensitivity to return a grant, deny, or revoke decision. (A) The PEP enforces the decision but does not make it. (C) The data plane carries traffic. (D) Security zones segment networks but do not evaluate per-request policy decisions.',
  },
  '1-2-physical-security': {
    title: 'Fix The Deliveries Door',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'If we replace that deliveries-only wedge with a real checkpoint, I want something that stops one badge tap from pulling two people through.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So not just a camera. Something that controls the actual movement through the doorway.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Detection is not enough here. The control has to physically interrupt the movement.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'A mantrap fixes the flow problem directly. Cameras and guards mostly catch it after the attempt has already happened.',
    },
    questionOverride:
      'After the side door was found propped open, Northwind wants a replacement entrance control that stops multiple people from entering the server room during a single badge-access event. Which physical control best addresses that risk?\n\n(A) CCTV with facial recognition\n(B) Security guard at a reception desk\n(C) Access control vestibule\n(D) Infrared motion sensors along the perimeter',
    answerOverride:
      'C — Access control vestibule. A mantrap uses interlocking doors to allow only one authorized person through at a time, directly preventing tailgating. (A) CCTV may detect the problem afterward but does not physically stop it. (B) A guard can help but depends on constant human attention. (D) Infrared sensors detect movement but do not control entry flow.',
  },
  '1-2-deception-and-disruption': {
    title: 'The Decoy Share',
    cast: ['priya-nair', 'noah-reed', 'glen-foster'],
    setupLines: [
      {
        speakerId: 'priya-nair',
        text: 'I hid fake API credentials in the decoy admin share on the fake server Glen keeps wanting to inspect.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So if anyone steals and uses them, we know they found a resource no legitimate user should touch.',
      },
      {
        speakerId: 'glen-foster',
        text: 'I would like it noted that curiosity is now apparently a monitored event.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'The fake server and share are bait, but the credentials themselves are the honeytoken that trips the alert.',
    },
    questionOverride:
      'Priya creates fake API credentials and leaves them in a decoy configuration file on a fake Northwind admin share. The credentials do not grant access, but they alert the team if anyone tries to use them. What type of deception technology is this?\n\n(A) Honeynet\n(B) Honeypot\n(C) Honeyfile\n(D) Honeytoken',
    answerOverride:
      'D — Honeytoken. The fake credentials are traceable decoy data that trigger an alert when used. They reveal that someone stole and attempted to use sensitive-looking information. (A) A honeynet is a network of decoy systems. (B) A honeypot is a decoy system or service. (C) A honeyfile is the bait file itself; the credentials inside it are the honeytoken.',
  },
  '1-3-change-management': {
    title: 'Before We Try That Again',
    cast: ['priya-nair', 'ethan-cole', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'priya-nair',
        text: 'Before anyone reruns the change that broke payroll and remote access, I want it tested somewhere that cannot touch production.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So if it detonates again, it only ruins a lab copy.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So this is about the environment, not the approval meeting or the maintenance window.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That is sandbox testing: prove the change safely before the CCB ever sees the approval request.',
    },
    questionOverride:
      'Before Northwind approves a critical database upgrade, Priya requires the change to be tested in an environment completely isolated from production systems. Which change-management component does this describe?\n\n(A) Maintenance window\n(B) Backout plan\n(C) Sandbox testing\n(D) Change Control Board review',
    answerOverride:
      'C — Sandbox testing. A sandbox is an isolated environment with no connection to production systems, allowing the team to validate the change safely before approval. (A) A maintenance window describes when the change happens, not where it is tested. (B) A backout plan explains how to reverse the change if it fails. (D) CCB review is the approval stage that usually comes after testing evidence is available.',
  },
  '1-3-technical-change-management': {
    title: 'Redo The Firewall Upgrade Properly',
    cast: ['priya-nair', 'ethan-cole', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'priya-nair',
        text: 'If we are going to redo Marty\'s firewall upgrade, the firmware has to land before the management software or we break the sequence again.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the second step is blocked until the first one succeeds cleanly.',
      },
      {
        speakerId: 'noah-reed',
        text: 'That is a dependency chain, not just a calendar issue.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Exactly. That is dependency management, and ignoring it is how upgrades strand systems halfway through.',
    },
    questionOverride:
      'Northwind must upgrade a core firewall. The upgrade guide states that the firewall management software can be updated only after the firmware update completes successfully. Which technical change-management concern does this illustrate?\n\n(A) Allow list enforcement\n(B) Maintenance window scheduling\n(C) Dependency management\n(D) Version control',
    answerOverride:
      'C — Dependency management. The management software depends on the firewall firmware being at the correct version first. Ignoring that dependency can break the upgrade sequence or leave the system in an inconsistent state. (A) Allow lists govern what software may run. (B) Maintenance windows define timing, not prerequisite order. (D) Version control tracks changes over time but does not determine operational sequencing.',
  },
};

export const getLessonCheckStory = (lessonId: Lesson['id']): LessonCheckStory | undefined =>
  LESSON_CHECK_STORIES_BY_ID[lessonId];
