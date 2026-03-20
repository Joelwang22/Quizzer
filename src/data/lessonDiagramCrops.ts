import type { DiagramSlide } from './securityPlusLessons';

export interface DiagramCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY = 'lesson_diagram_debug_overrides';

const DIAGRAM_CROPS: Record<string, DiagramCrop> = {
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
  'Jump server securing management traffic — privileged admin sessions routed through hardened bastion host': {
    x: 0.08,
    y: 0.18,
    width: 0.84,
    height: 0.26,
  },
  'Volatility framework — process list extracted from a live memory dump': {
    x: 0.12,
    y: 0.29,
    width: 0.76,
    height: 0.36,
  },
};

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

const loadDiagramDebugOverrides = (): Record<string, DiagramCrop> => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
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

      overrides[key] = sanitizeCrop({
        x: candidate.x,
        y: candidate.y,
        width: candidate.width,
        height: candidate.height,
      });
    }

    return overrides;
  } catch {
    return {};
  }
};

export const getLessonDiagramCrop = (slide: DiagramSlide, overrideKey?: string): DiagramCrop | null => {
  if (overrideKey) {
    const overrides = loadDiagramDebugOverrides();
    const override = overrides[overrideKey];
    if (override) {
      return override;
    }
  }

  return DIAGRAM_CROPS[slide.caption] ?? null;
};
