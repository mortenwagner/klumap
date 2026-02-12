# Session 4: Prompt Workshop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Screen 4 — the Prompt Workshop where users select validation approaches for their Clueless Corner assumptions and get copy-paste-ready AI prompts.

**Architecture:** A sidebar lists Clueless Corner assumptions. The main area shows the selected assumption's prompt workspace: a validation approach picker (card grid), a prompt style toggle (focused/exploratory/devil's advocate), and the rendered prompt in a monospace display with copy-to-clipboard. Prompts are JSON template files with `{{assumption}}` interpolation plus venture context. A simple `promptEngine.js` utility handles template rendering.

**Tech Stack:** React 18, Tailwind CSS 3, existing AppContext state, JSON prompt templates

---

## Context for the implementer

### Existing state shape (`src/state/reducer.js`)
Each assumption already has:
- `selectedApproach: null` — string ID of chosen validation approach
- `promptStyle: 'focused'` — one of `focused | exploratory | devils-advocate`

The `UPDATE_ASSUMPTION` action with `{ id, updates }` can set both fields. No new reducer actions needed.

### Venture data (`state.venture`)
- `name` — venture name
- `description` — one-liner
- `stage` — `idea | exploring | building | scaling`

### Ring data (`src/data/guided-questions.json`)
- Each ring has `label`, `subtitle`, `color`

### Who reaches this screen
Only assumptions with `quadrant === 'clueless'` are shown. Gate on Screen 3 ensures ≥1 exists.

---

## Task 1: Create prompt template JSON files

**Files:**
- Create: `src/data/prompts/customer-conversations.json`
- Create: `src/data/prompts/smoke-test.json`
- Create: `src/data/prompts/wizard-of-oz.json`
- Create: `src/data/prompts/concierge-mvp.json`
- Create: `src/data/prompts/data-mining.json`
- Create: `src/data/prompts/expert-review.json`
- Create: `src/data/prompts/analogous-scanning.json`
- Create: `src/data/prompts/prototype-storyboard.json`
- Create: `src/data/prompts/presale-loi.json`
- Create: `src/data/prompts/technical-spike.json`
- Create: `src/data/prompts/index.js` (barrel export)

Each JSON file follows this structure:
```json
{
  "id": "customer-conversations",
  "name": "Customer Conversations",
  "icon": "🎤",
  "shortDescription": "Structured problem interviews",
  "bestFor": "Desirability assumptions — do people actually have this problem?",
  "ringAffinity": ["opportunity", "offering"],
  "promptVariants": {
    "focused": {
      "template": "Help me design a focused customer interview to test this assumption.\n\nI need:\n1. A screening criteria — who exactly should I talk to?\n2. Five open-ended questions that would reveal whether {{assumption}} is true, WITHOUT leading the interviewee\n3. What specific responses would VALIDATE this assumption?\n4. What responses would be a KILL SIGNAL — evidence that this assumption is wrong?\n5. How many conversations do I need for reasonable confidence?"
    },
    "exploratory": {
      "template": "I want to deeply explore whether {{assumption}} is true. Help me think broadly:\n1. Who are the different stakeholder groups that might have insight on this?\n2. For each group, what would I ask and what might I learn?\n3. What adjacent problems or behaviors should I look for that might indirectly validate or invalidate this?\n4. What existing communities, forums, or data sources could I observe before talking to anyone?\n5. Design a 2-week discovery plan mixing observation and conversation."
    },
    "devils-advocate": {
      "template": "Play devil's advocate on my assumption that {{assumption}}.\n1. Give me the 3 strongest reasons this assumption is probably WRONG\n2. What cognitive biases might be making me believe this?\n3. Who would disagree with this assumption most strongly, and what would their argument be?\n4. What's the most common way ventures fail when they hold this exact type of assumption?\n5. If I had to bet AGAINST this assumption, where would I find the evidence?"
    }
  }
}
```

Create all 10 files with approach-specific templates. Each approach should have meaningfully different questions tailored to that validation method. The `ringAffinity` field suggests which O-Ring layers this approach is best suited for (informational, not enforced).

The barrel export `src/data/prompts/index.js`:
```js
import customerConversations from './customer-conversations.json'
import smokeTest from './smoke-test.json'
import wizardOfOz from './wizard-of-oz.json'
import concierge from './concierge-mvp.json'
import dataMining from './data-mining.json'
import expertReview from './expert-review.json'
import analogousScanning from './analogous-scanning.json'
import prototypeStoryboard from './prototype-storyboard.json'
import presaleLoi from './presale-loi.json'
import technicalSpike from './technical-spike.json'

const approaches = [
  customerConversations,
  smokeTest,
  wizardOfOz,
  concierge,
  dataMining,
  expertReview,
  analogousScanning,
  prototypeStoryboard,
  presaleLoi,
  technicalSpike,
]

export default approaches
export const approachById = Object.fromEntries(approaches.map(a => [a.id, a]))
```

**Commit:** `feat: add 10 validation approach prompt templates`

---

## Task 2: Create prompt engine utility

**Files:**
- Create: `src/utils/promptEngine.js`

A simple function that takes an assumption, venture data, ring data, approach, and style, then returns the rendered prompt string.

```js
import { approachById } from '../data/prompts'
import guidedQuestions from '../data/guided-questions.json'

const STAGE_LABELS = {
  idea: 'idea',
  exploring: 'exploring',
  building: 'building',
  scaling: 'scaling',
}

export function generatePrompt({ assumption, venture, approachId, style }) {
  const approach = approachById[approachId]
  if (!approach) return ''

  const variant = approach.promptVariants[style]
  if (!variant) return ''

  const ringData = guidedQuestions[assumption.ring]
  const ringContext = {
    opportunity: 'whether a real market opportunity exists',
    offering: 'whether our solution effectively addresses the need',
    operation: 'whether we can feasibly build and deliver this',
  }

  const context = [
    `Context: I'm working on ${venture.name || 'my venture'}${venture.description ? ` — ${venture.description}` : ''}. We're at the ${STAGE_LABELS[venture.stage] || 'early'} stage.`,
    '',
    `Assumption: I believe that ${assumption.text}. This is an ${ringData.label} assumption — it relates to ${ringContext[assumption.ring]}.`,
    '',
    `Evidence status: This assumption is in my "Clueless Corner" — I consider it highly important to our success, but I have little to no evidence for it.`,
    '',
    variant.template.replace(/\{\{assumption\}\}/g, assumption.text),
    '',
    `Constraints: I want to test this quickly and with minimal budget.`,
    '',
    `What would a "kill signal" look like — what evidence would tell me this assumption is wrong and I should pivot?`,
  ].join('\n')

  return context
}
```

**Commit:** `feat: add prompt engine with template interpolation`

---

## Task 3: Build the PromptWorkshop screen

**Files:**
- Modify: `src/screens/PromptWorkshop.jsx` (replace placeholder)

Layout:
- **Header:** "Prompt Workshop" + subtitle
- **Left sidebar (lg:w-[260px]):** List of Clueless Corner assumptions. Each shows text (truncated), ring dot, selected approach icon (if any). Active assumption highlighted. Click to switch.
- **Main area** for selected assumption:
  1. **Assumption display** — full text + ring tag
  2. **Validation approach picker** — grid of cards (2-3 cols). Each card: icon, name, short description, best-for text. Selected card highlighted with ring color border. Click to select.
  3. **Prompt style toggle** — 3 buttons: 🎯 Focused / 🧭 Exploratory / 😈 Devil's Advocate. Pill-style selector.
  4. **Prompt display** — monospace (font-mono), dark bg panel, rendered prompt text. Only shown when an approach is selected.
  5. **Copy button** — copies prompt to clipboard, shows "Copied!" feedback for 2s.
- **Footer:** Back button + summary stats

State management:
- `selectedAssumptionId` — local state, defaults to first clueless assumption
- When user picks an approach: `dispatch({ type: 'UPDATE_ASSUMPTION', id, updates: { selectedApproach: approachId } })`
- When user toggles style: `dispatch({ type: 'UPDATE_ASSUMPTION', id, updates: { promptStyle: style } })`

**Commit:** `feat: build Prompt Workshop screen with validation approach picker`

---

## Task 4: Add copy-to-clipboard and export controls

**Files:**
- Modify: `src/screens/PromptWorkshop.jsx`

Add to the prompt display area:
- **Copy button** with clipboard API: `navigator.clipboard.writeText(prompt)`
- Visual feedback: button text changes to "Copied!" with a checkmark for 2s
- **"Copy All Prompts" button** at the bottom — collects all clueless assumptions that have a selected approach, renders each prompt, joins with separators, copies to clipboard
- Export trust message: "Your prompts are generated in your browser and copied directly to your clipboard."

**Commit:** `feat: add copy-to-clipboard with feedback animation`

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | 10 prompt template JSONs + barrel | `src/data/prompts/*.json`, `index.js` |
| 2 | Prompt engine utility | `src/utils/promptEngine.js` |
| 3 | PromptWorkshop screen | `src/screens/PromptWorkshop.jsx` |
| 4 | Copy-to-clipboard + export | `src/screens/PromptWorkshop.jsx` |
