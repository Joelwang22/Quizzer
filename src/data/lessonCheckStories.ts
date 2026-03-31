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
  '1-4-public-key-infrastructure': {
    title: 'Why The Portal Uses Both Kinds Of Encryption',
    cast: ['noah-reed', 'priya-nair', 'glen-foster'],
    setupLines: [
      {
        speakerId: 'noah-reed',
        text: 'The client uses the vendor portal certificate to protect a small secret first, then both sides switch to one shared session key.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So we are not doing public-key cryptography for the entire conversation.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Right. We use asymmetric encryption for secure setup and symmetric encryption for the heavy lifting.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That hybrid design is the practical answer: trust and exchange first, then efficient bulk encryption.',
    },
    questionOverride:
      'During a TLS handshake on Northwind\'s vendor portal, the client uses the server\'s public key to protect a randomly generated session key, then both sides use that shared session key for the rest of the connection. Why is this hybrid approach used instead of using asymmetric encryption for all data?\n\n(A) Asymmetric encryption cannot be used for data confidentiality\n(B) Asymmetric encryption is slower and less efficient than symmetric for bulk data transfer\n(C) Symmetric keys are more secure than asymmetric keys\n(D) TLS does not support asymmetric algorithms for data encryption',
    answerOverride:
      'B â€” Asymmetric encryption is slower and less efficient than symmetric for encrypting large amounts of data. Public-key algorithms are appropriate for protecting small secrets like session keys but impractical for a continuous stream of application traffic. Symmetric encryption is much faster. The hybrid approach uses each method for what it does best: asymmetric to establish the secret, symmetric to protect the data.',
  },
  '1-4-encrypting-data': {
    title: 'Protect Only The Sensitive HR Fields',
    cast: ['denise-park', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'HR only needs the Social Security number field locked down. Names and departments still need to stay fast for reporting.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So encrypting the entire server or the entire database is broader than the requirement.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The control has to match the scope of the data element we are protecting.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'This is a field-level problem, so the right answer lives at the column level.',
    },
    questionOverride:
      'Northwind wants to encrypt employee SSNs stored in its HR database while leaving other fields like employee name and department unencrypted for application performance. Which database encryption approach should it use?\n\n(A) Full-disk encryption on the database server\n(B) Transparent Data Encryption (TDE)\n(C) Column-level encryption\n(D) IPsec VPN between the application and database servers',
    answerOverride:
      'C â€” Column-level encryption. This approach encrypts individual columns, allowing the SSN field to be protected while other columns remain unencrypted for normal use. (A) Full-disk encryption protects the storage device, not individual database fields. (B) TDE encrypts the whole database, not selected columns. (D) IPsec VPN protects data in transit between systems, not the data stored inside the database.',
  },
  '1-4-key-exchange': {
    title: 'Captured Traffic Two Years Later',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'Assume someone saved years of our TLS traffic and only later stole the server private key.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Then the question is whether that long-term key can reopen old sessions.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. If the exchange used ephemeral keys correctly, those captured sessions stay closed.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Perfect forward secrecy protects the past by making each session depend on keys that no longer exist.',
    },
    questionOverride:
      'An attacker records a large volume of encrypted Northwind TLS traffic today. Two years later, they obtain the server\'s private key through a breach. Which property, if properly implemented, prevents them from decrypting those previously captured sessions?\n\n(A) Key stretching with bcrypt\n(B) Out-of-band key exchange\n(C) Perfect forward secrecy using ECDHE\n(D) Using 256-bit AES symmetric encryption',
    answerOverride:
      'C â€” Perfect forward secrecy using ECDHE. PFS uses ephemeral session keys generated for each session and then discarded. Even with the server\'s private key, the attacker cannot reconstruct the old session keys because those keys are not retained. (A) Key stretching is for password storage. (B) Out-of-band exchange does not retroactively protect traffic already captured. (D) AES-256 can still be compromised retroactively if the session key can be reconstructed.',
  },
  '1-4-encryption-technologies': {
    title: 'Protect The Root Signing Key Properly',
    cast: ['priya-nair', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'priya-nair',
        text: 'If Northwind stands up its own CA, the root signing key has to live in something built for high-value infrastructure secrets.',
      },
      {
        speakerId: 'marty-bell',
        text: 'Meaning not a normal workstation, and preferably not a drawer with a label on it.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the answer should be enterprise hardware meant for tamper-resistant key operations.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Exactly. Root keys belong in an HSM because the whole trust chain depends on them.',
    },
    questionOverride:
      'Northwind\'s internal Certificate Authority needs to protect its root signing key, the most critical key in the organization\'s PKI. Which technology is most appropriate?\n\n(A) TPM on the CA server\n(B) Hardware Security Module (HSM)\n(C) Software-based Key Management System\n(D) Secure Enclave on a workstation',
    answerOverride:
      'B â€” Hardware Security Module (HSM). HSMs are designed for enterprise-scale storage and use of high-value cryptographic keys. Root CA keys are among the most critical keys in an organization, and HSMs provide tamper-resistant protection, controlled cryptographic operations, and auditing. (A) A TPM is device-specific and not intended for CA signing infrastructure. (C) A software-only KMS lacks the same hardware tamper resistance. (D) A workstation secure enclave is not appropriate for CA root operations.',
  },
  '1-4-obfuscation': {
    title: 'The Safe Test Dataset',
    cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The developers got customer data that still looks realistic, but all the names and email addresses are fake.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So they can test the application without dragging real customer records into non-production.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The data remains useful, but the sensitive originals are gone.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That is data masking: preserve the shape, remove the exposure.',
    },
    questionOverride:
      'A Northwind development team needs realistic-looking data for testing a new application, but company policy prohibits using real customer records outside production. They receive a dataset where real names are replaced with fictional ones and real email addresses show as user1@example.com, user2@example.com, and so on. Which technique was applied?\n\n(A) Tokenization\n(B) Steganography\n(C) Data masking\n(D) Column-level encryption',
    answerOverride:
      'C â€” Data masking. Data masking replaces real values with fictional or obscured substitutes while preserving useful formats for testing and analysis. (A) Tokenization replaces data with mapped tokens and is used when the original may need to be retrieved through a vault. (B) Steganography hides messages inside other media. (D) Column-level encryption would make the data unreadable without the key, which is not the goal for realistic testing.',
  },
  '1-4-hashing-and-digital-signatures': {
    title: 'Make The Stolen Hashes Less Useful',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'If the attacker already has the password-hash database, they are going to compare it against precomputed password tables.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Unless every stored hash was made unique even before the same password got hashed.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Right. You want precomputed tables to stop being reusable shortcuts.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Unique salts break rainbow-table efficiency by forcing the attacker to solve each hash separately.',
    },
    questionOverride:
      'An attacker obtains a stolen Northwind credentials database and compares all password hashes against a precomputed table mapping millions of common passwords to their hashes. Which password storage practice would have defeated this specific attack?\n\n(A) Using SHA-256 instead of MD5\n(B) Salting each password hash with a unique random value\n(C) Using asymmetric encryption to store passwords\n(D) Encrypting the entire password database with AES-256',
    answerOverride:
      'B â€” Salting each password hash with a unique random value. Rainbow table attacks rely on precomputed password-to-hash mappings. A unique salt changes the hash output for each stored password, making those precomputed tables useless. (A) A stronger hash function alone does not defeat rainbow tables. (C) Asymmetric encryption is not how passwords are stored. (D) Full database encryption can protect the file at rest, but once an attacker has the hashes, unsalted values are still vulnerable.',
  },
  '1-4-blockchain-technology': {
    title: 'A Shipment Trail Nobody Can Quietly Rewrite',
    cast: ['denise-park', 'rosa-jimenez', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'If a supplier edits a shipment record after handoff, I want every party to detect that immediately.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So the value is not hiding the record. The value is making history tamper-evident.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Which is exactly why a shared ledger comes up in provenance questions.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Immutability is the point here. Once the record is confirmed, changing it without detection becomes the hard part.',
    },
    questionOverride:
      'Northwind uses blockchain-style provenance tracking for high-value shipments so records cannot be altered or falsified without everyone noticing. Which blockchain property makes this use case viable?\n\n(A) Confidentiality â€” records are encrypted and private\n(B) Immutability â€” confirmed records cannot be altered without detection across all nodes\n(C) Availability â€” the distributed network ensures continuous access\n(D) Anonymity â€” participants cannot be identified',
    answerOverride:
      'B â€” Immutability. The hash-chain structure makes historical changes detectable across the distributed ledger, which is what enables tamper-evident provenance tracking. (A) Blockchain is not primarily about confidentiality. (C) Availability is a side benefit, not the core property for this scenario. (D) Anonymity is not the value the question is testing.',
  },
  '1-4-certificates': {
    title: 'The Old Certificate Still Has To Die',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'We already issued a replacement certificate for the web server, but the compromised one is still technically valid until it expires.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So clients need a way to learn that the old certificate should no longer be trusted now.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Replacing it locally is not enough. The trust record itself has to change.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Revocation is the missing step. CRL and OCSP are how clients learn the old certificate is dead before expiration.',
    },
    questionOverride:
      'Northwind discovers that its web server private key was compromised. The company immediately obtains a new certificate. What must happen to the old certificate to ensure clients reject it before it naturally expires?\n\n(A) The old certificate\'s public key must be changed in place\n(B) The old certificate must be added to the CRL or marked revoked via OCSP\n(C) The CA must reissue the old certificate with a new serial number\n(D) The web server must be rebooted with only the new certificate installed',
    answerOverride:
      'B â€” The old certificate must be revoked by the CA, either through the CRL or OCSP. Revocation tells clients that the certificate should no longer be trusted even though its validity period has not expired. (A) Certificates are immutable once issued. (C) Reissuing creates a new certificate but does not invalidate the old one. (D) Rebooting the server with the new certificate does not inform clients that the old one is compromised.',
  },
  '2-1-threat-actors': {
    title: 'This Attacker Bought The Attack In Kit Form',
    cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The scans are using stock exploit kits, stock payload names, and stock everything else.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So not an innovator. More of a franchise operator.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Right. The lack of custom tooling is the clue here.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'This is the script-kiddie pattern: borrowed tooling, little customization, still worth taking seriously.',
    },
    questionOverride:
      'An attacker probing Northwind uses pre-built exploit kits downloaded from the internet with no custom tooling of their own. Which threat actor type best describes this person?\n\n(A) Nation-state actor\n(B) Hacktivist\n(C) Unskilled attacker\n(D) Organized crime',
    answerOverride:
      'C â€” Unskilled attacker. Script kiddies rely on pre-built tools, automated exploit kits, and work created by others rather than custom capabilities of their own. (A) Nation-state actors typically have advanced custom tooling. (B) Hacktivist describes motive, not the low-skill tooling pattern. (D) Organized crime is defined more by financial motive and capability than by dependence on stock tools alone.',
  },
  '2-2-common-threat-vectors': {
    title: 'The Parking Lot USBs',
    cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'Someone dropped branded USB drives outside the side entrance again.',
      },
      {
        speakerId: 'glen-foster',
        text: 'Again is doing upsetting work in that sentence.',
      },
      {
        speakerId: 'noah-reed',
        text: 'The trick is counting the delivery method, not just the payload. The attacker is trying to reach us through removable media.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Exactly. Baiting with USB drives is a removable-media vector, even before you know what malware is on the device.',
    },
    questionOverride:
      'An attacker leaves USB drives in Northwind\'s parking lot hoping employees will plug them in. Which threat vector does this represent?\n\n(A) Message-based vector\n(B) Supply chain vector\n(C) Removable media vector\n(D) Default credentials vector',
    answerOverride:
      'C â€” Removable media vector. Leaving malicious USB drives for employees to discover and use is a removable-media attack, often called baiting. (A) Message-based vectors use email or texts. (B) Supply chain vectors reach the target through vendors or software distribution. (D) Default credentials involve unchanged factory or vendor logins.',
  },
  '2-2-phishing': {
    title: 'The CEO Wants A Wire Transfer Right Now',
    cast: ['denise-park', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'The CEO account just asked finance to wire money to a brand-new vendor before end of day.',
      },
      {
        speakerId: 'noah-reed',
        text: 'And the email-authentication checks passed, so this is not going to look like a sloppy phish.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. When finance workflow and executive trust are the payload, think BEC first.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'This is why BEC is dangerous. The request often looks operationally normal even when it is malicious.',
    },
    questionOverride:
      'A Northwind finance employee receives an email appearing to come from the CEO requesting an urgent wire transfer to a new vendor. The email passes SPF/DKIM checks. What type of attack is most likely?\n\n(A) Smishing\n(B) Business Email Compromise (BEC)\n(C) Typosquatting\n(D) Vishing',
    answerOverride:
      'B â€” Business Email Compromise (BEC). BEC attacks target financial processes by impersonating or abusing trusted executive identities. Passing SPF/DKIM suggests the attacker may be using a legitimate or convincingly aligned email path, which is common in BEC. (A) Smishing uses SMS. (C) Typosquatting is about lookalike domains. (D) Vishing uses voice calls.',
  },
  '2-2-impersonation': {
    title: 'The Traveling Executive Call',
    cast: ['marty-bell', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'marty-bell',
        text: 'If someone calls sounding stressed and says they are locked out before a flight, the help desk is going to want to rescue them quickly.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Especially if they already know enough public personal detail to sound real.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Right. The phone call is one clue. The fabricated emergency is the other.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That pairing matters: vishing describes the channel, and pretexting describes the invented scenario doing the social engineering work.',
    },
    questionOverride:
      'An attacker calls Northwind\'s help desk claiming to be a travelling executive locked out of their account. They provide correct personal details from LinkedIn and pressure the agent to reset the password immediately. Which technique best describes this attack?\n\n(A) Vishing with pretexting\n(B) Smishing\n(C) SQL injection\n(D) Typosquatting',
    answerOverride:
      'A â€” Vishing with pretexting. The attacker is using a voice call plus a fabricated urgent scenario supported by OSINT-gathered details to pressure the help desk into a reset. (B) Smishing uses text messages. (C) SQL injection is a code-level input attack. (D) Typosquatting uses lookalike domains.',
  },
  '2-2-watering-hole-attacks': {
    title: 'The Finance Team Favorite Website',
    cast: ['ethan-cole', 'rosa-jimenez', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The malware alerts all trace back to the trade association site finance visits for industry updates.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So nobody had to be emailed. The site they already trusted did the delivery instead.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Which makes the website itself the ambush point.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'That is the watering-hole pattern: compromise the place the target already visits and wait for normal behavior to do the rest.',
    },
    questionOverride:
      'Security analysts discover that Northwind finance employees were infected with malware after visiting an industry trade association website. No phishing emails were involved. What type of attack best describes this scenario?\n\n(A) Spear phishing\n(B) Watering hole attack\n(C) SQL injection\n(D) Business email compromise',
    answerOverride:
      'B â€” Watering hole attack. A watering hole attack compromises a website the target group is known to visit and delivers malware passively when those users browse there. (A) Spear phishing requires a targeted message. (C) SQL injection is a database-input attack. (D) BEC involves impersonated financial email requests.',
  },
  '2-2-other-social-engineering': {
    title: 'Support-Micros0ft',
    cast: ['glen-foster', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The page looked exactly like Microsoft support until you noticed the domain used a zero instead of the letter o.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the attacker copied the brand identity and used a lookalike domain to catch fast readers.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The scam has two labels because it is using two different deception layers.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Brand impersonation explains the fake support page. Typosquatting explains the lookalike domain. The question wants both.',
    },
    questionOverride:
      'A threat actor registers the domain "support-micros0ft.com" and creates a replica of the Microsoft support page, tricking Northwind users into entering their credentials. Which two attack types best describe this?\n\n(A) Watering hole and vishing\n(B) Brand impersonation and typosquatting\n(C) SQL injection and BEC\n(D) Smishing and pretexting',
    answerOverride:
      'B â€” Brand impersonation and typosquatting. Creating a fake Microsoft support page is brand impersonation, and using a lookalike domain with a zero in place of the letter o is typosquatting. (A) Watering hole compromises a real third-party site and vishing uses phone calls. (C) SQL injection and BEC do not match the scenario. (D) Smishing uses SMS and pretexting does not capture the domain trick specifically.',
  },
  '2-3-memory-injections': {
    title: 'No New Process, Same Old SYSTEM Privileges',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The attacker did not launch a new SYSTEM process. They pushed code into one that was already running.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the malicious code got the privileges by hiding inside an existing trusted process.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Right. The CreateRemoteThread clue points straight at injection into another process address space.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That is DLL injection: insert code into a live process and inherit the context it already has.',
    },
    questionOverride:
      'An attacker uses `CreateRemoteThread` to load a malicious DLL into the address space of a SYSTEM-level process at Northwind, gaining SYSTEM privileges without creating a new process. Which technique does this describe?\n\n(A) Buffer overflow\n(B) SQL injection\n(C) DLL injection\n(D) Race condition',
    answerOverride:
      'C â€” DLL injection. DLL injection uses Windows APIs such as `CreateRemoteThread` to load malicious code into a running process and inherit that process\'s privileges. (A) Buffer overflow is a memory-corruption technique, not this injection pattern. (B) SQL injection targets database queries. (D) Race conditions exploit timing windows.',
  },
  '2-3-buffer-overflows': {
    title: 'Seven Hundred Bytes Into Five Hundred And Twelve',
    cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The developer copied 700 bytes of attacker input into a 512-byte buffer and then wondered why execution went elsewhere.',
      },
      {
        speakerId: 'marty-bell',
        text: 'I feel like the buffer communicated its boundaries very clearly.',
      },
      {
        speakerId: 'noah-reed',
        text: 'The deeper problem is that the programming model allowed the overwrite in the first place.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Exactly. The strongest language-level answer is to prevent unsafe writes structurally, not to rely on downstream controls.',
    },
    questionOverride:
      'A developer at Northwind writes code that copies user input into a fixed 512-byte buffer without checking the input length. An attacker sends 700 bytes, overwriting the return address. Which mitigation would have prevented this at the language level?\n\n(A) Implementing a firewall rule\n(B) Using a memory-safe programming language\n(C) Enabling HTTPS\n(D) Using multi-factor authentication',
    answerOverride:
      'B â€” Using a memory-safe programming language. Languages with automatic bounds checking prevent writes past allocated memory, removing the root cause of this overflow. (A) A firewall does not prevent in-process memory corruption. (C) HTTPS protects data in transit, not memory safety. (D) MFA is an authentication control and unrelated to buffer handling.',
  },
  '2-3-race-conditions': {
    title: 'Both Orders Went Through',
    cast: ['denise-park', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'The account only had enough money for one purchase, yet both purchases cleared.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the balance check passed twice before either purchase updated the shared state.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. That gap between check and use is where the attacker lives.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'This is the classic TOCTOU pattern: the system acts on a check result that stopped being true milliseconds ago.',
    },
    questionOverride:
      'An e-commerce site checks a user\'s account balance before processing a purchase. An attacker sends two simultaneous requests that both pass the balance check before either transaction deducts funds. Which vulnerability does this exploit?\n\n(A) SQL injection\n(B) Buffer overflow\n(C) Race condition / TOCTOU\n(D) Cross-site scripting',
    answerOverride:
      'C â€” Race condition / TOCTOU. Both requests pass the balance check before either request commits the state change, so the application acts on stale assumptions. (A) SQL injection manipulates database commands. (B) Buffer overflow corrupts memory. (D) Cross-site scripting injects script into rendered pages.',
  },
  '2-3-malicious-updates': {
    title: 'The Signed Update Was The Attack',
    cast: ['ethan-cole', 'rosa-jimenez', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The vendor signed the software correctly. The problem is that the build server had already been compromised before signing.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So the customer downloaded a legitimate package from an illegitimate pipeline.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Which means the trusted update process itself became the delivery vector.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'That is the supply-chain pattern. The malware arrives through the same trust path customers normally depend on.',
    },
    questionOverride:
      'Attackers compromise a software vendor\'s build server and insert a backdoor into the compiled product. The product is then signed with the vendor\'s legitimate certificate and distributed to Northwind. Which attack type does this represent?\n\n(A) SQL injection\n(B) Malicious update / supply chain attack\n(C) Buffer overflow\n(D) Watering hole attack',
    answerOverride:
      'B â€” Malicious update / supply chain attack. Compromising the build pipeline so malicious code is signed and distributed through the legitimate vendor channel is the defining pattern of a supply chain attack. (A) SQL injection targets database input. (C) Buffer overflow is a memory-corruption flaw. (D) Watering hole compromises a third-party website that targets visit.',
  },
  '2-3-os-vulnerabilities': {
    title: 'Internet-Facing RCE Means Move Now',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The patch is already two weeks old, the server is internet-facing, and the scanner says remote code execution.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So this is one of those cases where the word critical is doing actual work.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Yes. External reachability plus remote takeover capability is enough to justify emergency handling on its own.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'The patch-timing detail is background noise. RCE on a public host is the real reason the priority jumps.',
    },
    questionOverride:
      'A vulnerability scanner reports a critical RCE vulnerability in an internet-facing Northwind web server. The patch was released two weeks ago but has not been applied. Which factor most justifies treating this as an emergency patch?\n\n(A) The patch was released on Patch Tuesday\n(B) The vulnerability is classified as RCE and the system is internet-facing\n(C) The CVSS score is 5.0\n(D) The system is running Linux',
    answerOverride:
      'B â€” The vulnerability is classified as RCE and the system is internet-facing. Remote unauthenticated code execution on an externally reachable target is one of the highest-risk patching scenarios. (A) Patch Tuesday timing does not determine urgency. (C) A CVSS of 5.0 is moderate, not critical. (D) Linux versus Windows does not decide emergency status.',
  },
  '2-3-sql-injection': {
    title: 'The User Finished Writing The Query',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The application glued user input directly into the WHERE clause and then let the attacker turn the filter into logic.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the fix is not just blocking suspicious strings. The fix is preventing input from changing query structure at all.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. User data should arrive as data, never as executable SQL syntax.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Prepared statements solve the root problem because the database no longer treats the user input as part of the query language.',
    },
    questionOverride:
      'A Northwind developer builds a query by concatenating user input directly into `SELECT * FROM accounts WHERE id=[userInput]`. An attacker enters `1 OR 1=1--` to manipulate the query logic. What is the most effective fix?\n\n(A) Add a web application firewall\n(B) Use parameterized queries (prepared statements)\n(C) Switch from MySQL to PostgreSQL\n(D) Enable HTTPS on the connection',
    answerOverride:
      'B â€” Use parameterized queries (prepared statements). Parameterized queries separate SQL code from user data at the protocol level, preventing user input from altering query logic. (A) A WAF can help as a secondary control but does not fix the root cause. (C) Changing databases does not solve unsafe query construction. (D) HTTPS protects the transport, not the query structure.',
  },
  '2-3-cross-site-scripting': {
    title: 'The Comment Box Became The Delivery System',
    cast: ['glen-foster', 'ethan-cole', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'Someone posted a comment on the product page, and now every later visitor seems to hand over their session cookie.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the site stored the malicious JavaScript and keeps serving it back to everyone who loads the page.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Which makes this the persistent version, not the one that depends on sending a custom link each time.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Right. Stored XSS keeps firing because the application saved the attacker script as content.',
    },
    questionOverride:
      'An attacker posts a comment containing malicious JavaScript on a Northwind product review page. Every user who loads the page has their session cookie stolen. Which XSS type is this?\n\n(A) Reflected (non-persistent) XSS\n(B) Stored (persistent) XSS\n(C) SQL injection\n(D) CSRF',
    answerOverride:
      'B â€” Stored (persistent) XSS. The malicious script is saved by the application and then delivered to every later visitor of the page. (A) Reflected XSS requires a crafted request or link to bounce the payload immediately back to the victim. (C) SQL injection targets database queries, not browser script execution. (D) CSRF abuses authenticated requests but does not inject JavaScript into a page.',
  },
  '2-3-hardware-vulnerabilities': {
    title: 'The Unsupported Imaging Workstations',
    cast: ['rosa-jimenez', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The hospital still depends on Windows XP imaging workstations because the medical software vendor never modernized the platform.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So every newly discovered flaw after end of support just stays there permanently.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The main risk is not nostalgia. It is permanent unpatched exposure.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'EOSL turns future vulnerabilities into permanent attack surface because the patch stream is gone.',
    },
    questionOverride:
      'A hospital is still running medical imaging software on Windows XP workstations. The vendor reached EOSL in 2014. What is the PRIMARY security risk?\n\n(A) The hardware runs too slowly for modern attacks\n(B) New vulnerabilities will never be patched, creating permanent exposure\n(C) Windows XP cannot connect to networks\n(D) The systems require physical access to exploit',
    answerOverride:
      'B â€” New vulnerabilities will never be patched, creating permanent exposure. EOSL means the vendor no longer releases security fixes, so newly discovered weaknesses remain indefinitely. (A) System speed is not the main issue. (C) Windows XP can still connect to networks. (D) Many vulnerabilities can be exploited remotely and do not require physical access.',
  },
  '2-3-virtualization-vulnerabilities': {
    title: 'One Guest VM Reading Another',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The hypervisor bug lets one guest VM read memory belonging to adjacent guests on the same host.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the tenant-isolation boundary is leaking across workloads that should be blind to each other.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is about broken virtualization isolation, not ordinary application flaws.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Once a guest can reach across VM boundaries, you are in VM escape or resource-reuse territory.',
    },
    questionOverride:
      'A cloud provider\'s hypervisor has a vulnerability that allows a guest VM to read memory allocated to adjacent VMs. Which attack concept does this represent?\n\n(A) SQL injection\n(B) VM escape / resource reuse\n(C) Watering hole attack\n(D) Buffer overflow in user space',
    answerOverride:
      'B â€” VM escape / resource reuse. The issue is that virtualization isolation failed, allowing one tenant workload to access memory that should have remained isolated. (A) SQL injection targets databases. (C) Watering hole attacks compromise websites visited by targets. (D) A user-space buffer overflow does not inherently explain cross-VM access.',
  },
  '2-3-cloud-specific-vulnerabilities': {
    title: 'The Public Bucket Was Our Fault',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The storage bucket exposed customer data because the access policy allowed public reads.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the provider kept the storage service running securely, but we configured the permissions unsafely.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is a shared-responsibility question, and the misconfigured ACL points to the customer side.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Managed service does not mean managed permissions. Bucket policies are still the customer\'s job.',
    },
    questionOverride:
      'A company stores customer data in an S3 bucket that was misconfigured to allow public access. Which party failed their security responsibility under the shared responsibility model?\n\n(A) The cloud provider, because they manage S3\n(B) The customer, because S3 bucket ACLs and policies are customer-configured\n(C) Both parties equally\n(D) Neither party â€” public buckets are a feature',
    answerOverride:
      'B â€” The customer, because bucket ACLs, bucket policies, and public-access settings are customer-configured. The provider secures the infrastructure of the service, but the customer controls who may access their bucket contents. (A) The provider is not responsible for the customer\'s permission choices. (C) This is not equal blame. (D) Public access can be a feature, but enabling it unintentionally is still a customer misconfiguration.',
  },
  '2-3-supply-chain-vulnerabilities': {
    title: 'The HVAC Contractor Path',
    cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The attacker got in with credentials stolen from an HVAC contractor who still had broad remote access for billing support.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the weak point was the amount of trust the vendor account carried, not just the fact that a vendor existed.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. Third-party access should have been tightly scoped and isolated from the rest of the network.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'This is the least-privilege lesson for vendors: too much access turns a partner breach into your breach.',
    },
    questionOverride:
      'Attackers breach a retailer\'s network by stealing credentials from an HVAC contractor who had remote network access for billing purposes. Which supply chain vulnerability did the retailer fail to address?\n\n(A) Insecure cryptographic protocols\n(B) Excessive third-party vendor network access (lack of least privilege)\n(C) Missing web application firewall\n(D) Unpatched operating system',
    answerOverride:
      'B â€” Excessive third-party vendor network access. The failure was granting the HVAC contractor far more access than needed for their billing role. Least privilege for vendor accounts would have reduced the impact or blocked the breach path entirely. (A), (C), and (D) do not address the core third-party access-control failure described here.',
  },
  '2-3-misconfiguration-vulnerabilities': {
    title: 'Telnet And Factory Passwords',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The server is still listening on Telnet, and the vendor default login works the first time we try it.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the scenario is stacking two configuration mistakes: cleartext remote admin and credentials every attacker handbook already knows.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The exam wants both findings, not a vague answer about the server feeling insecure.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Telnet exposes credentials in transit, and default credentials expose the account before the session even starts.',
    },
    questionOverride:
      'A Northwind security review finds an internal server accepting Telnet connections on port 23 while still using the default vendor administrator credentials. What are the TWO misconfiguration vulnerabilities present?\n\n(A) Unencrypted protocol and default credentials\n(B) SQL injection and buffer overflow\n(C) VM escape and DLL injection\n(D) TOCTOU race condition and XSS',
    answerOverride:
      'A - Unencrypted protocol and default credentials. Telnet sends data, including credentials, in cleartext, and unchanged factory credentials are publicly known and easy to abuse. (B), (C), and (D) describe different vulnerability classes rather than configuration failures.',
  },
  '2-3-mobile-device-vulnerabilities': {
    title: 'The Jailbroken Phone Still Says Compliant',
    cast: ['glen-foster', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The employee jailbroke the company phone for third-party apps, but the dashboard still reports it as compliant.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the problem is not just sideloading. We may not be able to trust the device to report its state or enforce policy anymore.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Once the platform boundary is broken, MDM controls become advisory at best.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'That is the core risk: a jailbroken device can spoof compliance and quietly ignore the controls the enterprise thinks it set.',
    },
    questionOverride:
      'An employee jailbreaks a Northwind-issued smartphone so they can install apps outside the App Store. The MDM still reports the device as compliant. What is the PRIMARY security concern?\n\n(A) The device will run slower after jailbreaking\n(B) MDM compliance reporting may be spoofed and security policies are not reliably enforced on a jailbroken device\n(C) Third-party apps from outside the App Store are always malicious\n(D) The device cannot connect to corporate Wi-Fi after jailbreaking',
    answerOverride:
      'B - MDM compliance reporting may be spoofed and security policies are not reliably enforced on a jailbroken device. Breaking the OS trust boundary means encryption, VPN, app restrictions, and jailbreak detection can no longer be trusted fully. (A), (C), and (D) do not describe the primary enterprise risk in this scenario.',
  },
  '2-3-zero-day-vulnerabilities': {
    title: 'No CVE, No Patch, Still Under Attack',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The VPN vendor does not know about the flaw yet, but attackers are already exploiting it in production environments.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So there is no patch to deploy and no public identifier for defenders to anchor on yet.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is really asking when that exposure window ends.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The zero-day window closes only after discovery reaches the vendor and a patch or effective fix is released.',
    },
    questionOverride:
      'A nation-state attacker is exploiting an unknown vulnerability in a widely used Northwind VPN product. The vendor is unaware and no CVE exists yet. Which statement about this situation is TRUE?\n\n(A) The attack can be blocked by applying the latest vendor patches\n(B) Signature-based antivirus will detect exploitation using the CVE reference\n(C) The exploitation window lasts until the vendor discovers and patches the vulnerability\n(D) Zero-day attacks can only target operating systems, not VPN software',
    answerOverride:
      'C - The exploitation window lasts until the vendor discovers and patches the vulnerability. With a true zero-day, there is no patch yet, no CVE yet, and often no reliable signature to lean on. (A), (B), and (D) all contradict the defining conditions of a zero-day.',
  },
  '2-4-an-overview-of-malware': {
    title: 'This One Spreads By Itself',
    cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The infection moved from one workstation to another without anyone opening files, approving prompts, or reinstalling the payload.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So the defining clue is autonomous propagation across the network, not disguise or surveillance behavior.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. If it keeps spreading without user help, the malware family narrows fast.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Right. Autonomous network replication is the signature behavior that makes this a worm.',
    },
    questionOverride:
      'Which malware type self-replicates across a Northwind network without requiring any user interaction?\n\n(A) Virus\n(B) Trojan horse\n(C) Worm\n(D) Spyware',
    answerOverride:
      'C - Worm. A worm spreads on its own by exploiting reachable systems or services and does not need a user to execute the next copy. (A) viruses need user execution, (B) trojans rely on being installed or run, and (D) spyware monitors activity rather than self-replicating across the network.',
  },
  '2-4-viruses-and-worms': {
    title: 'The Macro Prompt Was The Trap',
    cast: ['glen-foster', 'ethan-cole', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The user opened the Word attachment, clicked Enable Macros, and the malware executed immediately afterward.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the document was not just bait. The macro engine inside the file was the delivery mechanism.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. The file type and the enable-macros prompt tell you the virus subtype directly.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Correct. When a document asks for macros and malware runs after approval, macro virus is the intended classification.',
    },
    questionOverride:
      'A Northwind employee opens an email attachment, a Word document, and enables macros when prompted. Their system is then infected with malware. Which virus type is this?\n\n(A) Boot sector virus\n(B) Program virus\n(C) Macro virus\n(D) Fileless virus',
    answerOverride:
      'C - Macro virus. Macro viruses are embedded in document automation code such as Word or Excel macros and execute when the user enables them. (A) targets the boot record, (B) attaches to executables, and (D) lives in memory without this document-macro trigger.',
  },
  '2-4-spyware-and-bloatware': {
    title: 'The Helpful App Was Watching Everything',
    cast: ['glen-foster', 'ethan-cole', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The free download manager did more than organize files. It quietly captured every keystroke and sent the data outside the company.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the suspicious behavior is surveillance and credential theft, not data encryption or self-replication.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. The installer was just the disguise. The behavior tells you the malware family.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Right. Keystroke capture plus exfiltration is classic spyware, specifically a keylogger.',
    },
    questionOverride:
      'A Northwind employee installs a free download manager. Antivirus later flags software that is capturing all keystrokes, including bank passwords, and sending them to an external server. Which malware type is this?\n\n(A) Ransomware\n(B) Worm\n(C) Spyware / keylogger\n(D) Boot sector virus',
    answerOverride:
      'C - Spyware / keylogger. Capturing keystrokes, including credentials, and transmitting them externally is the defining behavior of a keylogger, which is a category of spyware. (A) encrypts data, (B) self-replicates across networks, and (D) targets the boot record.',
  },
  '2-4-other-malware-types': {
    title: 'The Payroll Wipe Was Scheduled',
    cast: ['rosa-jimenez', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The fired admin planted code in payroll that sits quietly until the last day of the month, then deletes all salary records.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the attack depends on a trigger condition, not propagation or kernel-level concealment.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. Trigger-based sabotage is the clue the exam wants you to follow.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Correct. Dormant code waiting for a date trigger is a time bomb, which is a logic-bomb variant.',
    },
    questionOverride:
      'A recently fired Northwind IT administrator planted code in the payroll application that will delete all salary records on the last day of the month. Which malware type best describes this?\n\n(A) Worm\n(B) Rootkit\n(C) Logic bomb (time bomb)\n(D) Ransomware',
    answerOverride:
      'C - Logic bomb (time bomb). The malicious code remains dormant until a specific date triggers it. (A) worms self-replicate, (B) rootkits hide in the kernel, and (D) ransomware encrypts data and demands payment.',
  },
  '2-4-physical-attacks': {
    title: 'The Badge Copy In The Elevator',
    cast: ['glen-foster', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The attacker never stole the employee badge. They just read it wirelessly in the elevator and later walked in with a copy.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So this is not smashing a door or replaying network traffic. It is duplicating a physical access credential.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The method matters because the defense changes with it.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Wirelessly reading and duplicating a badge credential is RFID cloning.',
    },
    questionOverride:
      'An attacker uses a device to wirelessly read a Northwind employee\'s access badge in an elevator, then clones the credential onto a blank card to gain building access. Which type of attack is this?\n\n(A) Brute force\n(B) Replay attack\n(C) RFID cloning\n(D) Environmental attack',
    answerOverride:
      'C - RFID cloning. The attacker reads the badge wirelessly and duplicates it onto another card. (A) involves breaking barriers, (B) reuses captured network authentication data, and (D) targets power, HVAC, or other physical infrastructure.',
  },
  '2-4-denial-of-service': {
    title: 'Small Packets, Outsized Damage',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The attacker sent tiny spoofed NTP requests, but the victim got flooded by huge replies from thousands of other servers.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the heavy traffic came from reflection and amplification, not direct bandwidth from the attacker.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The protocol ratio and spoofed source are the tell.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. This is the classic DDoS reflection and amplification pattern.',
    },
    questionOverride:
      'An attacker sends small NTP requests spoofed with a Northwind victim\'s IP address to thousands of NTP servers. The servers respond with large packets directly to the victim, overwhelming their connection. Which attack technique is this?\n\n(A) Replay attack\n(B) DDoS amplification / reflection\n(C) DNS poisoning\n(D) On-path attack',
    answerOverride:
      'B - DDoS amplification / reflection. The attacker spoofs the victim IP and abuses a high-response protocol so third-party servers reflect much larger traffic at the target. (A), (C), and (D) describe different attack categories.',
  },
  '2-4-dns-attacks': {
    title: 'The Real Domain Led To The Fake Site',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'Customers typed the actual company URL, but the registrar entry had been changed and the real domain now resolved to a clone.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the attacker did not poison a local cache or register a lookalike. They took control of the authoritative registration.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is about where DNS control was compromised.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Changing the legitimate domain at the registrar level is domain hijacking.',
    },
    questionOverride:
      'An attacker successfully modifies the DNS registration for a Northwind company domain at the registrar level, pointing the domain to a cloned website. Customers who visit the company URL are directed to the fraudulent site. Which attack is this?\n\n(A) DNS poisoning / cache poisoning\n(B) Domain hijacking\n(C) Typosquatting\n(D) URL injection',
    answerOverride:
      'B - Domain hijacking. The authoritative registrar records for the legitimate domain were changed. (A) targets resolver caches, (C) uses lookalike domains rather than the real one, and (D) is not the intended classification here.',
  },
  '2-4-wireless-attacks': {
    title: 'The Access Point Never Sent Those Disconnects',
    cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'Clients keep receiving fake deauthentication frames and dropping off the corporate Wi-Fi over and over.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So the attacker is forging management traffic, not breaking the passphrase first.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. The answer is the wireless standard that protects those frames.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Correct. 802.11w adds management frame protection for deauthentication and similar control traffic.',
    },
    questionOverride:
      'An attacker sends forged deauthentication frames to clients connected to a Northwind corporate Wi-Fi network, repeatedly disconnecting them. Which standard was designed specifically to address this vulnerability?\n\n(A) 802.11a\n(B) 802.11n\n(C) 802.11w\n(D) 802.11b',
    answerOverride:
      'C - 802.11w. Management Frame Protection encrypts important management frames such as deauthentication and disassociation. (A), (B), and (D) are wireless throughput or PHY standards, not the management-frame protection fix.',
  },
  '2-4-on-path-attacks': {
    title: 'The Gateway Mapping Was Poisoned',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'Clients on the subnet now believe the attacker machine owns the default gateway IP address.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So forged ARP replies are rewriting local trust, which means the defense has to live at the switch.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is a local-layer validation problem, not a DNS or TLS problem.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Dynamic ARP Inspection is the switch control that rejects poisoned ARP mappings.',
    },
    questionOverride:
      'An attacker on a Northwind local network broadcasts fake ARP replies claiming to own the default gateway\'s IP address. Client traffic is now routed through the attacker\'s machine. What is the primary technical defense at the switch level?\n\n(A) DNSSEC\n(B) 802.11w\n(C) Dynamic ARP Inspection (DAI)\n(D) TLS certificate pinning',
    answerOverride:
      'C - Dynamic ARP Inspection (DAI). DAI validates ARP traffic against trusted DHCP snooping bindings and blocks forged mappings. (A), (B), and (D) protect different layers and do not stop ARP poisoning itself.',
  },
  '2-4-replay-attacks': {
    title: 'The Hash Was Enough To Log In',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The researcher captured an NTLM hash from traffic, never cracked it, and still authenticated to the file server as the victim.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So this is not guessing the password. The captured hash itself became the credential.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. That reuse pattern points to one replay technique in particular.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Reusing the NTLM hash directly is pass-the-hash.',
    },
    questionOverride:
      'A security researcher captures NTLM authentication hashes from Northwind network traffic using a tool. They then use the captured hash, without cracking it, to access a file server as the victim user. Which attack technique is this?\n\n(A) SQL injection\n(B) Session hijacking\n(C) Pass-the-hash\n(D) Brute force',
    answerOverride:
      'C - Pass-the-hash. The captured NTLM hash is used directly for authentication without recovering the plaintext password. (B) reuses web-session tokens, while (A) and (D) are unrelated to NTLM hash replay.',
  },
  '2-4-application-attacks': {
    title: 'The Browser Signed Off On A Transfer The User Never Meant To Send',
    cast: ['glen-foster', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The victim visited a malicious page while still logged into the bank, and a hidden form submitted a transfer using the live session cookie.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the server saw an authenticated browser and assumed the action was intentional.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The identity was valid, but the request was forged.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. CSRF is about abusing the server\'s trust in an already authenticated browser session.',
    },
    questionOverride:
      'A Northwind user logged into their bank visits a malicious website. The page contains a hidden form that silently submits a funds transfer request to the bank. The bank processes it because the user\'s session cookie was automatically included. Which attack is this?\n\n(A) SQL injection\n(B) XSS\n(C) CSRF\n(D) Directory traversal',
    answerOverride:
      'C - CSRF. Cross-site request forgery causes an authenticated browser to send an unintended state-changing request that the server trusts because the session cookie is valid. (A), (B), and (D) target different application weaknesses.',
  },
  '2-4-cryptographic-attacks': {
    title: 'Secure To The Server, Plain To The Victim',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The attacker intercepted the first HTTP request, kept HTTPS on the server side, and fed plain HTTP back to the victim browser.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the browser never got a clean upgrade path. The attacker stripped the protection before it fully started.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is not just being on path. It is a specific downgrade of the connection behavior.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Intercepting the initial redirect and holding the client on HTTP is SSL stripping.',
    },
    questionOverride:
      'An on-path attacker intercepts the initial HTTP request before a Northwind client is redirected to HTTPS, then maintains separate HTTP (to client) and HTTPS (to server) connections. The client\'s browser shows no security warning. Which attack is this?\n\n(A) Birthday attack\n(B) Downgrade attack\n(C) SSL stripping\n(D) ARP poisoning',
    answerOverride:
      'C - SSL stripping. The attacker prevents the browser from ever reaching the secure HTTPS session directly by intercepting the initial unprotected request. (A) targets hash collisions, (B) is broader protocol-version fallback, and (D) is only one way to gain on-path position.',
  },
  '2-4-password-attacks': {
    title: 'One Password Across The Directory',
    cast: ['ethan-cole', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The attacker tried the same common password against every Active Directory account and never triggered a lockout.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So they were not battering one account. They were staying below the lockout threshold by spreading the guesses around.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. The shape of the guessing pattern is the whole clue here.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Right. One or two common passwords across many users is password spraying.',
    },
    questionOverride:
      'An attacker tries "Summer2024!" against every user account in Northwind Active Directory. Account lockout is set at 5 attempts. No accounts are locked. Which attack technique is this?\n\n(A) Brute force\n(B) Rainbow table attack\n(C) Password spraying\n(D) Pass-the-hash',
    answerOverride:
      'C - Password spraying. The attacker tries a small number of common passwords across many accounts so no single user hits the lockout threshold. (A) would hammer one account with many guesses, (B) requires a stolen hash set, and (D) reuses captured hashes rather than guessing passwords.',
  },
  '2-4-indicators-of-compromise': {
    title: 'Two Cities, One User, One Problem',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The SIEM shows the same user actively logged in from Chicago and Singapore at the same time.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the signal is not bandwidth or deleted logs. It is an authentication pattern that a real person cannot physically produce.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Geography plus simultaneous sessions is the clue.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. This is an impossible-travel or concurrent-session indicator of compromise.',
    },
    questionOverride:
      'A Northwind SIEM alert fires because the same user account has active authenticated sessions from Chicago and Singapore at the same time. Which IoC category does this represent?\n\n(A) Resource consumption\n(B) Impossible travel / concurrent sessions\n(C) Missing logs\n(D) Out-of-cycle logging',
    answerOverride:
      'B - Impossible travel / concurrent sessions. One user cannot realistically maintain authenticated sessions from those two distant locations at the same time. (A), (C), and (D) describe different kinds of indicators.',
  },
  '2-5-segmentation-and-access-control': {
    title: 'The Malware Could Not Cross The VLAN Boundary',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The workstation is compromised, but every attempt to reach the database server dies at the firewall between the user VLAN and the database VLAN.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the compromise happened, but the attacker could not move sideways into the sensitive zone.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is about the control that kept the blast radius small.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Segmentation with ACLs contained the breach by blocking inter-zone traffic.',
    },
    questionOverride:
      'After a Northwind workstation is compromised by malware, the attacker finds they cannot reach the database server because all traffic between the user VLAN and the database VLAN is blocked by a firewall ACL. Which security control limited the blast radius?\n\n(A) Application allow listing\n(B) Full disk encryption\n(C) Network segmentation with ACLs\n(D) Multi-factor authentication',
    answerOverride:
      'C - Network segmentation with ACLs. The attacker was contained because traffic between zones had to cross an enforced firewall boundary. (A), (B), and (D) are valuable controls, but they do not explain why lateral movement into the database VLAN was blocked.',
  },
  '2-5-mitigation-techniques': {
    title: 'The Logs Had To Be Read Together',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'One successful login came from the user home country, then another came from a new country almost immediately after.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So no single sensor tells the whole story. Something has to correlate events across time and sources.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The tool matters because the pattern only exists when the logs are combined.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. SIEM correlation is what turns separate login events into one impossible-travel detection.',
    },
    questionOverride:
      'A Northwind security team wants to detect when a user authenticates successfully from a new country immediately after a login from their home country, a pattern no single log source would reveal alone. Which tool is best suited for this?\n\n(A) Host-based firewall\n(B) Full disk encryption\n(C) SIEM with correlation engine\n(D) Application allow list',
    answerOverride:
      'C - SIEM with correlation engine. SIEM platforms aggregate and correlate events across multiple systems and time windows so patterns like impossible travel become visible. (A), (B), and (D) are different controls and do not perform cross-source event correlation.',
  },
  '2-5-hardening-techniques': {
    title: 'The Laptop Failed The Health Check',
    cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The contractor laptop connected to the network, failed the patch and EDR checks, and was dropped into a restricted segment immediately.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the environment tested trust at connection time instead of discovering the problem after the device was already inside.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is a posture gate, not just a static permit or deny rule.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Evaluating device compliance on connect and quarantining failures is configuration enforcement or posture assessment.',
    },
    questionOverride:
      'A contractor connects a personal laptop to the Northwind corporate network. The NAC system detects that the laptop is missing the latest OS security patches and is running an outdated EDR version. The laptop is placed in a restricted network with no access to internal resources. Which security concept does this implement?\n\n(A) Application allow listing\n(B) Configuration enforcement / posture assessment\n(C) Full disk encryption\n(D) Network ACL only',
    answerOverride:
      'B - Configuration enforcement / posture assessment. NAC is checking device health at connection time and quarantining a non-compliant endpoint until it meets policy. (A), (C), and (D) do not describe that active compliance evaluation workflow.',
  },
  '2-5-endpoint-hardening': {
    title: 'Word Should Not Have Spawned That',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The malware had no signature, but the agent saw Word launch PowerShell and then open outbound connections, so it isolated the endpoint.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the control responded to suspicious behavior in the process chain, not to a known hash.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. That is the EDR value proposition in practice.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Behavioral detection plus automated isolation is the EDR capability being tested.',
    },
    questionOverride:
      'A novel malware variant with no known signature infects a Northwind endpoint. The EDR agent detects unusual process behavior, a Word process spawning a PowerShell child process that makes outbound network connections. The EDR automatically isolates the endpoint. Which EDR capability is demonstrated?\n\n(A) Signature-based detection\n(B) Behavioral detection and automated response\n(C) HIPS registry monitoring\n(D) Host-based firewall rule enforcement',
    answerOverride:
      'B - Behavioral detection and automated response. The malware was unknown by signature, but the suspicious behavior chain triggered automatic isolation. (A) depends on known signatures, while (C) and (D) describe narrower host controls rather than the full EDR workflow shown here.',
  },
  '3-1-cloud-infrastructures': {
    title: 'The Provider Owns The Platform Layer',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The cloud provider runs the database engine, operating system, and hardware. Northwind only manages the data and who can access it.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So we are above raw infrastructure, but we are not using a finished end-user software product either.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The responsibility split puts this in the middle service model.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. When the provider manages the platform stack and the customer manages data and access, the model is PaaS.',
    },
    questionOverride:
      'A company uses a cloud provider\'s database service where the provider manages the database engine, OS, and physical hardware. The company only manages the data and access controls. Which cloud model is this?\n\n(A) IaaS\n(B) PaaS\n(C) SaaS\n(D) On-premises',
    answerOverride:
      'B - PaaS. The provider manages the platform components, including the database engine and operating system, while the customer manages their data and access. (A) would leave OS management to the customer, (C) is a complete application service, and (D) is not cloud-managed at all.',
  },
  '3-1-cloud-architecture': {
    title: 'The Payment Breach Stayed In Payment',
    cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The payment component was breached, but inventory kept running because each service had its own API boundary and database.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So the application was split intentionally so one compromised area would not drag down the rest.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. The architecture name is hiding in the service boundaries.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Correct. Independent services with separate databases and API communication describe microservices.',
    },
    questionOverride:
      'A Northwind development team deploys their application as multiple independently scalable services that communicate over APIs, each with its own database. A breach of the payment service does not affect the inventory service. Which architecture does this describe?\n\n(A) Monolithic architecture\n(B) Serverless / FaaS\n(C) Microservices architecture\n(D) Traditional virtualization',
    answerOverride:
      'C - Microservices architecture. The application is decomposed into independent services that communicate over APIs and contain their own data. (A) would be one large shared application, (B) refers to event-driven functions, and (D) refers to how workloads run rather than how the app is decomposed.',
  },
  '3-1-network-infrastructure': {
    title: 'The VLANs Needed A Gate Between Them',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'Finance and Guest are on separate VLANs on the same switch, but the engineer needs controlled communication between them when necessary.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So Layer 2 segmentation already exists. The missing piece is where inter-VLAN traffic gets routed and inspected.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The answer is the device that becomes the crossing point.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Inter-VLAN communication requires a Layer 3 device such as a router or firewall.',
    },
    questionOverride:
      'A Northwind network engineer wants to prevent devices in the Finance VLAN from communicating directly with devices in the Guest VLAN on the same physical switch. What must exist to allow controlled communication between them if needed?\n\n(A) A second physical switch\n(B) A Layer 3 device (router or firewall) between the VLANs\n(C) A second NIC in each device\n(D) SDN management plane access',
    answerOverride:
      'B - A Layer 3 device (router or firewall) between the VLANs. VLANs isolate traffic at Layer 2, so any controlled communication between them must cross a routing or firewall boundary. (A), (C), and (D) do not provide that inter-VLAN decision point.',
  },
  '3-1-specialized-infrastructure': {
    title: 'The Office Infection Reached Operations',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The utility connected the SCADA control network to corporate IT for convenience, and malware from an office workstation later disrupted power distribution.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the root failure is not just that malware existed. It is that IT and OT had a path between them that should have been far tighter.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. In specialized infrastructure, the boundary itself is often the most important control.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. SCADA and OT environments need strong segmentation or air-gapping from corporate IT to prevent exactly this crossover.',
    },
    questionOverride:
      'A power utility connects its SCADA control network to the Northwind corporate IT network to simplify monitoring. A malware infection on a corporate workstation later propagates to the SCADA network, disrupting power distribution. What was the primary security failure?\n\n(A) Lack of host-based firewall on SCADA systems\n(B) Insufficient segmentation / air-gap between IT and OT networks\n(C) Missing OS patches on SCADA systems\n(D) Weak passwords on SCADA accounts',
    answerOverride:
      'B - Insufficient segmentation / air-gap between IT and OT networks. The main failure was allowing a direct enough path from corporate IT into operational technology. (A), (C), and (D) can matter, but they do not explain why the office malware could cross into SCADA in the first place.',
  },
  '3-1-infrastructure-considerations': {
    title: 'The Policy Paid, It Did Not Prevent',
    cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'Northwind bought cyber liability insurance to cover ransomware losses and business interruption, but it did not reduce a single technical exposure.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the organization changed who pays when the incident lands, not whether the incident is likely to happen.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is about the risk-treatment category, not the insurance product itself.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Financial consequences moved to a third party, which makes this risk transference.',
    },
    questionOverride:
      'A company buys cyber liability insurance to cover potential ransomware payouts and business interruption costs. Which risk management strategy does this represent?\n\n(A) Risk avoidance\n(B) Risk mitigation\n(C) Risk acceptance\n(D) Risk transference',
    answerOverride:
      'D - Risk transference. Insurance shifts the financial impact of the risk to a third party without reducing the chance of the attack itself. (A), (B), and (C) describe different treatments.',
  },
  '3-2-secure-infrastructures': {
    title: 'The Public Servers Needed A Buffer Zone',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The web servers must stay reachable from the internet, but nobody wants a compromise there to land directly inside the internal network.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So they need a zone that accepts public traffic while still being firewalled away from the trusted environment.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The name of that zone is the answer.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Internet-facing servers in a screened subnet belong in a DMZ.',
    },
    questionOverride:
      'A company places public-facing web servers in a network zone that is accessible from the internet but separated from the internal corporate network by a firewall. What is this network zone called?\n\n(A) Trusted zone\n(B) Management plane\n(C) DMZ (screened subnet)\n(D) VLAN trunk',
    answerOverride:
      'C - DMZ (screened subnet). A DMZ hosts public-facing services while remaining separated from the trusted internal network to limit blast radius. (A), (B), and (D) do not describe that placement pattern.',
  },
  '3-2-intrusion-prevention': {
    title: 'The SPAN Port Sensor Could Only Watch',
    cast: ['ethan-cole', 'glen-foster', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The monitoring device receives a mirrored copy of traffic from a SPAN port and raises alerts, but it has no way to stop packets in flight.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So it is off to the side, not inline. That means visibility without enforcement.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Exactly. Passive copy plus alerting narrows the answer fast.',
      },
    ],
    postRevealLine: {
      speakerId: 'noah-reed',
      text: 'Right. A passive device on mirrored traffic that cannot block is an IDS.',
    },
    questionOverride:
      'A security team deploys a network monitoring device that receives a copy of all traffic via a SPAN port and generates alerts when attack patterns are found, but cannot block any traffic. Which device is this?\n\n(A) IPS (Intrusion Prevention System)\n(B) Next-generation firewall\n(C) IDS (Intrusion Detection System)\n(D) WAF (Web Application Firewall)',
    answerOverride:
      'C - IDS (Intrusion Detection System). IDS platforms passively monitor copied traffic and alert on suspicious patterns. (A), (B), and (D) are inline or blocking controls rather than passive SPAN-port monitors.',
  },
  '3-2-network-appliances': {
    title: 'Every Web Request Passed Through The Filter',
    cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The appliance inspects all employee web traffic, blocks gambling and social media, scans for malware, and caches common pages.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So it is controlling outbound user browsing, not balancing servers or protecting inbound applications.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The direction of the traffic is the giveaway.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Outbound browsing inspection and filtering point to a forward proxy or secure web gateway.',
    },
    questionOverride:
      'An organization deploys a device that intercepts all employee web requests, scans them for malicious content, blocks access to gambling and social media sites, and caches common content for performance. What type of device is this?\n\n(A) Reverse proxy\n(B) Load balancer\n(C) Forward proxy / secure web gateway\n(D) IDS sensor',
    answerOverride:
      'C - Forward proxy / secure web gateway. It mediates outbound user web traffic for filtering, inspection, and caching. (A) handles inbound server traffic, (B) distributes requests to servers, and (D) only observes traffic.',
  },
  '3-2-firewall-types': {
    title: 'HTTPS Was Not Detailed Enough',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'Northwind wants to block Dropbox and Google Drive on every port, even when they ride over normal HTTPS on 443.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So a simple port rule cannot help. The firewall has to identify the application inside the allowed encrypted channel.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This question is here to separate Layer 4 filtering from Layer 7 control.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Application-aware blocking on port 443 is a next-generation firewall job.',
    },
    questionOverride:
      'An organization wants to block employees from using cloud storage applications (Dropbox, Google Drive) on any port, including HTTPS port 443, while allowing other HTTPS traffic. Which firewall type can accomplish this?\n\n(A) Traditional stateful firewall\n(B) Next-generation firewall (NGFW)\n(C) Web application firewall (WAF)\n(D) UTM at the DMZ',
    answerOverride:
      'B - Next-generation firewall (NGFW). NGFWs inspect traffic at the application layer and can identify specific services regardless of port. (A) cannot distinguish apps sharing 443, (C) protects web apps, and (D) is not the concept being tested here.',
  },
  '3-2-port-security-802-1x': {
    title: 'The Port Allowed Only EAP At First',
    cast: ['glen-foster', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The visitor laptop plugged into the conference-room port, but the switch held all normal traffic until authentication succeeded.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the port was in an unauthorized state and only EAP messages were allowed through.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The control is pre-access network admission, not simple segmentation.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Holding non-EAP traffic until successful authentication is 802.1X port-based NAC.',
    },
    questionOverride:
      'A visitor plugs into a conference room network port. The switch holds all traffic except EAP authentication messages until the visitor\'s laptop authenticates. Which technology is controlling this access?\n\n(A) MAC address filtering\n(B) 802.11w\n(C) 802.1X port-based NAC\n(D) VLAN tagging',
    answerOverride:
      'C - 802.1X port-based NAC. The switch is enforcing authentication before granting normal network access. (A), (B), and (D) do not describe EAP-only traffic before authorization.',
  },
  '3-2-secure-communication': {
    title: 'The Home Tunnel Rode Over 443',
    cast: ['rosa-jimenez', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'Remote employees use a VPN client over port 443 from home, and the setup does not look like a site-to-site tunnel with shared secrets.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So this is built for user remote access through TLS-friendly paths, not a network-to-network IPsec design.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The port and use case tell you which VPN family this is.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Remote-user VPN over port 443 points to SSL/TLS VPN.',
    },
    questionOverride:
      'Remote employees access company resources from home using a VPN client on port 443. The VPN does not require digital certificates or shared secrets. Which VPN type is this?\n\n(A) Site-to-site IPsec VPN\n(B) SSL/TLS VPN\n(C) SD-WAN\n(D) SASE',
    answerOverride:
      'B - SSL/TLS VPN. The scenario describes a remote-user VPN operating over TCP 443 rather than a site-to-site IPsec tunnel. (C) and (D) are broader networking architectures rather than this specific client VPN type.',
  },
  '3-3-data-types-and-classifications': {
    title: 'The Patient Records Needed The Healthcare Label',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The hospital database contains patient names, diagnoses, treatment dates, and insurance payment records.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the data is identifiable, but the question wants the healthcare-specific classification, not just a generic privacy label.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. In the United States, that regulatory category is explicit.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Patient health records tied to an individual are PHI under HIPAA.',
    },
    questionOverride:
      'A hospital\'s database contains patient names, diagnoses, treatment dates, and insurance payment records. Which data classification specifically governs this type of information in the United States?\n\n(A) PCI DSS data\n(B) Trade secret\n(C) PHI (Protected Health Information) under HIPAA\n(D) Public / Unclassified data',
    answerOverride:
      'C - PHI (Protected Health Information) under HIPAA. The data describes identifiable patients and their healthcare and payment records. (A), (B), and (D) do not fit that regulated healthcare context.',
  },
  '3-3-states-of-data': {
    title: 'The Card Number Was Caught In Memory',
    cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The point-of-sale terminal kept the card safe on disk and on the network, but malware read it from RAM while the sale was processing.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So the attack waited for the moment the system had to decrypt the value to use it.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is the data state that is hardest to protect.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Reading sensitive values from RAM during processing is an attack on data in use.',
    },
    questionOverride:
      'Malware installed on a point-of-sale terminal reads credit card numbers from system RAM as transactions are processed. The card data is encrypted in the database and over the network. Which data state is being attacked?\n\n(A) Data at rest\n(B) Data in transit\n(C) Data in use\n(D) Data in backup',
    answerOverride:
      'C - Data in use. The card data is being attacked while actively processed in memory, not while stored or transmitted. (A), (B), and (D) describe different states.',
  },
  '3-3-protecting-data': {
    title: 'The Database Only Kept Stand-Ins',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The payment database stores surrogate values instead of real card numbers, and a breach would not let an attacker derive the actual numbers from what was stolen.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So this is not just hiding digits or encrypting them with a reversible key. The stored value is intentionally unrelated.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The separate vault is the clue the exam expects you to notice.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Replacing the sensitive value with an unrelated stand-in is tokenization.',
    },
    questionOverride:
      'A payment processor stores a surrogate value instead of actual credit card numbers in its database. Even if the database is breached, the attacker obtains values that cannot be reversed to obtain real card numbers. Which data protection technique is this?\n\n(A) Data masking\n(B) Obfuscation\n(C) Tokenization\n(D) Field-level encryption',
    answerOverride:
      'C - Tokenization. The database keeps a non-reversible stand-in while the real value lives in a separate secure token vault. (A), (B), and (D) do not match that model.',
  },
  '3-4-resiliency': {
    title: 'Both Nodes Were Already Working',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The load balancer was already sending traffic to two identical web servers before anything failed.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So when one server died, the other did not wake up from standby. It simply kept serving everything.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The fact that both nodes were active before failure is the clue.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. When all nodes serve live traffic and one fails without interruption, that is active/active load balancing.',
    },
    questionOverride:
      'An organization runs two identical web servers behind a load balancer where both servers actively serve traffic. When one server fails, the other continues serving all traffic without interruption. Which configuration is this?\n\n(A) Active/Passive clustering\n(B) Cold standby\n(C) Active/Active load balancing\n(D) Warm site',
    answerOverride:
      'C - Active/Active load balancing. Both nodes handle production traffic under normal conditions, so failure of one simply shifts the entire load to the surviving node. (A), (B), and (D) describe different redundancy or recovery models.',
  },
  '3-4-site-resiliency': {
    title: 'The Site Was Built, But The Servers Were Not There',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The disaster recovery site has racks, power, and network access ready, but replacement hardware still has to arrive after the declaration.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So it is more prepared than an empty building, but it cannot take over instantly either.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is the middle recovery tier.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Ready infrastructure plus delayed hardware availability describes a warm site.',
    },
    questionOverride:
      'A company needs a disaster recovery site that can become operational within a few hours. The site has rack infrastructure and power already in place, but hardware must be shipped from a vendor upon declaring a disaster. Which site type is this?\n\n(A) Hot site\n(B) Warm site\n(C) Cold site\n(D) Active/Active cluster',
    answerOverride:
      'B - Warm site. The facility is prepared, but some hardware or configuration still has to be added before operations can resume. (A) is already fully operational, (C) lacks that prepared infrastructure, and (D) is not a disaster recovery site type.',
  },
  '3-4-recovery-testing-and-backups': {
    title: 'The Fake Phish Measured Real Behavior',
    cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The company sent fake phishing emails to employees, then tracked who clicked, what slipped past filters, and how quickly the help desk got notified.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So this was not a discussion-only walkthrough. They generated realistic user behavior in a controlled way.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The realism is what distinguishes the test type.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Controlled but realistic phishing tests are simulations.',
    },
    questionOverride:
      'A company sends fake phishing emails to all employees without warning. The security team monitors who clicks, which emails bypass filters, and how quickly the help desk is alerted. Which type of recovery/security test is this?\n\n(A) Tabletop exercise\n(B) Simulation\n(C) Live failover\n(D) Penetration test',
    answerOverride:
      'B - Simulation. The exercise creates realistic conditions and measures actual behavior without using a real attack. (A) is discussion-based, (C) shifts production workloads, and (D) is a broader authorized attack assessment.',
  },
  '3-4-power-resiliency': {
    title: 'Zero Milliseconds Meant Zero Transfer Time',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The data center requirement is brutal: no server can lose power even for a millisecond when utility service fails.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So anything that switches to battery after the outage starts is already too slow.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Only one UPS topology is built for zero transfer time.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Online or double-conversion UPS keeps equipment on the battery path continuously, so there is no transfer delay.',
    },
    questionOverride:
      'A data center requires that servers experience no power interruption even for a millisecond when utility power fails. Which UPS type meets this requirement?\n\n(A) Offline / Standby UPS\n(B) Line-interactive UPS\n(C) Online / Double-conversion UPS\n(D) Generator-only solution',
    answerOverride:
      'C - Online / Double-conversion UPS. Equipment is always fed through the UPS conversion path, so utility failure causes no transfer delay. (A), (B), and (D) all involve interruption or startup lag.',
  },
  '4-1-secure-baselines': {
    title: 'Five Hundred Endpoints Meant No Hand Checks',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'Northwind pushed a new application to 500 workstations and now needs to verify all of them still match the security baseline.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the real problem is scale. Manual inspection and user confirmation are dead on arrival.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Baseline enforcement at that size has to be centralized and automated.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. Group Policy plus automated compliance scanning is the efficient way to verify baselines across hundreds of systems.',
    },
    questionOverride:
      'An organization deploys a new application across 500 workstations. The security team must verify all workstations meet the security baseline after deployment. Which approach is MOST efficient?\n\n(A) Manually inspect each workstation\n(B) Use Active Directory Group Policy and automated compliance scanning\n(C) Email each user requesting confirmation of settings\n(D) Review application logs on a single representative system',
    answerOverride:
      'B - Use Active Directory Group Policy and automated compliance scanning. Centralized policy and automated validation are the only efficient way to verify consistent baseline compliance at this scale. (A), (C), and (D) are incomplete or impractical.',
  },
  '4-1-hardening-targets': {
    title: 'The SCADA System Needed Distance More Than Convenience',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The engineer has to harden a factory floor SCADA system, and most office-IT habits feel like the wrong first move.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the main control is not cloud monitoring or casual Windows-style automation. It is making sure the system is heavily isolated from outside reach.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. In industrial environments, segmentation is usually the first safety answer.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Extensive segmentation with no external access is the most important SCADA hardening action here.',
    },
    questionOverride:
      'A security engineer needs to harden a factory floor SCADA system. Which action is MOST important?\n\n(A) Enable automatic Windows updates\n(B) Install third-party antivirus software\n(C) Implement extensive network segmentation with no external access\n(D) Deploy a cloud-based monitoring agent',
    answerOverride:
      'C - Implement extensive network segmentation with no external access. For SCADA and ICS, isolation from external networks is the primary hardening control. (A), (B), and (D) may be useful in some contexts, but they are not the top priority in this scenario.',
  },
  '4-1-securing-wireless-and-mobile': {
    title: 'The Phone Stayed Theirs, The Email Space Stayed Ours',
    cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'Employees want corporate email on their personal smartphones, but Northwind still needs tight control over corporate data.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So full corporate ownership is out, yet unmanaged personal apps touching mail is not acceptable either.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The answer has to preserve personal ownership while isolating company information.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. BYOD with MDM-managed containerization gives the company strong control over corporate data without taking over the whole device.',
    },
    questionOverride:
      'A company allows employees to use personal smartphones to access corporate email. The security team wants maximum control over corporate data while respecting personal device ownership. Which model is BEST?\n\n(A) BYOD with MDM-managed containerization\n(B) COPE with full device management\n(C) CYOD with optional MDM enrollment\n(D) No MDM - rely on user training',
    answerOverride:
      'A - BYOD with MDM-managed containerization. It preserves personal device ownership while isolating and controlling corporate data inside a managed partition. (B) changes the ownership model, and (C) and (D) provide less control.',
  },
  '4-1-wireless-security-settings': {
    title: 'The Handshake Gave Them Work To Do Later',
    cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The attacker captured the WPA2-PSK four-way handshake and then left the area without doing anything else on-site.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So the captured exchange itself is enough to take home and start guessing against offline.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The handshake gives them material for brute-force work without further contact with the network.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. After capturing the WPA2 handshake, the attacker can attempt an offline brute-force or dictionary attack against the PSK.',
    },
    questionOverride:
      'A wireless network uses WPA2-PSK. An attacker captures the four-way handshake. What can the attacker do next?\n\n(A) Nothing - the handshake does not contain useful credential data\n(B) Attempt an offline brute-force attack against the pre-shared key hash\n(C) Immediately decrypt all past captured sessions\n(D) Inject packets into the active session',
    answerOverride:
      'B - Attempt an offline brute-force attack against the pre-shared key hash. Capturing the four-way handshake gives the attacker material to test password guesses offline. (A), (C), and (D) do not describe the standard WPA2-PSK weakness being tested here.',
  },
  '4-1-application-security': {
    title: 'The Static Analyzer Was Loud, Not Omniscient',
    cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The static analyzer produced 200 findings, including overflows and SQL injection risks, and the team is unsure how much of that report equals real bugs.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the issue is not whether SAST can find common code flaws. It is what SAST cannot prove on its own.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This question is about limitations, not capabilities.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Right. SAST produces false positives and cannot reliably find authentication logic flaws or insecure cryptographic design on its own.',
    },
    questionOverride:
      'A developer runs a static code analyzer on an application and gets 200 findings. The report flags buffer overflows and SQL injection risks. Which limitation of SAST must the team be aware of?\n\n(A) SAST cannot identify buffer overflows\n(B) SAST runs code in a live environment and may cause outages\n(C) SAST produces false positives and cannot find authentication logic flaws\n(D) SAST only works on compiled binaries, not source code',
    answerOverride:
      'C - SAST produces false positives and cannot find authentication logic flaws. Static analysis is useful for common code issues, but it still requires manual verification and does not reliably identify every logic or cryptographic problem. (A), (B), and (D) are incorrect statements about SAST.',
  },
  '4-2-asset-management': {
    title: 'The Drives Needed To Be Destroyed And Proved Destroyed',
    cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The organization is retiring 500 hard drives from a hospital environment, and the auditors will expect proof that patient data cannot be recovered.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So this is not just about deleting files. It is about irrecoverable destruction and compliance documentation together.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The paper trail matters as much as the disposal method here.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Third-party physical destruction with a certificate of destruction gives both irrecoverable disposal and auditable proof.',
    },
    questionOverride:
      'An organization is decommissioning 500 hard drives from a hospital environment. The drives contain patient records. Which disposal approach BEST ensures data cannot be recovered and provides compliance documentation?\n\n(A) Standard deletion and drive reuse\n(B) Format the drives and sell them as surplus\n(C) Third-party physical destruction with a certificate of destruction\n(D) Overwrite drives with zeros once before recycling',
    answerOverride:
      'C - Third-party physical destruction with a certificate of destruction. For sensitive healthcare media, this provides both irrecoverable data removal and the compliance evidence auditors expect. (A), (B), and (D) do not provide the same assurance or documentation.',
  },
  '4-3-vulnerability-scanning': {
    title: 'Crash The Test Build Before Attackers Do',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'I aimed a harness at the customer portal and flooded it with malformed inputs until the app started throwing exceptions and eventually crashed.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So this was not reviewing source code or mapping ports. You were abusing the live app to see how it failed.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The method is defined by random bad input against a running target.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Random malformed input plus monitoring for crashes describes fuzzing, which is dynamic analysis.',
    },
    questionOverride:
      'Northwind tests its customer portal by sending thousands of randomly generated malformed inputs to the running application and watching for crashes. Which technique is the team using?\n\n(A) Port scanning\n(B) SAST - Static Application Security Testing\n(C) Fuzzing - Dynamic analysis\n(D) Packet capture analysis',
    answerOverride:
      'C - Fuzzing - Dynamic analysis. Fuzzing sends random, malformed, or unexpected input to a running application and watches for crashes, exceptions, or other failures. (A) maps services, (B) inspects source code without execution, and (D) analyzes network traffic rather than stressing application input handling.',
  },
  '4-3-threat-intelligence': {
    title: 'Find Who Is Selling Northwind Access',
    cast: ['rosa-jimenez', 'glen-foster', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'A monitoring service found Northwind employee credentials being advertised in a criminal forum alongside our company name.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So this was not a normal web search or a social media scrape. Someone was watching the places criminals trade access.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The location of the discovery tells you which intelligence source applies.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Criminal forums and stolen credential markets point to dark web intelligence monitoring.',
    },
    questionOverride:
      'A security team discovers Northwind\'s name being discussed in a dark web forum alongside stolen employee credentials. Which intelligence source helped them find this?\n\n(A) OSINT from public social media\n(B) Dark web intelligence monitoring\n(C) Proprietary threat feed correlation\n(D) Cyber Threat Alliance submission',
    answerOverride:
      'B - Dark web intelligence monitoring. The scenario specifically involves criminal forums and stolen credentials in non-public spaces, which is the role of dark web monitoring. (A) covers public sources, (C) is a broader curated feed category, and (D) refers to member sharing through a specific alliance rather than the source described here.',
  },
  '4-3-penetration-testing': {
    title: 'Use The Workstation To Reach The Hidden VLAN',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The pentest team compromised a front-office workstation, then used it to reach a database server on an internal VLAN that the internet could not touch directly.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the workstation became a stepping stone into a network segment the testers could not reach from outside.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is about the relay technique, not the initial breach.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Using one compromised host as a bridge into another network segment is the pivot.',
    },
    questionOverride:
      'After gaining initial access at Northwind, a pentester uses a compromised workstation to access a database server on a separate internal VLAN that is not directly reachable from the internet. Which technique does this describe?\n\n(A) Lateral movement\n(B) Privilege escalation\n(C) The pivot\n(D) Persistence',
    answerOverride:
      'C - The pivot. Pivoting means using a compromised host as a relay or proxy to reach systems that were otherwise inaccessible from the original attack point. (A) is broader movement between systems, (B) is gaining higher privileges, and (D) is maintaining long-term access.',
  },
  '4-3-analyzing-vulnerabilities': {
    title: 'Fix The Exposed Payment Server First',
    cast: ['marty-bell', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'marty-bell',
        text: 'The scanner found the same critical vulnerability on an isolated research system and on the public payment server, and both reports are sitting in my inbox with red banners.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So now the hard part is deciding which one moves to the front of the line based on actual exposure and business harm.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Severity scores start the conversation, but environment and impact finish it.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Environmental impact and exposure factor push the customer-facing payment server ahead of the isolated lab asset.',
    },
    questionOverride:
      'A vulnerability scanner reports the same critical finding on an isolated Northwind research database with no production data and on a customer-facing payment server. How should the team prioritize remediation?\n\n(A) Remediate both equally - CVSS alone determines priority\n(B) Remediate the payment server first based on environmental impact and exposure factor\n(C) Remediate the research database first because it was found first\n(D) Ignore the research database entirely because only production systems matter',
    answerOverride:
      'B - Remediate the payment server first based on environmental impact and exposure factor. Business context, public exposure, and customer harm affect remediation priority even when base vulnerability severity is identical. (A) ignores environmental context, (C) is arbitrary, and (D) goes too far because lower-priority systems still require remediation planning.',
  },
  '4-3-vulnerability-remediation': {
    title: 'Contain The Unpatchable Hospital Device',
    cast: ['ethan-cole', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The hospital imaging device is vulnerable, but the vendor no longer supports it and the replacement order is months away.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So taking no action is reckless, and replacing it today is fantasy. We need the best immediate reduction in risk.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. This is where compensating controls earn their keep.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Segmenting the device and restricting who can reach it reduces exposure immediately while the long-term replacement plan catches up.',
    },
    questionOverride:
      'Northwind cannot patch a critical vulnerability in a legacy medical device because the vendor no longer supports it. What is the BEST immediate remediation approach?\n\n(A) Replace all devices immediately\n(B) Apply a compensating control - network segmentation and restricted access\n(C) File a formal exception and take no further action\n(D) Purchase cybersecurity insurance to cover any breach',
    answerOverride:
      'B - Apply a compensating control - network segmentation and restricted access. When the preferred fix is unavailable, the best immediate response is to reduce exposure through isolation and tighter access control. (A) may be the long-term plan, (C) documents risk but does not reduce it, and (D) transfers some financial risk without preventing compromise.',
  },
  '4-4-security-monitoring': {
    title: 'Explain The 2 A.M. Login Spike',
    cast: ['noah-reed', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'noah-reed',
        text: 'The overnight dashboard shows one account had a five-hundred-percent increase in failed login attempts between 2:00 and 4:00 a.m.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the useful signal is abnormal authentication behavior, not server uptime or network throughput.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Monitoring earns its keep when it notices patterns that break the baseline.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Authentication monitoring with anomaly alerting is what catches sudden off-hours spikes like this.',
    },
    questionOverride:
      'A security analyst notices that authentication failures from a single Northwind user account spiked 500% over a two-hour window at 2 AM. Which monitoring capability detected this?\n\n(A) Firewall log review\n(B) Application availability monitoring\n(C) Authentication event monitoring with anomaly alerting\n(D) Data transfer rate analysis',
    answerOverride:
      'C - Authentication event monitoring with anomaly alerting. The signal here is abnormal login behavior measured against a baseline, especially the spike and the unusual time. (A), (B), and (D) watch different kinds of telemetry and would not directly explain this pattern.',
  },
  '4-4-security-tools': {
    title: 'Catch The Switch The Moment It Peaks',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The core switch sent an alert the moment CPU utilization crossed ninety percent. The monitoring station did not poll it first.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the device initiated the warning instead of waiting for the next stats request.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The distinction is whether the system pushes or the monitor pulls.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. A proactive threshold alert from the device itself is an SNMP trap.',
    },
    questionOverride:
      'A Northwind network device sends an alert to the monitoring station immediately when CPU utilization exceeds 90%, without the monitoring station needing to poll the device first. Which protocol enables this?\n\n(A) SNMP trap (UDP/162)\n(B) SNMP poll (UDP/161)\n(C) NetFlow collector\n(D) SIEM correlation rule',
    answerOverride:
      'A - SNMP trap (UDP/162). SNMP traps let devices proactively send alerts when configured thresholds are crossed. (B) is polling initiated by the monitoring station, (C) is traffic-flow collection, and (D) is an analysis rule rather than the alert transport mechanism described here.',
  },
  '4-5-firewalls': {
    title: 'Put The SSH Rule Where It Can Actually Work',
    cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'An admin added an allow rule for SSH to the server, but they placed it below an older rule that blocks all traffic from 10.0.0.0 slash 8.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So the host at 10.1.1.5 is never going to benefit from that shiny new rule.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Rule order decides the outcome before intent matters.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The deny rule matches first, so the SSH allow rule is never evaluated for that host.',
    },
    questionOverride:
      'An administrator adds a firewall rule at Northwind to allow SSH (TCP/22) from any source to a server. The rule is placed below a rule that blocks all traffic from the 10.0.0.0/8 subnet. A host at 10.1.1.5 tries to SSH to the server. What happens?\n\n(A) SSH is allowed because the SSH rule permits it\n(B) SSH is blocked because the deny rule for 10.0.0.0/8 is evaluated first\n(C) SSH is allowed if the implicit deny is disabled\n(D) The firewall prompts the admin for a decision',
    answerOverride:
      'B - SSH is blocked because the deny rule for 10.0.0.0/8 is evaluated first. Firewall rules process top to bottom, so the broader deny catches the traffic before the lower allow rule can apply. (A), (C), and (D) do not reflect normal firewall rule evaluation behavior.',
  },
  '4-5-web-filtering-and-os-security': {
    title: 'Keep The Gambling Site Blocked Off-Network',
    cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'A sales laptop is on a home Wi-Fi connection, but it still blocks a gambling site the moment the user tries to load it.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So the protection is travelling with the endpoint, not waiting for a corporate firewall to see the request.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The off-site detail is the entire clue.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Agent-based web filtering enforces policy locally on the laptop even when it is off the corporate network.',
    },
    questionOverride:
      'A user on a Northwind company laptop tries to visit a gambling website while off-site on a home network. Northwind uses agent-based web filtering. What happens?\n\n(A) The gambling site is accessible because the user is off the corporate network\n(B) The gambling site is blocked by the corporate firewall\n(C) The agent on the laptop enforces the filtering policy locally and blocks the site\n(D) DNS filtering blocks the request at the ISP level',
    answerOverride:
      'C - The agent on the laptop enforces the filtering policy locally and blocks the site. Agent-based filtering follows the device and continues working off-network. (A) ignores the agent, (B) assumes a perimeter control that cannot see home traffic, and (D) changes the architecture described in the scenario.',
  },
  '4-5-email-security-and-data-monitoring': {
    title: 'Tell Receivers To Reject The Spoofed Invoices',
    cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'Customers keep getting spoofed invoice emails that appear to come from Northwind, and SPF plus DKIM are already in place.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So validation exists, but we still need the receiving servers to know the failure should mean reject, not shrug.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The missing control is the policy layer that tells them what to do next.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. DMARC set to reject turns SPF and DKIM failures into an enforcement decision at the receiver.',
    },
    questionOverride:
      'Northwind receives phishing emails appearing to come from its own domain. SPF and DKIM are configured, but the company needs receiving mail servers to reject messages from the domain when validation fails. Which control provides that instruction?\n\n(A) DKIM signature verification\n(B) SPF DNS TXT record\n(C) DMARC policy set to reject\n(D) Mail gateway IP reputation filtering',
    answerOverride:
      'C - DMARC policy set to reject. SPF and DKIM report whether validation passed or failed, but DMARC tells receiving servers what enforcement action to take when mail does not validate. (A) and (B) are validation components, and (D) is a different filtering mechanism entirely.',
  },
  '4-5-endpoint-security': {
    title: 'Let The Endpoint Quarantine Itself',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'A laptop started showing unusual process behavior, correlated it with suspicious outbound traffic, and then isolated itself before the analyst could intervene.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the platform did more than notice something strange. It actually executed a response on the endpoint.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The automatic containment is the key detail.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Behavioral detection plus automatic endpoint isolation describes EDR with automated response.',
    },
    questionOverride:
      'A security platform at Northwind detects unusual process behavior on an endpoint, correlates it with anomalous outbound network traffic, and automatically isolates the device without analyst action. Which technology does this describe?\n\n(A) Traditional antivirus with signature updates\n(B) SIEM log correlation\n(C) EDR with automated response\n(D) Agentless NAC posture check',
    answerOverride:
      'C - EDR with automated response. EDR detects suspicious behavior on the endpoint and can isolate the device, quarantine threats, or roll back changes without waiting for an analyst. (A) focuses on signatures, (B) correlates events but does not inherently isolate endpoints, and (D) is a pre-access health check rather than live threat response.',
  },
  '4-6-identity-and-access-management': {
    title: 'Grant The App Calendar Access, Not The Whole Account',
    cast: ['glen-foster', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'A third-party scheduling app needs access to my Google Calendar, but I am not giving it my full account password.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the app should get limited permission to a specific resource rather than complete control over the user account.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is about scoped authorization.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. OAuth is what grants scoped access to a user resource on behalf of the user.',
    },
    questionOverride:
      'A Northwind user logs into their Google account and is then immediately granted access to a third-party scheduling application without entering additional credentials. The application receives scoped access to the user\'s Google Calendar data. Which technology provided the scoped resource authorization?\n\n(A) SAML for cross-domain authentication\n(B) LDAP directory lookup\n(C) OAuth for application authorization\n(D) Federation trust relationship',
    answerOverride:
      'C - OAuth for application authorization. OAuth grants a third-party application scoped access to a specific resource, such as Calendar data, without sharing the user password. (A) and (D) relate to authentication and trust relationships, and (B) is a directory protocol.',
  },
  '4-6-access-controls': {
    title: 'Respect The Clearance Labels',
    cast: ['rosa-jimenez', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The contract files are labeled Confidential, Secret, or Top Secret, and even the creators cannot decide who else gets access.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the operating system and the administrators own the decision, not the individual file owner.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The inability of users to grant access is what makes the model distinctive.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Clearance labels enforced by the system describe mandatory access control.',
    },
    questionOverride:
      'A government database used by Northwind classifies files as Confidential, Secret, or Top Secret. Users are assigned clearance levels by administrators, and users cannot grant access to files even if they created them. Which access control model is in use?\n\n(A) DAC - Discretionary Access Control\n(B) RBAC - Role-Based Access Control\n(C) MAC - Mandatory Access Control\n(D) ABAC - Attribute-Based Access Control',
    answerOverride:
      'C - MAC - Mandatory Access Control. In MAC, the system enforces label-based access decisions and users cannot change permissions on their own objects. (A) lets owners decide, (B) is role-based, and (D) uses multiple dynamic attributes instead of fixed clearance labels.',
  },
  '4-6-multifactor-authentication': {
    title: 'Two Secrets Still Count As One Category',
    cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The vendor says their login is multifactor because users enter a password and then a PIN.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So they have two prompts, but both prompts are asking for things the user knows.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Separate entries do not matter if the factor category never changes.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Password plus PIN is still single-category authentication because both are something you know.',
    },
    questionOverride:
      'A Northwind user authenticates with a password and a PIN. An administrator claims this is multifactor authentication. Is this claim correct?\n\n(A) Yes - two factors are used\n(B) No - both factors are from the same category (something you know)\n(C) Yes - as long as they are entered sequentially\n(D) No - MFA requires at least three factors',
    answerOverride:
      'B - No - both factors are from the same category (something you know). True MFA requires factors from different categories, such as something you know plus something you have. (A) and (C) misunderstand the rule, and (D) is false because two different categories are enough for MFA.',
  },
  '4-6-password-security': {
    title: 'Request Root Only For The Maintenance Window',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The admin needs root on a Linux server, but under the new model they have to request elevated access from a central system first.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So no permanent root account is sitting around waiting to be abused. The elevation exists only for the task.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The temporary credential is the control, not an inconvenience.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. JIT access provides time-limited credentials for the session and removes them afterward.',
    },
    questionOverride:
      'A Northwind administrator requires root access to a Linux server to perform maintenance. Under a just-in-time permissions model, how is this access provided?\n\n(A) The admin uses their permanent root account stored in their password manager\n(B) The admin requests access from a central system, receives time-limited credentials, and the credentials are deleted after the session\n(C) The admin\'s standard account is temporarily promoted to root by a colleague\n(D) The admin uses a shared root account documented in the team wiki',
    answerOverride:
      'B - The admin requests access from a central system, receives time-limited credentials, and the credentials are deleted after the session. That is the core JIT pattern. (A), (C), and (D) all retain or create standing privilege in ways JIT is designed to avoid.',
  },
  '4-7-scripting-and-automation': {
    title: 'Let HR Trigger The Onboarding Workflow',
    cast: ['rosa-jimenez', 'glen-foster', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The moment HR marks a new hire as active, the system creates the account, assigns the right groups, and starts laptop provisioning automatically.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So one event triggered the whole onboarding chain instead of a trail of manual tickets.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. That is automation being used for identity lifecycle work.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Automated onboarding driven by an HR event is user provisioning automation.',
    },
    questionOverride:
      'An organization uses a script to automatically create new Northwind employee accounts, assign them to the correct security groups, and provision their laptop - all triggered by an HR system event. Which automation benefit does this primarily demonstrate?\n\n(A) Secure cloud scaling\n(B) Guard rail validation\n(C) User provisioning automation\n(D) Continuous integration testing',
    answerOverride:
      'C - User provisioning automation. The script is automating onboarding tasks tied to a personnel event. (A), (B), and (D) are real automation uses, but they are not what this scenario is primarily demonstrating.',
  },
  '4-8-incident-response': {
    title: 'Stop The Malware Before It Spreads Further',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The analyst confirmed malware has been running on a workstation for two hours and may already be trying to spread.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the team is past detection and analysis. The question now is which phase comes immediately after confirmed compromise.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Once the incident is confirmed, hesitation just helps the malware.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The next phase is containment, eradication, and recovery - isolate the host, remove the malware, and restore operations.',
    },
    questionOverride:
      'A security analyst at Northwind discovers that malware has been executing on a workstation for two hours and may have spread. According to the NIST SP 800-61 lifecycle, which phase should the team enter immediately?\n\n(A) Preparation - gather forensic tools\n(B) Post-Incident Activity - document the event\n(C) Containment, Eradication, and Recovery - isolate and stop the spread\n(D) Detection and Analysis - confirm whether malware is present',
    answerOverride:
      'C - Containment, Eradication, and Recovery - isolate and stop the spread. Detection and analysis are already complete because the malware has been confirmed. The immediate priority is to contain the incident, remove the malware, and restore affected systems.',
  },
  '4-8-incident-planning': {
    title: 'Measure The Fake Phish Like It Was Real',
    cast: ['glen-foster', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The company sent a fake phishing email to all employees, then tracked clicks, reports, and whether the filter missed it.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So this was not a table discussion. They created a realistic event and measured what actually happened.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The scenario is defined by controlled realism.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. A realistic test sent to actual users is a simulation exercise.',
    },
    questionOverride:
      'A company sends a simulated phishing email to all 2,000 Northwind employees and tracks who clicks the link, who reports it, and whether the email bypassed the spam filter. Which exercise type is this?\n\n(A) Tabletop exercise\n(B) Full-scale disaster drill\n(C) Simulation exercise\n(D) Root cause analysis',
    answerOverride:
      'C - Simulation exercise. A simulation creates a controlled but realistic event and measures actual human or technical response. (A) is discussion-only, (B) is broader and more disruptive, and (D) happens after an event to find underlying causes.',
  },
  '4-8-digital-forensics': {
    title: 'Prove The Image Matches The Original Drive',
    cast: ['rosa-jimenez', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The investigator copied the suspect drive to a forensic image, hashed both copies, and documented every person who handled the evidence.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the point of the hash step is not storage or encryption. It is proving the forensic image has not changed.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. If the image cannot be trusted, the analysis cannot be trusted either.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Matching hashes prove the forensic copy is an exact, unaltered replica of the original evidence.',
    },
    questionOverride:
      'A forensic investigator copies a suspect hard drive to a forensic image, calculates a hash of both the original and the copy, and documents every person who handled the drive. What is the PRIMARY purpose of the hash comparison?\n\n(A) To compress the forensic image for storage\n(B) To verify the forensic copy is an exact, unaltered replica of the original\n(C) To encrypt the evidence for chain of custody documentation\n(D) To identify deleted files on the original drive',
    answerOverride:
      'B - To verify the forensic copy is an exact, unaltered replica of the original. Hash comparison proves integrity and supports chain of custody by showing the image matches the source evidence bit for bit. (A), (C), and (D) are not the primary purpose of the hash comparison.',
  },
  '4-8-log-data': {
    title: 'Pull The Full Packet Trail',
    cast: ['ethan-cole', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The investigator knows the compromised host talked to a command-and-control server, but now they need the exact packet sequence exchanged between them.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So firewall and IDS logs are useful context, but they only summarize what happened at a higher level.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The question is asking for the highest-fidelity source.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Packet captures provide the exact bytes, order, and protocol details of the communication.',
    },
    questionOverride:
      'An investigator at Northwind needs to determine the exact sequence of network packets exchanged between a compromised host and an external command-and-control server. Which log source provides this level of detail?\n\n(A) Firewall logs showing allowed/blocked flows\n(B) IPS/IDS logs showing signature matches\n(C) Packet captures at the network level\n(D) SIEM dashboard showing traffic volume',
    answerOverride:
      'C - Packet captures at the network level. Packet captures provide full protocol-level detail, including the sequence and contents of communications. (A) and (B) provide summarized metadata, and (D) is only a high-level view.',
  },
  '5-1-security-policies': {
    title: 'Use The Right Policy To Fire The Crypto Miner',
    cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'An employee used a company laptop to run a personal cryptocurrency miner during work hours and is now claiming the rules were too vague to justify discipline.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So the question is which document most directly governs misuse of company assets, not which document talks about security in the broadest sense.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The exam usually wants the narrowest correct policy, not the most impressive-sounding one.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Asset misuse is governed most directly by the acceptable use policy.',
    },
    questionOverride:
      'An employee uses a Northwind company laptop to run a personal cryptocurrency mining operation during work hours. The organization wants to terminate the employee. Which document BEST supports this action?\n\n(A) The disaster recovery plan\n(B) The acceptable use policy (AUP)\n(C) The incident response plan\n(D) The information security policy',
    answerOverride:
      'B - The acceptable use policy (AUP). The AUP specifically defines acceptable and unacceptable use of company assets and is the most direct basis for disciplinary action in this scenario. (A) and (C) address different situations, and (D) is broader than the specific behavioral policy at issue.',
  },
  '5-1-security-standards-and-procedures': {
    title: 'Send The Database Upgrade Through Real Change Control',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The infrastructure team wants to upgrade a critical database server, but before touching production they have to present the plan to a review board and document the rollback path.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So this is not a live incident. It is planned work being forced through a governance gate.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Planned change plus formal approval and backout planning is a very specific process.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Formal review plus a documented rollback plan describes change control.',
    },
    questionOverride:
      'An IT team at Northwind wants to upgrade a critical database server. Before making the change, they must submit the plan to a review board and document what they will do if the upgrade fails. Which process governs this?\n\n(A) Incident response planning\n(B) Change control\n(C) Vulnerability remediation\n(D) Business continuity planning',
    answerOverride:
      'B - Change control. Change control requires formal review, approval, and a documented backout plan before production changes are made. (A), (C), and (D) address different operational needs and do not fit the scenario as directly.',
  },
  '5-1-governance-and-considerations': {
    title: 'Separate The Data Custodian From The Data Owner',
    cast: ['denise-park', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'The IT security team encrypts patient records, manages access permissions, and labels the data as PHI, but the Chief Medical Officer remains ultimately accountable for how the data is used.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So one role runs the day-to-day controls while another owns the business accountability.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Governance questions love splitting operational responsibility from executive ownership.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The security team is acting as data custodian, while the executive remains the data owner.',
    },
    questionOverride:
      'A healthcare company stores patient records. The IT security team applies encryption, manages access permissions, and labels data as PHI. The Chief Medical Officer is ultimately accountable for how patient data is used. Which roles are BEST described for the IT security team and CMO respectively?\n\n(A) Data processor and data controller\n(B) Data custodian and data owner\n(C) Data controller and data processor\n(D) Data owner and data steward',
    answerOverride:
      'B - Data custodian and data owner. The IT security team performs day-to-day management and protection of the data, which makes it the custodian role. The CMO is the senior officer ultimately accountable for the data, which makes that role the owner.',
  },
  '5-2-risk-management': {
    title: 'Treat The PCI Assessment Like The Annual Obligation It Is',
    cast: ['marty-bell', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'marty-bell',
        text: 'The payment environment has to go through a risk assessment every year because PCI DSS says so, and finance keeps asking whether that means the work is ad hoc or recurring.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'If the schedule is imposed externally and repeats every year, this should not be a philosophical debate.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Mandated cadence tells you the assessment type.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Annual assessments required by PCI DSS are recurring mandated assessments.',
    },
    questionOverride:
      'PCI DSS requires organizations that handle payment card data to perform risk assessments on a set schedule each year. Which type of risk assessment does this represent?\n\n(A) Ad hoc assessment\n(B) One-time project assessment\n(C) Recurring mandated assessment\n(D) Continuous automated assessment',
    answerOverride:
      'C - Recurring mandated assessment. The work repeats on a defined schedule because an external requirement mandates it. (A) is unscheduled, (B) is tied to a single project, and (D) describes a different style of assessment entirely.',
  },
  '5-2-risk-analysis': {
    title: 'Calculate The Fire Loss Before Buying The Cure',
    cast: ['priya-nair', 'marty-bell', 'noah-reed'],
    setupLines: [
      {
        speakerId: 'priya-nair',
        text: 'Before approving a fire suppression upgrade for the web server, I want the annual expected loss calculated from the asset value and the fire frequency.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So we are not debating whether the fire would be bad. We are quantifying how much it costs us per year on average.',
      },
      {
        speakerId: 'noah-reed',
        text: 'Right. Asset value, exposure factor, SLE, then multiply by ARO for the annualized number.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The one-time loss is fifty thousand, but the annualized loss is five thousand because the event is expected only once every ten years.',
    },
    questionOverride:
      'A Northwind web server (AV = $50,000) is fully destroyed in a fire (EF = 1.0). The organization expects fires to occur once every 10 years (ARO = 0.1). What is the ALE?\n\n(A) $5,000\n(B) $50,000\n(C) $500,000\n(D) $500',
    answerOverride:
      'A - $5,000. First calculate SLE = AV x EF = $50,000 x 1.0 = $50,000. Then ALE = ARO x SLE = 0.1 x $50,000 = $5,000. (B) is the one-time loss, not the annualized loss.',
  },
  '5-2-risk-strategies': {
    title: 'Document The Legacy Gap As An Exemption',
    cast: ['ethan-cole', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'The company cannot patch a critical legacy system because the vendor no longer supports it, so management approved continued operation with compensating controls.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So the control requirement cannot actually be met, which is different from simply choosing not to follow an internal policy for convenience.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The impossibility of compliance is what determines the strategy label.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. This is accept with exemption because the required control cannot reasonably be met and management formally approves the gap.',
    },
    questionOverride:
      'A company cannot patch a critical legacy system because the vendor no longer supports it. The security team formally documents this with management approval and continues operating the system with compensating controls. Which risk management strategy is this?\n\n(A) Risk avoidance\n(B) Risk transfer\n(C) Accept with exemption\n(D) Accept with exception',
    answerOverride:
      'C - Accept with exemption. An exemption is used when a required control or standard cannot be met due to a hard constraint, such as an unsupported legacy system. (D) accept with exception is typically used for a specific internal-policy deviation rather than an infeasible requirement.',
  },
  '5-2-business-impact-analysis': {
    title: 'The Restore Was Fast Enough, But The Data Loss Was Not',
    cast: ['denise-park', 'noah-reed', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'denise-park',
        text: 'After the database crash, the system returned, but six hours of transactions were gone and the policy only allowed two hours of acceptable loss.',
      },
      {
        speakerId: 'noah-reed',
        text: 'So the outage duration is not the main problem here. The real breach is the amount of data that disappeared.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Recovery point and recovery time are different promises.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The organization violated its RPO because the amount of lost data exceeded the acceptable threshold.',
    },
    questionOverride:
      'After a database crash, Northwind restores from the most recent backup and finds that 6 hours of transactions were lost. The organization\'s defined limit for data loss was 2 hours. Which metric was violated?\n\n(A) RTO - the system took too long to recover\n(B) RPO - the data loss exceeded the acceptable threshold\n(C) MTBF - the system failed more often than predicted\n(D) MTTR - the repair time exceeded the maximum allowed',
    answerOverride:
      'B - RPO - the data loss exceeded the acceptable threshold. RPO measures how much data loss is acceptable in time terms. (A) would apply if the recovery duration exceeded the allowed window, while (C) and (D) are different reliability metrics.',
  },
  '5-3-third-party-risk-assessment': {
    title: 'Name The Vendor Update For What It Was',
    cast: ['ethan-cole', 'marty-bell', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'A trusted software vendor shipped a malicious update signed with a legitimate certificate, and the compromise spread into thousands of downstream customer environments.',
      },
      {
        speakerId: 'marty-bell',
        text: 'So the dangerous part is not just the malware. It is that trust in the vendor carried it everywhere.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The vendor relationship is the delivery mechanism in this kind of attack.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. A malicious but legitimate-looking vendor update is the benchmark pattern for supply chain compromise.',
    },
    questionOverride:
      'A company discovers that a software vendor they rely on deployed a malicious update that was signed with a legitimate digital certificate, compromising thousands of customers. Which risk category does this most directly represent?\n\n(A) Insider threat from a disgruntled employee\n(B) Supply chain compromise\n(C) Zero-day vulnerability in proprietary software\n(D) Phishing attack against customer accounts',
    answerOverride:
      'B - Supply chain compromise. The attack entered through a trusted third-party vendor and its software distribution process. (A), (C), and (D) describe different risk types that do not fit the defining upstream-vendor compromise in this scenario.',
  },
  '5-3-agreement-types': {
    title: 'Use The Informal Agreement For The Cloud Migration Courtship',
    cast: ['marty-bell', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'marty-bell',
        text: 'The prospective cloud vendor sent a document saying both sides share security goals, want to collaborate on migration, and consider the shared information confidential, but it does not require signatures.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So this is cooperative intent language, not a signed contractual commitment.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The lack of signatures matters as much as the shared-goals wording.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. That document is an MOU because it expresses common goals without requiring signatures or enforceable promises.',
    },
    questionOverride:
      'An organization signs a document with a new vendor stating they share common security goals and will work together on cloud migration, with a note that all shared information is confidential. No signatures are required. Which agreement type is this?\n\n(A) SLA - Service Level Agreement\n(B) NDA - Non-Disclosure Agreement\n(C) BPA - Business Partners Agreement\n(D) MOU - Memorandum of Understanding',
    answerOverride:
      'D - MOU - Memorandum of Understanding. An MOU expresses shared intent and common goals and may mention confidentiality, but it is not a formal signed contract with enforceable promises. (B) NDA would require signatures and focuses specifically on confidentiality.',
  },
  '5-4-compliance-and-privacy': {
    title: 'Honor The EU Deletion Request Properly',
    cast: ['rosa-jimenez', 'denise-park', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'A US-based Northwind website collected email addresses and browsing history from EU visitors, and now one of those users wants all their personal data erased.',
      },
      {
        speakerId: 'denise-park',
        text: 'So the key issue is not where Northwind is headquartered. It is whose data is being processed.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The geography follows the data subject in this scenario.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. GDPR gives EU data subjects the right to request deletion of their personal data.',
    },
    questionOverride:
      'A US-based company maintains a website used by EU residents. Northwind collects email addresses and browsing history. An EU user requests that all their data be permanently deleted from the company\'s systems. Under which regulation must the company honor this request?\n\n(A) SOX - Sarbanes-Oxley Act\n(B) HIPAA - Health Insurance Portability and Accountability Act\n(C) GDPR - General Data Protection Regulation\n(D) GLBA - Gramm-Leach-Bliley Act',
    answerOverride:
      'C - GDPR - General Data Protection Regulation. GDPR grants EU data subjects the right to be forgotten, which applies even to non-EU organizations that process EU personal data. (A), (B), and (D) govern different domains and do not create this deletion right.',
  },
  '5-5-audits-and-penetration-tests': {
    title: 'Treat The Pentest Like A Blind Start',
    cast: ['rosa-jimenez', 'ethan-cole', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'rosa-jimenez',
        text: 'The new penetration tester got no internal network details before starting and had to map the environment using only public sources.',
      },
      {
        speakerId: 'ethan-cole',
        text: 'So the test begins with zero prior knowledge, and the reconnaissance avoids directly probing the target systems.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. Both halves of the scenario matter to get the answer right.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. No prior information means unknown environment, and public-source mapping is passive reconnaissance.',
    },
    questionOverride:
      'A penetration tester is hired and given no information about Northwind\'s network, systems, or security architecture before starting. The tester uses publicly available information to map the environment. Which type of test and which reconnaissance technique is being used?\n\n(A) Known environment test with active reconnaissance\n(B) Unknown environment test with passive reconnaissance\n(C) Partially known test with DNS query reconnaissance\n(D) Red team test with active port scanning',
    answerOverride:
      'B - Unknown environment test with passive reconnaissance. Starting with no prior internal knowledge makes the engagement a blind or unknown-environment test, and using only public information is passive reconnaissance. The other options either assume prior knowledge or direct target probing.',
  },
  '5-6-security-awareness': {
    title: 'Track Whether The Fake Phish Is Working Less Often',
    cast: ['glen-foster', 'rosa-jimenez', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'glen-foster',
        text: 'The awareness program shows that eighteen percent of employees clicked a simulated phishing link in January, and only nine percent clicked it in June after training.',
      },
      {
        speakerId: 'rosa-jimenez',
        text: 'So the program is not measuring repair time or account enrollment. It is measuring how often users still fall for the bait.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The percentage itself is the performance metric.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. The tracked effectiveness metric is the phishing simulation click rate.',
    },
    questionOverride:
      'A security awareness program tracks that 18% of Northwind employees clicked a simulated phishing link in January, dropping to 9% in June after training. Which metric is the program using to measure effectiveness?\n\n(A) Mean time to repair (MTTR)\n(B) Annualized loss expectancy (ALE)\n(C) Phishing simulation click rate\n(D) MFA enrollment percentage',
    answerOverride:
      'C - Phishing simulation click rate. This metric directly measures how many users still fall for a simulated phishing attack, making it a strong indicator of awareness-program effectiveness. (A), (B), and (D) track different operational or security outcomes.',
  },
  '5-6-user-training': {
    title: 'Leave The Parking-Lot USB Alone',
    cast: ['ethan-cole', 'glen-foster', 'priya-nair'],
    setupLines: [
      {
        speakerId: 'ethan-cole',
        text: 'An employee found a USB drive labeled Salary Information Q4 in the parking lot, plugged it into a company laptop out of curiosity, and triggered malware.',
      },
      {
        speakerId: 'glen-foster',
        text: 'So this was not a password failure. It was a physical bait attack that worked because someone trusted found media.',
      },
      {
        speakerId: 'priya-nair',
        text: 'Exactly. The training topic needs to match the attack vector, not just the malware outcome.',
      },
    ],
    postRevealLine: {
      speakerId: 'priya-nair',
      text: 'Correct. Removable media and physical attack awareness would have taught the employee never to plug in an unknown drive.',
    },
    questionOverride:
      'An employee finds a USB drive labeled "Salary Information Q4" in the parking lot and plugs it into a company laptop out of curiosity. The drive installs malware. Which user training topic would have prevented this?\n\n(A) Password management training\n(B) Removable media and physical attack awareness\n(C) Social engineering response procedures\n(D) Operational security and OPSEC training',
    answerOverride:
      'B - Removable media and physical attack awareness. Unknown USB devices are a classic baiting or USB-drop attack, and the correct training is to never connect found media to a company system. (A), (C), and (D) are relevant to other behaviors but are not the direct preventive topic here.',
  },
};

export const getLessonCheckStory = (lessonId: Lesson['id']): LessonCheckStory | undefined =>
  LESSON_CHECK_STORIES_BY_ID[lessonId];
