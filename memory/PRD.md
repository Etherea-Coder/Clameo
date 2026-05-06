# Clameo — Product Requirements Document

## Original problem statement
Premium French landing page for Clameo (clameo.fr) — a legal-letter generator. SPA only, no backend, no auth, no DB for MVP. 6 case templates, multi-step builder with case-specific questions, result page with PDF + copy + print.

## Architecture
- Pure React SPA (frontend only). Routes: `/`, `/builder`, `/builder/:caseType`, `/result`.
- Letter data persists between Builder and Result via `sessionStorage`.
- Client-side PDF via `jspdf`. Print via `window.print()`. Copy via `navigator.clipboard`.

## User personas
- Particuliers français en litige avec un commerçant, propriétaire, employeur ou organisme; non-juristes voulant écrire une lettre formelle rapidement.

## Core requirements (static)
- Confident Civic style: paper #f7f5f0, ink #1a1f2e, amber #e8a020, sage #4a7c59. No gradients.
- Typography: Instrument Serif (display/logo), Plus Jakarta Sans (UI), Courier Prime (letter preview).
- 6 cases: remboursement, logement, non-livre, mise-en-demeure, employeur, rgpd.

## Implemented (2025-12)
- Landing: header w/ logo + nav + theme toggle (visual-only) + amber CTA, hero (left-aligned headline + floating letter mockup), trust strip, 6 use-case cards, How it works (01/02/03), reassurance, FAQ accordion (shadcn), footer with disclaimer.
- Builder: case picker + multi-step form with case-specific questions, progress bar, step counter, required-field validation.
- Result: monospace letter preview with amber top border, PDF download, copy-to-clipboard with toast, print.
- Custom Clameo logo (balance with 2 small papers vs 1 bigger block, amber dot).
- Mobile responsive (hamburger menu).

## Backlog
- P1: Real-functional dark mode (currently visual toggle only).
- P1: Add stable non-accented `value` attributes to `<option>` for easier automation/SDET.
- P2: Letter preview live edit on result page.
- P2: i18n (currently FR only).
- P2: Save/email letter, share link.
- P2: More templates (consommation, voisinage, banque…).
