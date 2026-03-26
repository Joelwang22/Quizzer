import type { Lesson } from './securityPlusLessons';

export const MOBILE_SECURITY_DEEP_DIVE_LESSON: Lesson = {
  id: '4-1-mobile-security-deep-dive',
  title: 'Lesson 77A',
  subtitle: '4.1 - Mobile Security Deep Dive',
  icon: 'MS',
  slides: [
    {
      type: 'intro',
      week: '4.1 - Mobile Security Deep Dive',
      question: 'Which mobile-specific controls and attacks matter beyond the BYOD and MDM basics?',
      body: 'Security+ mobile questions often move past device ownership models into location controls, mobile threat defense, secure provisioning, and how attackers abuse mobile sensors and radios. This supplement fills in the mobile-specific details that are easy to miss when studying only high-level MDM concepts.',
    },
    {
      type: 'concept',
      title: 'Geofencing and GPS Spoofing',
      body: '<p><strong>Geofencing</strong> uses location to trigger a policy. A device can be allowed to open a sensitive application only while inside a clinic, warehouse, or corporate campus, or it can be forced to lock or wipe a managed container when it leaves an approved region.</p><p><strong>GPS spoofing</strong> undermines that trust by feeding a false location to the device. If location is used as an access factor, combine it with device attestation, user authentication, and network context instead of trusting GPS by itself.</p>',
    },
    {
      type: 'concept',
      title: 'Mobile Threat Defense and Device Health',
      body: '<p><strong>Mobile Threat Defense (MTD)</strong> adds runtime detection to mobile fleets. It looks for malicious applications, risky permissions, jailbreak or root indicators, insecure Wi-Fi, phishing links, and suspicious device behavior.</p><p>MTD typically integrates with MDM or UEM so a device that fails health checks can be quarantined, blocked from email, or denied access to SaaS applications until remediated. Think of MTD as mobile-specific EDR plus policy enforcement.</p>',
    },
    {
      type: 'concept',
      title: 'Provisioning, Containers, and Remote Wipe',
      body: '<p>Mobile security also depends on how devices are <strong>provisioned</strong>. Corporate-owned devices can be enrolled with full management from the start, while BYOD devices usually rely on <strong>containerization</strong> so the organization controls only work data.</p><p>Separate work and personal data wherever possible, require encryption and screen locks, and make sure the remote wipe scope matches the ownership model. On BYOD, wiping only the managed workspace is usually safer than erasing the entire phone.</p>',
    },
    {
      type: 'concept',
      title: 'WPA3 DPP and Mobile or IoT Onboarding',
      body: '<p><strong>Device Provisioning Protocol (DPP)</strong>, also called <strong>Easy Connect</strong>, is a WPA3 onboarding feature for devices that do not have a convenient keyboard. Instead of typing a pre-shared key, an administrator can bootstrap the device onto Wi-Fi by scanning a QR code or using another out-of-band trust exchange.</p><p>This is especially relevant for IoT onboarding scenarios, where cameras, sensors, and embedded devices need secure wireless enrollment without reusing a shared password across every device.</p>',
    },
    {
      type: 'concept',
      title: 'Juice Jacking and Malicious Charging Cables',
      body: '<p><strong>Juice jacking</strong> is the risk of data theft or malware delivery through a compromised USB charging station. A public charger is not just a power source if it also exposes data lines.</p><p><strong>Malicious charging cables</strong> such as purpose-built offensive cables hide electronics inside what looks like a normal cable. The defense is simple: use trusted power adapters, charge-only cables or USB data blockers, and do not connect work devices to unknown charging infrastructure.</p>',
    },
    {
      type: 'bullets',
      title: 'Mobile Security Deep Dive - Key Points',
      items: [
        '<strong>Geofencing:</strong> location-based policy control around a site, region, or facility.',
        '<strong>GPS spoofing:</strong> false location data can defeat weak location-based trust decisions.',
        '<strong>MTD:</strong> detects malicious apps, risky networks, jailbreak or root conditions, and phishing on mobile devices.',
        '<strong>Provisioning model:</strong> full-device control fits corporate ownership; containerization fits BYOD.',
        '<strong>DPP:</strong> WPA3 Easy Connect uses QR-code style bootstrapping for secure device onboarding.',
        '<strong>Juice jacking:</strong> unknown USB charging stations or malicious cables can expose data lines, not just power.',
        '<strong>Remote wipe:</strong> wipe only the managed workspace when the ownership model requires privacy separation.',
      ],
    },
    {
      type: 'term',
      label: '4.1',
      term: 'Mobile Threat Defense (MTD)',
      def: 'A mobile security capability that detects malicious applications, risky networks, phishing, jailbreak or root conditions, and abnormal behavior on phones and tablets. MTD commonly integrates with MDM or UEM platforms so unhealthy devices can be quarantined or denied access automatically.',
    },
    {
      type: 'check',
      q: 'A company allows managed tablets to open a warehouse application only while the device is physically inside approved loading facilities. Which control is the company using?\n\n(A) Tokenization\n(B) Geofencing\n(C) Sandboxing\n(D) DNSSEC',
      a: 'B - Geofencing applies policy based on the device location. The policy decision is tied to where the tablet is, not just who is using it.',
    },
    {
      type: 'summary',
      title: '4.1 Mobile Security Deep Dive - Summary',
      points: [
        'Geofencing is useful, but location alone is weak when GPS spoofing is possible.',
        'MTD fills the mobile detection gap by monitoring malicious apps, risky networks, and device compromise indicators.',
        'Provisioning and wipe strategy must match the ownership model so corporate controls do not exceed what the organization is allowed to manage.',
        'Containerization remains the cleanest way to protect enterprise data on BYOD devices.',
      ],
      cta: 'Continue with wireless security settings and connect mobile controls to the broader AAA, WPA3, and NAC topics.',
    },
  ],
};
