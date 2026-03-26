import type { Lesson } from './securityPlusLessons';

export const IDENTITY_PROTOCOLS_DEEP_DIVE_LESSON: Lesson = {
  id: '4-6-identity-protocols-deep-dive',
  title: 'Lesson 92A',
  subtitle: '4.6 - Identity Protocols Deep Dive',
  icon: 'ID',
  slides: [
    {
      type: 'intro',
      week: '4.6 - Identity Protocols Deep Dive',
      question:
        'How do LDAP, Kerberos, SAML, OAuth, OpenID Connect, and federation fit together in exam scenarios?',
      body: 'Identity questions are usually about picking the right protocol for the job and understanding the message flow well enough to recognize what failed. This supplement makes the directory, ticketing, claims, and token details explicit so the protocol names are not just memorized labels.',
    },
    {
      type: 'concept',
      title: 'LDAP, LDAPS, and Distinguished Names',
      body: '<p><strong>LDAP</strong> is the protocol used to query and update directory services. <strong>LDAPS</strong> is LDAP protected with TLS so credentials and directory data are not exposed in plaintext.</p><p>Directories are organized as a hierarchy derived from the <strong>X.500</strong> model. Objects are referenced with a <strong>distinguished name (DN)</strong>, such as <code>CN=Alice Smith,OU=Users,DC=corp,DC=example,DC=com</code>. The DN identifies exactly where the object lives in the directory tree.</p><p>Active Directory uses LDAP for directory lookups and updates even though the environment also relies heavily on Kerberos for logon and ticket-based access.</p>',
    },
    {
      type: 'concept',
      title: 'LDAP Injection and Safe Directory Queries',
      body: '<p><strong>LDAP injection</strong> occurs when user input is concatenated directly into an LDAP search filter or DN without proper escaping. An attacker can alter the intended query logic, broaden the search, or manipulate authentication checks.</p><p>Prevent it the same way you prevent other injection classes: use parameterized libraries when available, escape reserved LDAP characters, allowlist input format, and run directory binds and searches with least privilege. If a web application accepts usernames, emails, or OU values and turns them directly into LDAP filters, it is an injection surface.</p>',
    },
    {
      type: 'concept',
      title: 'Kerberos with KDC, TGT, AS, and TGS',
      body: '<p><strong>Kerberos</strong> is the default authentication protocol in Active Directory domains. The <strong>Key Distribution Center (KDC)</strong> contains the Authentication Service (AS) and Ticket Granting Service (TGS).</p><p>The user first authenticates to the AS and receives a <strong>Ticket Granting Ticket (TGT)</strong>. The user then presents that TGT to the TGS to request a <strong>service ticket</strong> for a specific server or application. The password itself is not sent around the network for each service access request, which is why Kerberos supports efficient single sign-on. Kerberos also depends on accurate time synchronization, because tickets are time-bound.</p>',
    },
    {
      type: 'concept',
      title: 'Kerberos Clock Skew and NTP',
      body: '<p>Kerberos is highly sensitive to time. Tickets are timestamped, and many environments reject authentication if the client and server clocks differ by more than about <strong>five minutes</strong>.</p><p>That is why <strong>NTP</strong> matters operationally: if system clocks drift or an attacker manipulates time synchronization, Kerberos logons can fail even when the username and password are correct. Security+ scenarios sometimes describe widespread authentication failure after time skew, and the expected answer is to check clock synchronization and NTP integrity.</p>',
    },
    {
      type: 'concept',
      title: 'SAML, Claims-Based Identity, OAuth, and OpenID Connect',
      body: '<p><strong>SAML</strong> is an XML-based standard commonly used for browser-based single sign-on. An Identity Provider issues a signed assertion that contains <strong>claims</strong> about the user, and a Service Provider trusts those claims to make an access decision. This is why SAML is often described as <strong>claims-based identity</strong>.</p><p><strong>OAuth</strong> is an authorization framework used heavily for APIs. It issues an <strong>access token</strong> that lets a client act within a limited scope on behalf of a user or service.</p><p><strong>OpenID Connect (OIDC)</strong> adds authentication on top of OAuth. In practice: OAuth answers what the client can access, while OIDC answers who the user is. JWTs are a common token format in modern OAuth and OIDC deployments.</p>',
    },
    {
      type: 'concept',
      title: 'Federation, Provisioning, and ABAC Context',
      body: '<p><strong>Federation</strong> extends identity trust across organizational boundaries. A partner company, SaaS provider, or cloud application can trust your identity provider instead of maintaining a separate password database.</p><p><strong>Provisioning and deprovisioning</strong> are the operational side of IAM: creating accounts, group memberships, device trust, and entitlements when people join or change roles, then removing access promptly when they leave. Provisioning mistakes create excess standing privilege.</p><p><strong>ABAC</strong> often works alongside these protocols by evaluating user, device, location, time, and data sensitivity attributes after authentication succeeds.</p>',
    },
    {
      type: 'bullets',
      title: 'Identity Protocols Deep Dive - Key Points',
      items: [
        '<strong>LDAP:</strong> directory query and update protocol; <strong>LDAPS:</strong> LDAP protected by TLS.',
        '<strong>X.500 DN:</strong> hierarchical identifier such as CN, OU, and DC components in a directory tree.',
        '<strong>LDAP injection:</strong> happens when input is inserted into directory filters or DNs without proper escaping.',
        '<strong>Kerberos:</strong> Active Directory ticket-based SSO using KDC, AS, TGT, TGS, and service tickets.',
        '<strong>Clock dependency:</strong> Kerberos tickets are time-sensitive; NTP failure or clock skew can break authentication.',
        '<strong>SAML:</strong> XML-based, claims-based SSO for federated web access.',
        '<strong>OAuth and OIDC:</strong> OAuth authorizes access with tokens; OIDC adds authentication and identity claims.',
        '<strong>Provisioning:</strong> joiner, mover, and leaver workflows are core IAM controls, not just HR tasks.',
      ],
    },
    {
      type: 'term',
      label: '4.6',
      term: 'Distinguished name (DN)',
      def: 'A full hierarchical identifier for an object in an X.500-style directory. A DN such as CN=Alice Smith,OU=Users,DC=corp,DC=example,DC=com uniquely identifies where the object exists in the directory tree.',
    },
    {
      type: 'check',
      q: 'A user signs in once to an Active Directory domain, receives a ticket that is later presented to obtain access to a file server without resending the password, and the domain controller issues the needed tickets. Which protocol is this?\n\n(A) LDAP\n(B) Kerberos\n(C) S/MIME\n(D) DNSSEC',
      a: 'B - Kerberos uses the KDC to issue a TGT first and then service tickets for specific resources. That ticketing model is what provides single sign-on inside an Active Directory environment.',
    },
    {
      type: 'summary',
      title: '4.6 Identity Protocols Deep Dive - Summary',
      points: [
        'LDAP and LDAPS cover directory lookup and update; DNs identify where an object lives in the X.500-style tree.',
        'Kerberos is the ticket-based SSO protocol behind Active Directory logon, using the KDC, TGT, and TGS workflow.',
        'SAML is claims-based federation for web SSO, while OAuth and OIDC dominate delegated authorization and modern API sign-in.',
        'Provisioning, deprovisioning, and ABAC are the operational and policy layers that make identity protocols usable in real environments.',
      ],
      cta: 'Continue into access control models and connect protocol authentication to the authorization decision that follows it.',
    },
  ],
};
