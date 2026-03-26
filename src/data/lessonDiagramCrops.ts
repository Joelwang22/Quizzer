import {
  SECURITY_PLUS_LESSONS,
  getDiagramStorageKey,
  type DiagramSlide,
} from './securityPlusLessons';

export interface DiagramCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY = 'lesson_diagram_debug_overrides';
export const LESSON_DIAGRAM_DEBUG_OVERRIDE_EXPORT_FILE_NAME = 'lesson-diagram-crops.json';

const SOURCE_DIAGRAM_CROPS_BY_ID: Record<string, DiagramCrop> = {};

const LEGACY_SOURCE_DIAGRAM_CROPS_BY_CAPTION: Record<string, DiagramCrop> = {
  'Creating a digital signature — hash plus asymmetric encryption for non-repudiation': {
    x: 0.06,
    y: 0.43,
    width: 0.86,
    height: 0.4,
  },
  'Identification, authentication, authorization, and accounting — four distinct steps in sequence': {
    x: 0.17,
    y: 0.06,
    width: 0.68,
    height: 0.36,
  },
  'Zero Trust across planes — Policy Engine, Policy Administrator, and Policy Enforcement Point': {
    x: 0.05,
    y: 0.53,
    width: 0.9,
    height: 0.24,
  },
  'Symmetric vs. asymmetric encryption — key relationships and trust model': {
    x: 0.05,
    y: 0.61,
    width: 0.9,
    height: 0.22,
  },
  'Symmetric encryption operation — shared key encrypts and decrypts; key distribution is the core weakness': {
    x: 0.17,
    y: 0.08,
    width: 0.68,
    height: 0.28,
  },
  'Asymmetric keys generating a shared symmetric key — Diffie-Hellman concept': {
    x: 0.08,
    y: 0.22,
    width: 0.84,
    height: 0.26,
  },
  'Message authentication using digital signatures — hash signed with private key; verified with public key': {
    x: 0.09,
    y: 0.06,
    width: 0.82,
    height: 0.3,
  },
  'Certificate Signing Request (CSR) workflow — applicant to CA': {
    x: 0.09,
    y: 0.47,
    width: 0.82,
    height: 0.32,
  },
  'Buffer overflow memory — overflowing variable A corrupts adjacent variable B (hex view)': {
    x: 0.06,
    y: 0.23,
    width: 0.88,
    height: 0.26,
  },
  'XSS attack flow — attacker injects script, victim browser sends session data to attacker': {
    x: 0.06,
    y: 0.24,
    width: 0.88,
    height: 0.18,
  },
  'Race condition example - concurrent transfers create inconsistent account balances through TOCTOU timing': {
    x: 0.05,
    y: 0.64,
    width: 0.9,
    height: 0.28,
  },
  'Fileless virus infection process and worm propagation flow': {
    x: 0.08,
    y: 0.31,
    width: 0.78,
    height: 0.25,
  },
  'Wireshark capture showing ARP poisoning — unsolicited ARP replies poisoning the MAC:IP cache': {
    x: 0.1,
    y: 0.32,
    width: 0.8,
    height: 0.3,
  },
  'Pass-the-Hash attack flow — captured hash replayed to authenticate': {
    x: 0.08,
    y: 0.45,
    width: 0.78,
    height: 0.2,
  },
  'CSRF attack flow — forged request sent as hyperlink to authenticated bank user': {
    x: 0.08,
    y: 0.66,
    width: 0.78,
    height: 0.18,
  },
  'Server-side request forgery (SSRF) — attacker causes server to make outbound requests to internal or external targets': {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.34,
  },
  'Segmented network — Marketing and Finance subnets separated by a router enforcing inter-zone traffic control': {
    x: 0.1,
    y: 0.06,
    width: 0.8,
    height: 0.25,
  },
  'Cloud shared responsibility matrix — provider-managed vs. customer-managed layers for IaaS / PaaS / SaaS': {
    x: 0.06,
    y: 0.48,
    width: 0.88,
    height: 0.32,
  },
  'Virtualized vs. containerized applications — VM/hypervisor layers compared to Docker/host OS': {
    x: 0.08,
    y: 0.45,
    width: 0.84,
    height: 0.25,
  },
  'NIST Cybersecurity Framework core tasks — Identify, Protect, Detect, Respond, and Recover': {
    x: 0.12,
    y: 0.39,
    width: 0.76,
    height: 0.37,
  },
  'Security control functional types — preventive, detective, corrective, directive, deterrent, and compensating': {
    x: 0.17,
    y: 0.17,
    width: 0.66,
    height: 0.28,
  },
  'File download hash verification — published digest compared to the downloaded file': {
    x: 0.11,
    y: 0.05,
    width: 0.78,
    height: 0.27,
  },
  'Digital envelope key exchange — symmetric session key protected with the recipient public key': {
    x: 0.12,
    y: 0.44,
    width: 0.76,
    height: 0.39,
  },
  'Perfect forward secrecy — ephemeral Diffie-Hellman derives a per-session shared secret': {
    x: 0.17,
    y: 0.34,
    width: 0.66,
    height: 0.42,
  },
  'OSI infrastructure model — Ethernet, MAC addressing, IP routing, transport, and application services': {
    x: 0.12,
    y: 0.43,
    width: 0.76,
    height: 0.31,
  },
  'Star topology — switch at center with host links radiating out (broadcast domain)': {
    x: 0.1,
    y: 0.06,
    width: 0.8,
    height: 0.3,
  },
  'Hierarchical network topology — access switches grouping hosts by security role (printers, workstations, servers, guests)': {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.36,
  },
  'VLAN segmentation on a switch — VLAN32 (workstations) and VLAN40 (VoIP) isolate traffic within the access block': {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.39,
  },
  'Security zone topology — trusted, untrusted, screened subnet (DMZ) placement': {
    x: 0.05,
    y: 0.43,
    width: 0.9,
    height: 0.45,
  },
  'Security zone access rules — numbered privilege levels controlling traffic between zones': {
    x: 0.12,
    y: 0.49,
    width: 0.76,
    height: 0.36,
  },
  'Defense-in-depth placement — 5 control positions: border firewall, inline sensor, internal ACLs, load balancer, SPAN-port sensor': {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.33,
  },
  'IPS active (inline) vs. passive monitoring — network placement topology': {
    x: 0.12,
    y: 0.32,
    width: 0.76,
    height: 0.38,
  },
  'TAP vs. SPAN (mirror port) — inline TAP copies physical signal; mirror port copies switch frames to a sensor port': {
    x: 0.11,
    y: 0.12,
    width: 0.78,
    height: 0.35,
  },
  'Security Onion Snort alert in Kibana — intrusion detection event details and rule hit': {
    x: 0.16,
    y: 0.14,
    width: 0.68,
    height: 0.35,
  },
  'Forward proxy, reverse proxy, and open proxy — traffic flow topologies': {
    x: 0.05,
    y: 0.24,
    width: 0.9,
    height: 0.46,
  },
  'Basic load balancing topology — distributing incoming traffic across multiple backend servers': {
    x: 0.13,
    y: 0.06,
    width: 0.74,
    height: 0.43,
  },
  'SSL/TLS VPN concentrator — tunnel decryption and routing flow': {
    x: 0.06,
    y: 0.21,
    width: 0.88,
    height: 0.2,
  },
  'Remote access VPN topology — client tunnel through a VPN gateway to internal services': {
    x: 0.11,
    y: 0.53,
    width: 0.78,
    height: 0.24,
  },
  'Site-to-site VPN topology — gateway-to-gateway IPsec tunnel connecting two fixed sites': {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.4,
  },
  'Clustered load balancing topology — active/passive and active/active node arrangements for failover': {
    x: 0.13,
    y: 0.06,
    width: 0.74,
    height: 0.37,
  },
  'Kerberos Authentication Service (AS) — client requests TGT; KDC verifies credentials and issues ticket': {
    x: 0.12,
    y: 0.37,
    width: 0.76,
    height: 0.24,
  },
  'Kerberos Ticket Granting Service (TGS) — client presents TGT to obtain service ticket for target resource': {
    x: 0.12,
    y: 0.06,
    width: 0.76,
    height: 0.27,
  },
  'Federated identity management — on-premises IdP issues assertions accepted by partner service providers': {
    x: 0.18,
    y: 0.22,
    width: 0.66,
    height: 0.24,
  },
  'IEEE 802.1X port-based NAC — supplicant, switch, RADIUS, and EAP authentication flow': {
    x: 0.17,
    y: 0.35,
    width: 0.66,
    height: 0.46,
  },
  'Jump server securing management traffic — privileged admin sessions routed through hardened bastion host': {
    x: 0.08,
    y: 0.18,
    width: 0.84,
    height: 0.26,
  },
  'Software-defined networking planes — management, control, and data plane separation': {
    x: 0.16,
    y: 0.18,
    width: 0.68,
    height: 0.36,
  },
  'Wi-Fi site survey heat map — signal strength and access point coverage across the floor plan': {
    x: 0.12,
    y: 0.53,
    width: 0.76,
    height: 0.28,
  },
  'Security Onion Alerts dashboard — Suricata and Emerging Threats events queued for review': {
    x: 0.11,
    y: 0.07,
    width: 0.78,
    height: 0.24,
  },
  'Joe Sandbox malware analysis report — sandbox verdict, signatures, and threat intel': {
    x: 0.17,
    y: 0.05,
    width: 0.66,
    height: 0.24,
  },
  'Incident response lifecycle phases — preparation, detection, analysis, containment, eradication, recovery, and lessons learned': {
    x: 0.11,
    y: 0.18,
    width: 0.78,
    height: 0.18,
  },
  'Cyber kill chain stages — reconnaissance through actions on objectives': {
    x: 0.1,
    y: 0.05,
    width: 0.8,
    height: 0.23,
  },
  'Security Onion Hunt dashboard — threat hunting pivot to scope a possible intrusion': {
    x: 0.11,
    y: 0.46,
    width: 0.78,
    height: 0.28,
  },
  'Phishing header analysis — typosquatting visible in the raw message headers': {
    x: 0.12,
    y: 0.05,
    width: 0.76,
    height: 0.31,
  },
  'Pass-the-hash credential replay — LSASS and SAM secrets reused for lateral movement': {
    x: 0.14,
    y: 0.22,
    width: 0.72,
    height: 0.34,
  },
  'Volatility framework — process list extracted from a live memory dump': {
    x: 0.12,
    y: 0.29,
    width: 0.76,
    height: 0.36,
  },
  'Mission essential function recovery metrics — MTD, RTO, WRT, and RPO on one timeline': {
    x: 0.14,
    y: 0.29,
    width: 0.72,
    height: 0.28,
  },
  'Certificate chain of trust - root CA, intermediate CA, and end-entity certificate path': {
    x: 0.29,
    y: 0.39,
    width: 0.43,
    height: 0.29,
  },
  'DMARC verification lookup - published policy and DNS validation results': {
    x: 0.2,
    y: 0.05,
    width: 0.6,
    height: 0.38,
  },
  'Risk heat map - traffic-light impact matrix for qualitative risk prioritization': {
    x: 0.13,
    y: 0.45,
    width: 0.6,
    height: 0.23,
  },
};

const LEGACY_OVERRIDE_KEY_TO_DIAGRAM_ID: Record<string, string> = Object.fromEntries(
  SECURITY_PLUS_LESSONS.flatMap((lesson) =>
    lesson.slides.flatMap((slide, slideIndex) =>
      slide.type === 'diagram'
        ? [[`${lesson.id}::${slideIndex}`, getDiagramStorageKey(lesson.id, slide)]]
        : [],
    ),
  ),
);

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const roundCropValue = (value: number): number => Math.round(value * 10000) / 10000;

const sanitizeCrop = (crop: DiagramCrop): DiagramCrop => {
  const width = clamp(crop.width, 0.02, 1);
  const height = clamp(crop.height, 0.02, 1);
  const x = clamp(crop.x, 0, 1 - width);
  const y = clamp(crop.y, 0, 1 - height);

  return {
    x: roundCropValue(x),
    y: roundCropValue(y),
    width: roundCropValue(width),
    height: roundCropValue(height),
  };
};

const resolveOverridePayload = (rawValue: unknown): unknown => {
  if (
    rawValue &&
    typeof rawValue === 'object' &&
    'overrides' in rawValue &&
    (rawValue as { overrides?: unknown }).overrides &&
    typeof (rawValue as { overrides?: unknown }).overrides === 'object'
  ) {
    return (rawValue as { overrides: unknown }).overrides;
  }

  return rawValue;
};

const buildResolvedSourceDiagramCropsById = (): Record<string, DiagramCrop> => {
  const resolvedCrops: Record<string, DiagramCrop> = {
    ...SOURCE_DIAGRAM_CROPS_BY_ID,
  };

  SECURITY_PLUS_LESSONS.forEach((lesson) => {
    lesson.slides.forEach((slide) => {
      if (slide.type !== 'diagram') {
        return;
      }

      const diagramId = getDiagramStorageKey(lesson.id, slide);
      const sourceCrop = SOURCE_DIAGRAM_CROPS_BY_ID[diagramId] ?? LEGACY_SOURCE_DIAGRAM_CROPS_BY_CAPTION[slide.caption];
      if (sourceCrop) {
        resolvedCrops[diagramId] = sanitizeCrop(sourceCrop);
      }
    });
  });

  return resolvedCrops;
};

const RESOLVED_SOURCE_DIAGRAM_CROPS_BY_ID = buildResolvedSourceDiagramCropsById();

export const normalizeDiagramCropOverrides = (rawValue: unknown): Record<string, DiagramCrop> => {
  const parsed = resolveOverridePayload(rawValue);
  if (!parsed || typeof parsed !== 'object') {
    return {};
  }

  const overrides: Record<string, DiagramCrop> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (!value || typeof value !== 'object') {
      continue;
    }

    const candidate = value as Partial<DiagramCrop>;
    if (
      typeof candidate.x !== 'number' ||
      typeof candidate.y !== 'number' ||
      typeof candidate.width !== 'number' ||
      typeof candidate.height !== 'number'
    ) {
      continue;
    }

    const migratedKey = LEGACY_OVERRIDE_KEY_TO_DIAGRAM_ID[key] ?? key;
    overrides[migratedKey] = sanitizeCrop({
      x: candidate.x,
      y: candidate.y,
      width: candidate.width,
      height: candidate.height,
    });
  }

  return overrides;
};

export const loadLessonDiagramDebugOverrides = (): Record<string, DiagramCrop> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const overrides = normalizeDiagramCropOverrides(JSON.parse(raw) as unknown);
    const normalizedRaw = JSON.stringify(overrides);
    if (normalizedRaw !== raw) {
      window.localStorage.setItem(LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY, normalizedRaw);
    }

    return overrides;
  } catch {
    return {};
  }
};

export const saveLessonDiagramDebugOverrides = (overrides: Record<string, DiagramCrop>): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY,
    JSON.stringify(normalizeDiagramCropOverrides(overrides)),
  );
};

export const getLessonDiagramCrop = (slide: DiagramSlide, overrideKey?: string): DiagramCrop | null => {
  const effectiveOverrideKey = overrideKey;
  if (effectiveOverrideKey) {
    const overrides = loadLessonDiagramDebugOverrides();
    const override = overrides[effectiveOverrideKey];
    if (override) {
      return override;
    }
  }

  return (
    RESOLVED_SOURCE_DIAGRAM_CROPS_BY_ID[slide.diagramId ?? effectiveOverrideKey ?? ''] ??
    LEGACY_SOURCE_DIAGRAM_CROPS_BY_CAPTION[slide.caption] ??
    null
  );
};

