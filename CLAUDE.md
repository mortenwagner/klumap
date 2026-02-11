# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KluMap is an interactive web tool that helps founders and innovation teams identify their riskiest business assumptions and generate AI prompts to validate them. It combines two original frameworks by Morten Wagner: **O-Rings of Innovation** (three concentric strategic layers: Opportunity → Offering → Operation) and **The Clueless Corner** (a 2×2 matrix mapping assumptions by Importance vs Evidence).

**Domain:** klumap.com | **Author:** Morten Wagner (mortenwagner.com)

## Current State

The project is in the **specification + artifact phase**. The full application has not been scaffolded yet. What exists:

- `klumap-spec-v2_1.md` — Complete product specification and implementation plan
- `artifacts/orings.jsx` — Standalone animated O-Rings visualization component
- `artifacts/clueless-corner.jsx` — Standalone animated Clueless Corner visualization component

These artifact components are proof-of-concept React components with inline styles, i18n support, and CSS keyframe animations. They are standalone demos, not part of the app build.

## Target Tech Stack

```
React 18 + Vite          # Framework & build tool
Tailwind CSS 3           # Styling
@dnd-kit/core+sortable   # Drag-and-drop (Screen 3)
jsPDF + html2canvas      # PDF export
Inter + JetBrains Mono   # UI font + monospace prompt font
React Context+useReducer # Single centralized state
```

## Build & Dev Commands (once scaffolded)

```bash
npm install
npm run dev              # localhost:5173
npm run build            # outputs to /dist
```

Deployment is FTP upload of `/dist` to one.com (klumap.com). Fully static — no server, no API calls, no cookies, no localStorage in v1.

## Architecture

### 5-Screen Linear Flow
0. **Welcome** — Single-viewport intro: O-Ring motif, tagline, how-it-works steps, privacy/open-source trust signals, CTA
1. **Venture Framing** — Name, description, stage selector
2. **Assumption Extraction** — Add assumptions per O-Ring layer with guided question chips
3. **Clueless Corner Mapping** — Drag assumptions onto 2×2 matrix (Importance × Evidence)
4. **Prompt Workshop** — Pick validation approaches, generate copy-paste-ready AI prompts

### State Management
Single `AppState` via React Context + `useReducer`. State lives in memory only (v1). Key types:

- `currentScreen`: `0 | 1 | 2 | 3 | 4` (0 = Welcome, excluded from progress bar)
- `venture`: `{ name, description, stage }` where stage is `idea | exploring | building | scaling`
- `assumptions`: Array of `{ id, text, ring, quadrant, position, selectedApproach, promptStyle, createdAt }`
- `ring` values: `opportunity | offering | operation`
- `quadrant` values: `clueless | validated | nice-to-know | known | null`
- `promptStyle` values: `focused | exploratory | devils-advocate`

### Privacy & Trust
Three touch-points: (1) Welcome screen primary trust statement, (2) persistent "Local only" indicator in bottom bar, (3) export context message on Screen 4. Open source GitHub link on welcome screen as verifiable trust signal.

### Help System
Embedded guidance (question chips, labels, gates) + contextual micro-copy per screen + on-demand `?` help panel (slide-out with framework explainer, worked example, tips). No tooltip tours or video tutorials in v1.

### Prompt System
Prompts are stored as JSON files in `src/data/prompts/` (one per validation approach, 10 total). Each has 3 template variants (focused, exploratory, devil's advocate). Templates use `{{assumption}}` interpolation plus venture context.

### Planned File Structure
```
src/
├── state/          # AppContext.jsx, reducer.js
├── screens/        # Welcome, VentureFraming, AssumptionExtraction, CluelessCorner, PromptWorkshop
├── components/     # ORingVisual, ORingMotif, AssumptionCard, Matrix, PromptDisplay,
│                   # ValidationPicker, HelpPanel, HelpButton, PrivacyIndicator, etc.
├── data/prompts/   # 10 JSON files (customer-conversations, smoke-test, wizard-of-oz, etc.)
├── utils/          # promptEngine.js, exportPDF.js, exportMarkdown.js
└── styles/         # globals.css (Tailwind base)
```

## Visual Design

- **Dark mode foundation**: deep navy/charcoal (`#0f0f1a` → `#1a1a2e`)
- **O-Ring accent colors**: Opportunity `#4ECDC4` (teal), Offering `#FFB347` (amber), Operation `#FF6B6B` (coral)
- Monospace font (JetBrains Mono) for generated prompts — reinforces "tool output" aesthetic
- Bold editorial typography, generous whitespace, gradient glows behind key visuals
- Responsive: mobile (<640px) stacked/swipeable, tablet (640-1024px) two-column, desktop (>1024px) full experience

## Implementation Plan

The spec defines 6 development sessions. See `klumap-spec-v2_1.md` section "Implementation Plan (Claude Code Sessions)" for the complete breakdown with acceptance criteria per session.

## Key Constraints

- No data leaves the browser — zero server calls, zero analytics (v1)
- Touch-friendly: 44px minimum tap targets, tap-to-assign as mobile alternative to drag-and-drop
- Minimum 3 assumptions required to proceed from Screen 2 → 3
- Minimum 1 assumption in Clueless Corner required to proceed from Screen 3 → 4
- The 10 validation approaches and guided questions are Morten's practitioner content — preserve the pedagogical intent when templating
