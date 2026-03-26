import type { Lesson } from './securityPlusLessons';

export const VPN_NAC_DEEP_DIVE_LESSON: Lesson = {
  id: '3-2-vpn-and-nac-deep-dive',
  title: 'Lesson 67A',
  subtitle: '3.2 - VPN and NAC Deep Dive',
  icon: 'VN',
  slides: [
    {
      type: 'intro',
      week: '3.2 - VPN and NAC Deep Dive',
      question:
        'How do VPN design choices and NAC enforcement details change the security outcome of remote and local network access?',
      body: 'The base communication lessons cover the major technologies, but exam scenarios often hinge on the operational details: which VPN type fits the user or site, whether split tunneling is allowed, and how a NAC platform evaluates endpoint health before granting access.',
    },
    {
      type: 'concept',
      title: 'Remote Access vs Site-to-Site VPN',
      body: '<p><strong>Remote access VPN</strong> connects an individual user device to the organization. On Security+, this is commonly a <strong>TLS/SSL VPN</strong> running over TCP 443 for roaming users and home offices.</p><p><strong>Site-to-site VPN</strong> connects two fixed networks through gateway devices. This is commonly an <strong>IPsec VPN</strong>, where each site firewall or concentrator handles encryption for the local network.</p><p>The exam shortcut is: individual user from anywhere usually means remote access TLS VPN; branch office to headquarters usually means site-to-site IPsec.</p>',
    },
    {
      type: 'concept',
      title: 'IPsec vs TLS VPN Behavior',
      body: '<p><strong>IPsec</strong> works at the network layer and is well suited to permanent network-to-network tunnels. It is strong for inter-site connectivity because entire subnets can traverse the tunnel transparently.</p><p><strong>TLS VPN</strong> works at the application or session layer and is easier for remote clients because it traverses common firewall rules and often needs only a lightweight client or browser support. Both provide confidentiality in transit, but they fit different operational models.</p>',
    },
    {
      type: 'concept',
      title: 'Split Tunneling, Full Tunneling, and Always-On VPN',
      body: '<p><strong>Split tunneling</strong> sends only corporate-destined traffic through the VPN while internet traffic goes out directly through the user local connection. It improves performance and reduces concentrator load, but it also creates risk because the endpoint is simultaneously connected to the trusted network and the open internet.</p><p><strong>Full tunneling</strong> sends all traffic through the VPN for centralized inspection and policy enforcement. <strong>Always-on VPN</strong> forces the encrypted connection to come up automatically, often before user logon, so the device does not operate outside policy coverage.</p>',
    },
    {
      type: 'concept',
      title: 'NAC as a System: Posture, Agents, and Quarantine',
      body: '<p><strong>Network Access Control (NAC)</strong> is broader than 802.1X authentication alone. A NAC platform can authenticate a device or user, evaluate posture, place the device on the correct VLAN, and quarantine non-compliant systems until remediation is complete.</p><p>Common posture checks include patch level, EDR status, disk encryption, certificate validity, and host firewall state. NAC deployments may use <strong>persistent agents</strong> for continuous monitoring, <strong>dissolvable agents</strong> for on-demand checks, or <strong>agentless NAC</strong> tied to directory or login events. The point is to decide not just who the device is, but whether it is healthy enough to join the network.</p>',
    },
    {
      type: 'concept',
      title: 'RADIUS vs TACACS+',
      body: '<p><strong>RADIUS</strong> is commonly used for network access authentication such as VPN and 802.1X. It typically uses <strong>UDP</strong> and historically encrypts only the password field rather than the full payload.</p><p><strong>TACACS+</strong> is commonly used for administrative access to network devices. It uses <strong>TCP port 49</strong>, encrypts the entire payload, and cleanly separates authentication, authorization, and accounting. The exam rule of thumb is simple: RADIUS is common for user network access; TACACS+ is preferred for router, switch, and firewall administration.</p>',
    },
    {
      type: 'concept',
      title: 'Layer 2 Switch Hardening',
      body: '<p><strong>PortFast</strong> lets an access port skip the long Spanning Tree transition states so a workstation can come online quickly. It should be used on end-device access ports, not on links where another switch might appear.</p><p><strong>BPDU Guard</strong> shuts down a PortFast port if it receives a spanning tree BPDU, preventing a rogue switch from influencing root-bridge elections.</p><p><strong>VLAN hopping</strong> is the classic Layer 2 attack to know. In a double-tagging scenario, an attacker abuses the native VLAN on a trunk to jump traffic into another VLAN. Mitigate it by changing the native VLAN away from VLAN 1, pruning unused VLANs, disabling unused trunk ports, and using access ports for end devices.</p>',
    },
    {
      type: 'bullets',
      title: 'VPN and NAC Deep Dive - Key Points',
      items: [
        '<strong>Remote access VPN:</strong> one user device to the organization, commonly using TLS over port 443.',
        '<strong>Site-to-site VPN:</strong> gateway-to-gateway tunnel, commonly using IPsec between fixed networks.',
        '<strong>Split tunneling:</strong> improves performance but weakens centralized inspection and increases dual-homed endpoint risk.',
        '<strong>Full tunnel:</strong> sends all traffic through the VPN so policy and logging stay centralized.',
        '<strong>NAC:</strong> combines authentication, posture assessment, VLAN placement, and quarantine decisions.',
        '<strong>TACACS+ vs RADIUS:</strong> TACACS+ uses TCP 49 and encrypts the full payload; RADIUS commonly uses UDP and is common for user network access.',
        '<strong>Layer 2 hardening:</strong> PortFast on access ports, BPDU Guard against rogue switches, and native-VLAN controls to stop VLAN hopping.',
        '<strong>Agent models:</strong> persistent, dissolvable, and agentless NAC each trade off visibility, overhead, and deployment friction.',
      ],
    },
    {
      type: 'term',
      label: '3.2',
      term: 'Split tunneling',
      def: 'A VPN configuration where only traffic destined for corporate resources is sent through the encrypted tunnel while other traffic, such as general internet browsing, uses the local network path directly. It improves efficiency but reduces centralized inspection and increases risk from untrusted networks.',
    },
    {
      type: 'check',
      q: 'A company wants branch offices to maintain a permanent encrypted tunnel to headquarters, while remote employees should connect individually from hotels and home networks using a lightweight client over TCP 443. Which pairing BEST fits those requirements?\n\n(A) Branch offices use TLS VPN; remote users use IPsec site-to-site\n(B) Branch offices use IPsec site-to-site; remote users use TLS remote access VPN\n(C) Both use split tunneling only\n(D) Both use agentless NAC instead of VPN',
      a: 'B - Fixed network-to-network connectivity fits IPsec site-to-site VPN, while roaming users typically fit TLS remote access VPN over port 443.',
    },
    {
      type: 'summary',
      title: '3.2 VPN and NAC Deep Dive - Summary',
      points: [
        'IPsec and TLS both secure traffic, but IPsec usually fits site-to-site tunnels while TLS fits remote user access.',
        'Split tunneling is a performance tradeoff that reduces centralized visibility and increases endpoint risk.',
        'Always-on and full-tunnel VPN designs give the organization more consistent inspection and policy control.',
        'NAC is a full access-decision system, not just 802.1X authentication at a port.',
      ],
      cta: 'Return to secure communication and endpoint topics to connect tunnel design, posture assessment, and remote user risk into one access model.',
    },
  ],
};
