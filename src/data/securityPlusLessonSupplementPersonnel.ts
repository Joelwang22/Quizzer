import type { Lesson } from './securityPlusLessons';

export const PERSONNEL_SECURITY_OPERATIONS_LESSON: Lesson = {
  id: '5-6-personnel-security-operations',
  title: 'Lesson 113A',
  subtitle: '5.6 - Personnel Security and Awareness Operations',
  icon: 'PS',
  slides: [
    {
      type: 'intro',
      week: '5.6 - Personnel Security and Awareness Operations',
      question:
        'What personnel processes reduce human risk before, during, and after someone has access to the environment?',
      body: 'Security awareness is only one part of personnel risk management. Security+ also expects you to understand joiner and leaver workflows, background checks, how training programs are designed and measured, and how organizations recognize risky behavior before it becomes a reportable incident.',
    },
    {
      type: 'concept',
      title: 'Onboarding and Offboarding Workflow',
      body: '<p><strong>Onboarding</strong> should be deliberate: verify the role, create the correct account set, assign only the needed groups, issue hardware, capture policy acknowledgements, and confirm the user completed required training before production access is granted.</p><p><strong>Offboarding</strong> must be at least as disciplined. Disable accounts promptly, revoke tokens, recover badges and devices, remove group memberships, rotate shared credentials if needed, and coordinate with HR and managers so the access cut-off matches the departure event. In many environments accounts are disabled first and retained temporarily for evidence, mail forwarding, or legal hold instead of being deleted immediately.</p>',
    },
    {
      type: 'concept',
      title: 'Background Checks and Legal Scope',
      body: '<p><strong>Background checks</strong> are risk-based and role-dependent. Organizations may review employment history, identity, references, criminal records, or financial history depending on the sensitivity of the role and local law.</p><p>The key exam idea is proportionality: use the minimum legally appropriate check for the role, repeat it when policy or regulation requires periodic re-screening, and ensure privacy and labor-law requirements are respected. Highly privileged administrators and people with access to regulated data usually receive deeper scrutiny than general staff.</p>',
    },
    {
      type: 'concept',
      title: 'Training Lifecycle and Simulated Phishing',
      body: '<p>Effective awareness programs follow a cycle: <strong>assess</strong> the current risk and audience, <strong>design</strong> the material for the role, <strong>deliver</strong> it in a usable format, and <strong>measure</strong> whether behavior changes afterward.</p><p><strong>Simulated phishing campaigns</strong> are a measurement tool, not the whole program. They show who clicks, who reports suspicious mail, which departments need extra coaching, and whether previous training improved performance. Security+ scenarios often test whether you can distinguish training delivery from training effectiveness metrics.</p>',
    },
    {
      type: 'concept',
      title: 'Gamification and Immersive Training Delivery',
      body: '<p>Not every awareness program should be a static slide deck. <strong>Gamification</strong> uses engagement tools such as capture-the-flag exercises, branching narrative scenarios, scoreboards, and simulated 3D environments to make security concepts memorable.</p><p>The exam point is not that gamification replaces policy training, but that it is a recognized delivery mechanism. It can improve participation and retention when used alongside phishing simulations, classroom content, and role-specific training.</p>',
    },
    {
      type: 'concept',
      title: 'Behavioral Recognition and Insider Risk Indicators',
      body: '<p>Behavioral recognition looks for <strong>risky</strong>, <strong>unexpected</strong>, or <strong>unintentional</strong> behavior that may signal insider threat, account compromise, or training failure. Examples include unusual after-hours access, sudden mass downloads, repeated policy circumvention, hostility after disciplinary action, attempts to bypass separation of duties, or repeated sharing of sensitive data through unapproved channels.</p><p>Users, managers, HR, and security operations all play a role. Human reporting plus technical telemetry such as UEBA gives better coverage than either one alone.</p>',
    },
    {
      type: 'concept',
      title: 'NDAs and Third-Party Agreements',
      body: '<p><strong>Non-disclosure agreements (NDAs)</strong> protect trade secrets, internal plans, sensitive data, and other confidential information. They apply not only to employees but also to contractors, service providers, and partner organizations.</p><p>Security questions often hinge on scope: if a third party will see sensitive data, the confidentiality requirements need to be explicit in the agreement set, not left as an assumption. NDAs are one control in a broader third-party risk program; they do not replace least privilege, monitoring, or access reviews.</p>',
    },
    {
      type: 'bullets',
      title: 'Personnel Security and Awareness Operations - Key Points',
      items: [
        '<strong>Onboarding:</strong> grant only the required accounts, devices, and training-backed access for the role.',
        '<strong>Offboarding:</strong> disable accounts, revoke tokens, recover assets, and coordinate timing with HR and management.',
        '<strong>Background checks:</strong> role-based and legally scoped; deeper checks fit higher-risk positions.',
        '<strong>Training lifecycle:</strong> assess, design, deliver, and measure rather than treating awareness as a one-time event.',
        '<strong>Gamification:</strong> CTFs, branching scenarios, and immersive simulations can improve awareness engagement.',
        '<strong>Simulated phishing:</strong> measures reporting and click behavior so follow-up training can be targeted.',
        '<strong>Behavioral recognition:</strong> risky, unexpected, and unintentional actions can all signal insider risk.',
        '<strong>NDAs:</strong> formal confidentiality agreements for employees, vendors, and partners.',
      ],
    },
    {
      type: 'check',
      q: 'An employee resigns and will leave at 5:00 PM today. Which action is MOST important to complete as part of secure offboarding?\n\n(A) Delete all historical email immediately\n(B) Disable accounts and revoke access tokens at the planned separation time\n(C) Issue a new NDA for the departed employee\n(D) Remove the employee from the awareness mailing list next month',
      a: 'B - The primary security objective in offboarding is timely access revocation. Disabling accounts and revoking tokens at the right time prevents continued access while preserving evidence and business records as needed.',
    },
    {
      type: 'summary',
      title: '5.6 Personnel Security and Awareness Operations - Summary',
      points: [
        'Personnel security starts before access is granted and continues through the offboarding event.',
        'Background checks, access provisioning, and NDAs are administrative controls that reduce exposure before a technical incident occurs.',
        'Training programs should be measured with role-appropriate metrics such as phishing results and suspicious-email reporting rates.',
        'Behavioral recognition works best when human observation and technical monitoring reinforce each other.',
      ],
      cta: 'Continue into user training topics and connect personnel process controls with the day-to-day behaviors users must follow.',
    },
  ],
};
