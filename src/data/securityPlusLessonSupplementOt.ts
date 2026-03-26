import type { Lesson } from './securityPlusLessons';

export const OT_IOT_DEEP_DIVE_LESSON: Lesson = {
  id: '3-1-ot-iot-deep-dive',
  title: 'Lesson 60A',
  subtitle: '3.1 - OT, ICS, and IoT Deep Dive',
  icon: 'OT',
  slides: [
    {
      type: 'intro',
      week: '3.1 - OT, ICS, and IoT Deep Dive',
      question:
        'Which OT and IoT components show up on Security+ scenarios, and why do they change the security priorities?',
      body: 'Operational technology uses specialized devices and networks to control physical processes. Security+ expects you to recognize the OT building blocks, know why industrial environments prioritize availability and integrity, and understand how IoT expands the attack surface into homes, factories, hospitals, and utilities.',
    },
    {
      type: 'concept',
      title: 'PLC, DCS, HMI, and Data Historian',
      body: '<p><strong>Programmable Logic Controllers (PLCs)</strong> directly control physical devices such as motors, valves, pumps, and relays. They read sensor input and trigger actuator output in control loops.</p><p><strong>Distributed Control Systems (DCS)</strong> coordinate many controllers across a plant. Instead of one standalone PLC doing everything, the DCS manages multiple control areas together.</p><p><strong>Human-Machine Interfaces (HMIs)</strong> are the operator consoles and software panels used to view alarms, change set points, and issue commands to controllers.</p><p><strong>Data historians</strong> aggregate long-term process data from the OT environment. They are critical for trend analysis, compliance, troubleshooting, and incident reconstruction because they show what process values changed and when.</p>',
    },
    {
      type: 'concept',
      title: 'Fieldbus, Industrial Ethernet, and OT Protocol Constraints',
      body: '<p>OT networks often use either <strong>fieldbus serial protocols</strong> or <strong>industrial Ethernet</strong>. Fieldbus links connect controllers, sensors, and actuators with deterministic timing and long equipment life cycles. Industrial Ethernet brings familiar switching and IP-based connectivity into factories but also imports more IT attack surface.</p><p>Many legacy OT protocols were designed for reliability and speed, not authentication or encryption. That means segmentation, jump hosts, allowlisted administration paths, and passive monitoring matter more than agent-heavy tooling. Patch windows are limited because taking a plant offline may interrupt production, safety systems, or utility delivery.</p>',
    },
    {
      type: 'concept',
      title: 'Purdue Model and OT Segmentation',
      body: '<p>The <strong>Purdue Model</strong> is the classic OT network hierarchy used to separate plant-floor operations from enterprise IT. Lower levels contain field devices, controllers, and process equipment. Higher levels contain supervisory systems, site operations, and business IT services.</p><p>The exam takeaway is architectural: do not treat an ICS network as one flat LAN. Segment between levels, tightly control crossings between OT and IT, and place monitoring, jump hosts, and remote-access controls at the boundaries. The Purdue Model gives you the mental map for where those trust boundaries belong.</p>',
    },
    {
      type: 'concept',
      title: 'RTOS, Critical Infrastructure, and the AIC Triad',
      body: '<p><strong>RTOS (Real-Time Operating System)</strong> platforms execute tasks within strict timing windows. Missing a deadline in a medical device, industrial safety controller, or vehicle control system can cause physical harm.</p><p>OT commonly protects <strong>critical infrastructure</strong> such as power, water, transportation, manufacturing, and building automation. In these environments, the security priority is often the <strong>AIC triad</strong>: availability first, integrity second, confidentiality third. A brief outage can stop production lines, damage equipment, or disrupt public services, so security controls must avoid introducing unstable latency or unnecessary downtime.</p>',
    },
    {
      type: 'concept',
      title: 'IoT Scenarios, Mirai, and Common Weaknesses',
      body: '<p>Security+ scenarios can involve <strong>smart home devices</strong>, cameras, environmental sensors, badge readers, and <strong>medical IoT</strong> such as infusion pumps or patient monitors. These devices are frequently low-cost, internet reachable, and difficult to patch.</p><p>The <strong>Mirai botnet</strong> is the classic example: it scanned the internet for IoT systems still using default credentials, then conscripted them into large denial-of-service attacks. The lesson is broader than one malware family: weak defaults, short support cycles, exposed management interfaces, and flat networks make IoT compromise scale quickly.</p>',
    },
    {
      type: 'concept',
      title: 'How to Harden OT and IoT Environments',
      body: '<p>Best practice is to keep OT and IoT off the public internet, isolate them from enterprise IT with firewalls or dedicated VLANs, disable unused services, change default credentials immediately, and control vendor access through jump boxes with logging. Prefer passive monitoring where active scanning could disrupt fragile controllers. Maintain spares, backups of controller logic, and a current asset inventory so recovery does not depend on guesswork during an outage.</p>',
    },
    {
      type: 'bullets',
      title: 'OT and IoT Deep Dive - Key Points',
      items: [
        '<strong>PLC:</strong> direct control logic for actuators and sensors; <strong>DCS:</strong> coordinated plant-wide control.',
        '<strong>HMI:</strong> operator interface for alarms and commands; <strong>data historian:</strong> long-term OT telemetry store.',
        '<strong>OT networking:</strong> fieldbus and industrial Ethernet favor reliability and timing over built-in security.',
        '<strong>Purdue Model:</strong> layered OT hierarchy used to separate plant-floor systems from supervisory and enterprise networks.',
        '<strong>AIC triad:</strong> OT often prioritizes availability and integrity before confidentiality.',
        '<strong>IoT risk:</strong> weak defaults, short patch support, and internet exposure made Mirai-style compromise possible.',
        '<strong>Hardening:</strong> segment IT from OT, restrict vendor paths, minimize services, and avoid risky active scanning.',
      ],
    },
    {
      type: 'term',
      label: '3.1',
      term: 'Data historian',
      def: 'An OT system that collects and stores process values over time from controllers, sensors, and other industrial devices. Data historians support troubleshooting, compliance, trend analysis, and incident reconstruction because they preserve what the industrial process was doing before, during, and after an event.',
    },
    {
      type: 'check',
      q: 'An incident response team is investigating abnormal pressure changes in a water treatment facility. Which OT system would be MOST useful for reconstructing the sequence of process values that changed over time?\n\n(A) Human-Machine Interface console\n(B) Data historian\n(C) VPN concentrator\n(D) Web application firewall',
      a: 'B - A data historian stores time-series process data from the OT environment, making it the best source for reconstructing how pressure, flow, and related control values changed. An HMI shows current operator views, but the historian is the long-term forensic record.',
    },
    {
      type: 'summary',
      title: '3.1 OT, ICS, and IoT Deep Dive - Summary',
      points: [
        'Know the OT components: PLCs control devices, DCS coordinates plant-wide control, HMIs drive operator interaction, and data historians retain process telemetry.',
        'Fieldbus and industrial Ethernet enable industrial communications, but many OT protocols were not built with strong security primitives.',
        'The Purdue Model is the standard mental model for layering OT zones and controlling trust boundaries between plant systems and enterprise IT.',
        'OT often uses the AIC triad because outages and bad process values can cause physical damage or public disruption.',
        'Mirai is the exam-favorite IoT case study for default credentials, exposed services, and large-scale compromise.',
      ],
      cta: 'Return to 3.2 secure infrastructure topics and connect OT segmentation decisions to the specialized environments they protect.',
    },
  ],
};
