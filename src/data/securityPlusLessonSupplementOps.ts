import type { Lesson } from './securityPlusLessons';

export const DATA_PROTECTION_DEEP_DIVE_LESSON: Lesson = {
  id: '3-3-data-protection-deep-dive',
  title: 'Lesson 70A',
  subtitle: '3.3 - Data Protection Deep Dive',
  icon: 'DP',
  slides: [
    {
      type: 'intro',
      week: '3.3 - Data Protection Deep Dive',
      question: 'Which data-protection details still matter once you already understand FDE, tokenization, and masking?',
      body: 'Security+ occasionally tests hardware-backed storage encryption and expects you to distinguish it from operating-system-managed full disk encryption. This supplement adds the Self-Encrypting Drive model and the TCG Opal vocabulary behind it.',
    },
    {
      type: 'concept',
      title: 'Self-Encrypting Drives and Opal',
      body: '<p><strong>Self-Encrypting Drives (SEDs)</strong> perform encryption in the drive hardware itself. The media is always encrypted with a <strong>Media Encryption Key (MEK)</strong> managed by the drive, while an <strong>Authentication Key (AEK)</strong> or similar unlock mechanism authorizes access.</p><p>The operating system does not perform the actual bulk encryption work, which makes the process transparent to the host and reduces CPU overhead. The common specification to know is <strong>TCG Opal</strong>, which standardizes how compatible self-encrypting storage devices handle authentication and locking behavior.</p>',
    },
    {
      type: 'bullets',
      title: 'Data Protection Deep Dive - Key Points',
      items: [
        '<strong>SED:</strong> the drive handles encryption internally instead of relying on host CPU encryption.',
        '<strong>MEK:</strong> media encryption key protects the stored data; <strong>AEK:</strong> unlocks access to the drive.',
        '<strong>TCG Opal:</strong> common specification for self-encrypting storage behavior and management.',
        '<strong>Difference from BitLocker:</strong> BitLocker is OS-managed FDE, while an SED performs encryption at the drive hardware layer.',
      ],
    },
    {
      type: 'term',
      label: '3.3',
      term: 'Self-Encrypting Drive (SED)',
      def: 'A storage device that performs encryption in hardware on the drive itself. Data is encrypted with a media encryption key inside the device and unlocked with an authentication mechanism rather than relying on the host operating system to encrypt each block.',
    },
    {
      type: 'summary',
      title: '3.3 Data Protection Deep Dive - Summary',
      points: [
        'SEDs encrypt in hardware and are distinct from software-managed FDE such as BitLocker.',
        'The drive MEK protects the media while a separate authentication mechanism unlocks access.',
        'TCG Opal is the common specification name associated with enterprise self-encrypting storage.',
      ],
      cta: 'Return to the broader data-protection topics and connect hardware encryption to the rest of the at-rest data control set.',
    },
  ],
};

export const ASSET_CMDB_DEEP_DIVE_LESSON: Lesson = {
  id: '4-2-asset-and-cmdb-deep-dive',
  title: 'Lesson 80A',
  subtitle: '4.2 - Asset and CMDB Deep Dive',
  icon: 'CM',
  slides: [
    {
      type: 'intro',
      week: '4.2 - Asset and CMDB Deep Dive',
      question: 'How does a CMDB add value beyond a simple asset inventory?',
      body: 'A raw inventory tells you what exists. A Configuration Management Database (CMDB) adds the relationships between systems, applications, owners, dependencies, and services. That relationship context is what makes change and incident analysis faster and more accurate.',
    },
    {
      type: 'concept',
      title: 'CMDB Purpose in Change and Incident Management',
      body: '<p>A <strong>Configuration Management Database (CMDB)</strong> stores configuration items and their relationships: servers, applications, databases, owners, network connections, dependencies, and business services.</p><p>In <strong>change management</strong>, a CMDB helps answer impact questions before implementation: which applications depend on this database, which business unit owns the service, and what downstream systems will be affected? In <strong>incident response</strong>, it helps identify which systems are connected to or depend on a compromised asset. Common enterprise examples include ServiceNow and BMC Remedy.</p>',
    },
    {
      type: 'bullets',
      title: 'Asset and CMDB Deep Dive - Key Points',
      items: [
        '<strong>Inventory:</strong> lists assets; <strong>CMDB:</strong> records assets plus their dependencies and relationships.',
        '<strong>Change impact:</strong> a CMDB shows what else breaks if one configuration item changes.',
        '<strong>Incident triage:</strong> a CMDB helps identify affected systems and owners faster.',
        '<strong>Examples:</strong> ServiceNow and BMC Remedy are common CMDB-backed platforms.',
      ],
    },
    {
      type: 'term',
      label: '4.2',
      term: 'Configuration Management Database (CMDB)',
      def: 'A database that stores configuration items and their relationships, such as servers, applications, owners, dependencies, and connected services. A CMDB supports change impact analysis and faster incident response because it shows how systems relate to one another.',
    },
    {
      type: 'summary',
      title: '4.2 Asset and CMDB Deep Dive - Summary',
      points: [
        'A CMDB is more than an inventory because it stores relationships, not just asset existence.',
        'Change management uses the CMDB to understand downstream impact before a modification is approved.',
        'Incident response uses the CMDB to identify affected systems, dependencies, and owners quickly.',
      ],
      cta: 'Return to asset management topics and connect device inventory with the service relationships that make the inventory operationally useful.',
    },
  ],
};

export const LOGGING_PROTOCOLS_DEEP_DIVE_LESSON: Lesson = {
  id: '4-8-logging-protocols-deep-dive',
  title: 'Lesson 100A',
  subtitle: '4.8 - Logging Protocols Deep Dive',
  icon: 'LG',
  slides: [
    {
      type: 'intro',
      week: '4.8 - Logging Protocols Deep Dive',
      question: 'Which protocol details matter when Security+ asks about logging and monitoring transport?',
      body: 'The base lessons cover where logs come from. This supplement covers how they move and how their severity is interpreted, especially for syslog and SNMP security.',
    },
    {
      type: 'concept',
      title: 'Syslog Transport and Severity Levels',
      body: '<p><strong>Syslog</strong> commonly uses <strong>UDP port 514</strong> by default, though TCP or TLS-wrapped transport may be used when reliability or confidentiality matters. The protocol also classifies messages by severity.</p><p>Know the eight levels from most severe to least severe: <strong>0 Emergency</strong>, <strong>1 Alert</strong>, <strong>2 Critical</strong>, <strong>3 Error</strong>, <strong>4 Warning</strong>, <strong>5 Notice</strong>, <strong>6 Informational</strong>, and <strong>7 Debug</strong>. Exam questions may ask which number maps to which seriousness level.</p>',
    },
    {
      type: 'concept',
      title: 'SNMPv3 vs v1 and v2',
      body: '<p><strong>SNMPv1 and SNMPv2</strong> rely on community strings, which are effectively plaintext shared secrets and provide weak security. They are easy to sniff on an untrusted network.</p><p><strong>SNMPv3</strong> adds the <strong>User-based Security Model</strong> with real authentication and privacy controls. In practice, this means authenticated access and optional encryption, making SNMPv3 the only acceptable version on secure modern networks.</p>',
    },
    {
      type: 'bullets',
      title: 'Logging Protocols Deep Dive - Key Points',
      items: [
        '<strong>Syslog default:</strong> UDP 514; TCP or TLS may be used for stronger transport guarantees.',
        '<strong>Syslog severities:</strong> 0 Emergency through 7 Debug.',
        '<strong>SNMPv1/v2:</strong> community-string based and weak on secure networks.',
        '<strong>SNMPv3:</strong> authenticated and optionally encrypted; the secure version to prefer.',
      ],
    },
    {
      type: 'term',
      label: '4.8',
      term: 'Syslog severity 0',
      def: 'Emergency. The highest syslog severity level, indicating the system is unusable or the situation is critically urgent.',
    },
    {
      type: 'summary',
      title: '4.8 Logging Protocols Deep Dive - Summary',
      points: [
        'Syslog questions often test both transport details and the numeric severity mapping.',
        'UDP 514 is the classic default, but TCP or TLS are more reliable and secure transport options.',
        'SNMPv3 is the secure choice because it adds authentication and privacy instead of plaintext-style community strings.',
      ],
      cta: 'Return to log-data analysis and tie protocol transport details to the evidence sources the analyst is collecting.',
    },
  ],
};
