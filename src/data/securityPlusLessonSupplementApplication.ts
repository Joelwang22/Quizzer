import type { Lesson } from './securityPlusLessons';

export const APPLICATION_SECURITY_DEEP_DIVE_LESSON: Lesson = {
  id: '4-5-application-security-deep-dive',
  title: 'Lesson 90A',
  subtitle: '4.5 - Application and Email Security Deep Dive',
  icon: 'AP',
  slides: [
    {
      type: 'intro',
      week: '4.5 - Application and Email Security Deep Dive',
      question: 'Which application-layer protections show up on Security+ scenarios beyond SPF, DKIM, and DMARC?',
      body: 'Security+ application security questions commonly mix web security, API security, secure email transport, DNS trust, and modern deployment models. This supplement fills in the WAF, API gateway, secure email protocol, DNSSEC, tokenization, and container topics that are only lightly referenced in the base lessons.',
    },
    {
      type: 'concept',
      title: 'WAF and API Gateway Responsibilities',
      body: '<p><strong>Web Application Firewalls (WAFs)</strong> sit in front of web applications and inspect HTTP or HTTPS traffic for attacks such as SQL injection, cross-site scripting, directory traversal, malformed headers, and suspicious file uploads. They are a compensating control, not a replacement for fixing vulnerable code.</p><p><strong>API gateways</strong> are the centralized control point for APIs and microservices. They handle authentication, authorization, TLS termination, schema validation, rate limiting, logging, and request routing. A WAF focuses on malicious web payloads; an API gateway focuses on policy enforcement and traffic management for API consumers.</p>',
    },
    {
      type: 'concept',
      title: 'API Security, OAuth Tokens, and JWT Claims',
      body: '<p>APIs should use strong authentication such as scoped <strong>OAuth access tokens</strong>, service accounts, or mutual TLS instead of long-lived shared secrets. Access tokens should be short-lived and limited to the minimum scope needed.</p><p><strong>JWTs</strong> often carry token claims such as subject, issuer, audience, expiration, and scope. APIs must verify the token signature and validate the claims, not just decode the payload. Rate limiting, input validation, and API key rotation still matter even when OAuth is present.</p>',
    },
    {
      type: 'concept',
      title: 'Secure Email Protocols, SMTP Ports, and STARTTLS',
      body: '<p>Know the secure mail ports and roles together: <strong>SMTP port 25</strong> is traditionally used for server-to-server mail relay, <strong>SMTP submission port 587</strong> is for client-to-server message submission and commonly upgrades to TLS with <strong>STARTTLS</strong>, and <strong>SMTPS port 465</strong> uses implicit TLS from the start. <strong>IMAPS</strong> uses TCP 993 and <strong>POP3S</strong> uses TCP 995.</p><p><strong>STARTTLS</strong> upgrades an existing plaintext SMTP, IMAP, or LDAP session to TLS after the initial connection. It is different from implicit TLS, where the secure session is established before application commands are exchanged. Security+ questions often test whether you can distinguish a secure port from a plaintext protocol upgraded with STARTTLS.</p>',
    },
    {
      type: 'concept',
      title: 'SFTP vs FTPS',
      body: '<p><strong>SFTP</strong> is the SSH File Transfer Protocol. It runs over <strong>SSH on port 22</strong> and uses a single encrypted channel for commands and data.</p><p><strong>FTPS</strong> is FTP protected by <strong>TLS</strong>. It may use <strong>implicit FTPS on port 990</strong> or <strong>explicit FTPS (FTPES)</strong> where the client connects to port 21 and upgrades the session with the <code>AUTH TLS</code> command. The exam point is that SFTP is SSH-based and not FTP at all, while FTPS is still FTP with TLS wrapped around it.</p>',
    },
    {
      type: 'concept',
      title: 'S/MIME, PGP, and DNSSEC',
      body: '<p><strong>S/MIME</strong> secures email with X.509 certificates so messages can be encrypted and digitally signed. It fits managed enterprise PKI environments.</p><p><strong>PGP</strong> also protects email confidentiality and authenticity, but it is commonly taught as a user-centric trust model rather than a centrally managed enterprise certificate hierarchy.</p><p><strong>DNSSEC</strong> adds digital signatures to DNS records and relies on a chain of trust from the DNS root downward. It protects against spoofed or poisoned DNS responses by validating that the answer really came from the authoritative zone.</p>',
    },
    {
      type: 'concept',
      title: 'Tokenization, Data Masking, Containers, and Microservices',
      body: '<p><strong>Tokenization</strong> substitutes sensitive production data with a non-sensitive token and stores the real value in a secure vault. It is common in payment systems.</p><p><strong>Data masking</strong> hides parts of the original value so developers, analysts, or support staff can work with realistic-looking data without exposing the full secret.</p><p><strong>Container and microservice security</strong> changes the attack surface. Containers share the host kernel, so hardened images, patching the host, scanning images, protecting secrets, and controlling east-west traffic between services all matter. Microservices depend on APIs, making the API gateway and service-to-service authentication central security boundaries.</p>',
    },
    {
      type: 'bullets',
      title: 'Application and Email Security Deep Dive - Key Points',
      items: [
        '<strong>WAF:</strong> inspects HTTP or HTTPS traffic for web attacks such as SQLi, XSS, traversal, and hostile uploads.',
        '<strong>API gateway:</strong> central enforcement point for authentication, rate limiting, logging, and request routing.',
        '<strong>SMTP roles:</strong> port 25 for relay, port 587 for client submission with STARTTLS, port 465 for implicit TLS SMTPS.',
        '<strong>SFTP vs FTPS:</strong> SFTP uses SSH on port 22; FTPS uses TLS with implicit 990 or explicit TLS on port 21.',
        '<strong>S/MIME and PGP:</strong> both secure email; S/MIME aligns with enterprise PKI and PGP is commonly taught as a different trust model.',
        '<strong>DNSSEC:</strong> signed DNS data prevents cache poisoning and spoofed responses through chain-of-trust validation.',
        '<strong>Tokenization vs masking:</strong> tokenization replaces the value entirely; masking obscures part of the original data.',
        '<strong>Containers:</strong> protect the host, scan images, control secrets, and secure service-to-service traffic.',
      ],
    },
    {
      type: 'term',
      label: '4.5',
      term: 'STARTTLS',
      def: 'A command used by protocols such as SMTP, IMAP, and LDAP to upgrade an existing plaintext connection to TLS. It differs from implicit TLS, where encryption is established before the application protocol exchanges normal commands.',
    },
    {
      type: 'check',
      q: 'An organization wants one control in front of its public REST APIs to enforce OAuth token validation, apply rate limits, log requests, and route traffic to multiple backend services. Which solution BEST matches that requirement?\n\n(A) Web application firewall\n(B) API gateway\n(C) Data loss prevention appliance\n(D) Sandboxing',
      a: 'B - An API gateway is designed to centralize token validation, routing, rate limiting, and logging for API traffic. A WAF may still help, but the gateway is the primary control described in the scenario.',
    },
    {
      type: 'summary',
      title: '4.5 Application and Email Security Deep Dive - Summary',
      points: [
        'WAFs protect web applications from hostile payloads, while API gateways centralize API authentication and policy enforcement.',
        'Secure email transport questions often test STARTTLS versus implicit TLS and the secure ports for SMTPS, IMAPS, and POP3S.',
        'S/MIME, PGP, and DNSSEC all rely on trust and validation, but they solve different application-layer problems.',
        'Tokenization, masking, and container hardening are common modern application-security scenario topics.',
      ],
      cta: 'Return to endpoint and identity topics and connect API and email controls to the users, devices, and services that rely on them.',
    },
  ],
};
