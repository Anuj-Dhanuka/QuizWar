# Security Policy

QuizWar is an independent portfolio and learning project. It is not an actively
supported commercial service and does not provide an enterprise security
response SLA.

## Reporting a Vulnerability

Please do not open a public issue containing vulnerability details, credentials,
personal data, or reproduction steps that could put users or infrastructure at
risk.

Instead, contact the maintainer privately through a professional channel linked
from [Anuj Dhanuka's portfolio](https://anujdhanuka.com). Include the affected
component, impact, and the minimum reproduction details needed to investigate.

## Firebase Deployments

Firebase mobile client configuration is not an administrator credential. The
security boundary for a deployment includes its Firestore and Storage rules,
Authentication settings, API restrictions, and handling of server-side
credentials. Anyone deploying a fork is responsible for reviewing those controls
in their own Firebase and Google Cloud projects.
