# KluMap — Product Specification & Implementation Plan

---

## Overview

**KluMap** is an interactive innovation tool that helps founders, innovators, and corporate teams identify their riskiest business assumptions and generate tailored AI prompts to help create strategies to validate them.

**Domain:** klumap.com  
**Tagline:** "Map your assumptions. Challenge your convictions."  
**Author:** Morten Wagner (mortenwagner.com)  

### Core Idea

KluMap combines an original framework — **O-Rings of Innovation** — with the concept of identifying the contents of your venture's **Clueless Corner** — into an interactive web tool. Users map their business assumptions across three strategic layers, prioritize them by importance vs. evidence, and receive ready-to-use prompts for Claude, ChatGPT, or any AI assistant to help them design validation experiments.

No data leaves the browser. No accounts. No server calls. The intelligence is in the structure.

---

## Frameworks

### O-Rings of Innovation

Three concentric rings representing layers of business assumptions:

- **Opportunity** (innermost) — Is there a real problem? Is the market there? Will anyone care?
- **Offering** (middle) — Does our solution work? Is it desirable? Does it solve the real problem?
- **Operation** (outermost) — Can we build it? Can we deliver it? Can we make money?

Color coding:
- Opportunity: `#4ECDC4` (teal)
- Offering: `#FFB347` (amber)
- Operation: `#FF6B6B` (coral)

A sample animation - that can be used to explain the concept online is available at artifacts/orings.jsx

### The Clueless Corner

A 2×2 prioritization matrix:

```
            Low Evidence ←——→ High Evidence
                |               |
High Importance | CLUELESS      | VALIDATED
                | CORNER ⚠️     | ✓
                |               |
Low Importance  | NICE TO       | KNOWN
                | KNOW          | TERRITORY
                |               |
```

The **Clueless Corner** (top-left) is where ventures go to die: assumptions that are critical to success but unsupported by evidence. These are the ones to test first.

A sample animation - that can be used to explain the concept online is available at artifacts/clueless-corner.jsx
---

## User Flow (5 Screens)

```
[0. Welcome]  →  [1. Venture Framing]  →  [2. Assumptions]  →  [3. Clueless Corner]  →  [4. Prompt Workshop]
```

### Screen 0: Welcome

**Purpose:** A single-viewport intro screen. Not a marketing page — a confident, minimal orientation that works for both warm traffic (knows Morten's frameworks) and cold traffic (never heard of O-Rings).

**Layout (top to bottom, centered):**

```
[O-Ring motif — three subtle concentric rings, teal/amber/coral]

KluMap

"Map your assumptions. Challenge your convictions."

Identify the riskiest assumptions in your venture
and generate AI prompts to test them.

[How it works: 4 small steps]
  Frame → Extract → Map → Test

[  Start Mapping →  ]

🔒 Your data never leaves your browser.     [GitHub icon] Open source
   No accounts. No tracking. Nothing stored.

Built by Morten Wagner
```

**Design notes:**
- The "How it works" row serves cold traffic — 4 icons with one-word labels give a mental model of the journey ahead. Warm traffic scans past it in <1 second.
- The O-Ring motif (not the full animated explainer) gives cold users a visual hook and warm users instant recognition.
- Privacy + open source are grouped together at the bottom, near the CTA. This is the last thing users read before clicking — high-trust moment.
- The whole screen should feel like a book's title page: confident, spacious, inviting.
- Screen 0 is excluded from the progress bar — it's pre-flow.

**CTA:** "Start Mapping →"

---

### Screen 1: Venture Framing

**Purpose:** Minimal context-setting. Not a full business plan — just enough to personalize prompts.

**Inputs:**
- Venture name (text, required)
- One-liner description (text, required, max ~150 chars)
- Stage selector (single choice):
  - 💡 Idea — "I think there's something here"
  - 🔬 Exploring — "I'm testing the waters"
  - 🏗️ Building — "We're making it real"
  - 📈 Scaling — "We need to grow"

**Visual:** Clean, centered form. O-Ring logo animation on load. The three rings pulse subtly.

**CTA:** "Start Mapping →"

---

### Screen 2: Assumption Extraction

**Purpose:** Help users surface their assumptions, organized by O-Ring layer.

**Layout:**
- Left panel: O-Ring visual showing which layer is active (highlighted ring)
- Right panel: Assumption input area

**Flow:**
1. Start with **Opportunity** ring (innermost)
2. Show guided prompt questions per ring (see Guided Questions below)
3. User types assumption as free text, hits Enter or clicks Add
4. Each assumption becomes a card, color-coded by ring
5. Tab/click to move to next ring. User can go back — assumptions on one ring often inform deeper assumptions
6. Can go back and add more at any time

**Cards show:**
- Assumption text
- Ring tag (color dot + label)
- Edit/delete buttons
- Drag handle (for next screen)

**Guidance text** (subtle, at bottom): "Don't overthink it. Capture what you believe to be true but haven't proven. You can always add more later."

**CTA:** "Map Priority →" (enabled when ≥3 assumptions exist)

#### Guided Questions by Ring

These appear as clickable suggestion chips above the input field. Tapping one pre-fills the input with a starter phrase the user can complete.

**Opportunity Ring (innermost) — "Is there a real need?"**

| Question | Starter Phrase |
|----------|---------------|
| Who has this problem? | "We assume our target customer is..." |
| How painful is it? | "We assume this problem is urgent enough that..." |
| How many people have it? | "We assume the market size is..." |
| Why hasn't it been solved? | "We assume existing solutions fail because..." |
| Why now? | "We assume the timing is right because..." |
| Will they look for a solution? | "We assume people actively seek solutions by..." |

**Offering Ring (middle) — "Does our solution work?"**

| Question | Starter Phrase |
|----------|---------------|
| Does it actually solve the problem? | "We assume our solution addresses the core pain by..." |
| Will they choose us? | "We assume people will prefer us over alternatives because..." |
| What's the key differentiator? | "We assume our unique advantage is..." |
| Will they understand it? | "We assume our value proposition is clear enough that..." |
| Will they come back? | "We assume users will return because..." |
| Will they tell others? | "We assume users will recommend us because..." |

**Operation Ring (outermost) — "Can we make it work?"**

| Question | Starter Phrase |
|----------|---------------|
| Can we build the hard part? | "We assume we can technically deliver..." |
| Can we deliver at viable cost? | "We assume our unit economics work because..." |
| Do we have the right team? | "We assume our team can execute because..." |
| Can we acquire customers affordably? | "We assume customer acquisition cost will be..." |
| Will it scale? | "We assume we can scale by..." |
| What's the regulatory risk? | "We assume compliance/regulation won't block us because..." |

---

### Screen 3: Clueless Corner (Mapping)

**Purpose:** Prioritize assumptions by dragging them onto the 2×2 matrix.

**Layout:**
- Main area: Large 2×2 matrix grid
- Left sidebar: Stack of unmapped assumption cards (from Screen 2)
- Bottom: Legend explaining quadrants

**Interaction:**
- Drag cards from sidebar onto matrix quadrants
- Cards snap to quadrant but can be positioned freely within it
- Quadrant highlights on hover during drag
- Clueless Corner (top-left) has subtle pulsing border/glow
- Cards in Clueless Corner get a ⚠️ indicator
- Can drag between quadrants to re-prioritize
- Double-click card to edit text

**Quadrant Labels:**
- Top-left: **"Clueless Corner"** — Important but unproven. Test these first.
- Top-right: **"Validated"** — Important and supported. Keep monitoring.
- Bottom-left: **"Nice to Know"** — Unproven but low-stakes. Park these.
- Bottom-right: **"Known Territory"** — Supported and low-stakes. Move on.

**Counter:** "X assumptions in the Clueless Corner" (updates live)

**CTA:** "Generate Prompts →" (enabled when ≥1 assumption in Clueless Corner)

---

### Screen 4: Prompt Workshop

**Purpose:** For each Clueless Corner assumption, generate tailored AI prompts to help design validation experiments.

**Layout:**
- Left sidebar: List of Clueless Corner assumptions (ordered by position, top = most important)
- Main area: Selected assumption's prompt workspace

**For each assumption, the user:**

1. Sees the assumption text and O-Ring layer tag
2. Picks a **Validation Approach** from the toolkit (card selector):

| # | Approach | Icon | Best For |
|---|----------|------|----------|
| 1 | Customer Conversations | 🎤 | Desirability assumptions — do people actually have this problem? |
| 2 | Smoke Test / Fake Door | 🚪 | Demand assumptions — will people click/sign up/express interest? |
| 3 | Wizard of Oz | 🎭 | Solution assumptions — deliver manually what you'd automate |
| 4 | Concierge MVP | 🤝 | Value delivery — full service, zero tech |
| 5 | Data Mining | 📊 | Market/sizing assumptions — does existing data answer this? |
| 6 | Expert Review | 🧠 | Feasibility assumptions — ask 3 people who've done it |
| 7 | Analogous Scanning | 🔍 | Novelty assumptions — who solved similar elsewhere? |
| 8 | Prototype / Storyboard | ✏️ | Usability/appeal assumptions — show, don't tell |
| 9 | Pre-sale / Letter of Intent | 💰 | Willingness-to-pay assumptions — will someone commit money? |
| 10 | Technical Spike | ⚡ | Feasibility assumptions — can we actually build the hard part? |

*(Note: These 10 approaches are placeholders. Morten will edit with his own practitioner set.)*

3. Gets a **generated prompt** (copy-paste ready) tailored to:
   - The specific assumption text
   - The O-Ring layer (Opportunity/Offering/Operation)
   - The chosen validation approach
   - The venture stage

4. Can toggle between **Prompt Styles:**
   - 🎯 **Focused** — single clear prompt, get to the point
   - 🧭 **Exploratory** — broader prompt, help me think wider
   - 😈 **Devil's Advocate** — challenge my assumption, find the holes

5. **Copy button** copies prompt to clipboard with one click

**Prompt Template Structure:**

```
Context: I'm working on [venture name] — [one-liner]. We're at the [stage] stage.

Assumption: I believe that [assumption text]. This is a [ring layer] assumption — it relates to [opportunity/offering/operation context].

Evidence status: This assumption is in my "Clueless Corner" — I consider it highly important to our success, but I have little to no evidence for it.

Task: Help me design a [validation approach] to test this assumption.

Specifically:
- [Approach-specific questions — see prompt library]

Constraints: I want to test this within [2 weeks / 1 month] and with [minimal / moderate] budget.

What would a "kill signal" look like — what evidence would tell me this assumption is wrong and I should pivot?
```

**After all assumptions have prompts:**

**Export Options:**
- 📋 Copy All Prompts (markdown, clipboard)
- 📄 Download Validation Brief (PDF)
  - Includes: venture summary, O-Ring map visual, Clueless Corner matrix, all prompts with context
  - Branded with KluMap logo, tasteful mortenwagner.com attribution
- 🔗 Share Link (base64 state encoded in URL — future version)

---

## Prompt Library (JSON Structure)

Prompts are stored as editable JSON files for easy extension.

```json
{
  "id": "customer-conversations",
  "name": "Customer Conversations",
  "icon": "🎤",
  "short_description": "Structured problem interviews",
  "best_for": "Desirability assumptions — do people actually have this problem?",
  "ring_affinity": ["opportunity", "offering"],
  "prompt_variants": {
    "focused": {
      "template": "Help me design a focused customer interview to test this assumption. I need:\n1. A screening criteria — who exactly should I talk to (be specific about demographics, role, behavior)?\n2. Five open-ended questions that would reveal whether {{assumption}} is true, WITHOUT leading the interviewee\n3. What specific responses would VALIDATE this assumption?\n4. What responses would be a KILL SIGNAL — evidence that this assumption is wrong?\n5. How many conversations do I need for reasonable confidence?"
    },
    "exploratory": {
      "template": "I want to deeply explore whether {{assumption}} is true. Help me think broadly:\n1. Who are the different stakeholder groups that might have insight on this? (not just end users)\n2. For each group, what would I ask and what might I learn?\n3. What adjacent problems or behaviors should I look for that might indirectly validate or invalidate this?\n4. What existing communities, forums, or data sources could I observe (before talking to anyone)?\n5. Design a 2-week discovery plan mixing observation and conversation."
    },
    "devils_advocate": {
      "template": "Play devil's advocate on my assumption that {{assumption}}.\n1. Give me the 3 strongest reasons this assumption is probably WRONG\n2. What cognitive biases might be making me believe this? (confirmation bias, survivorship bias, etc.)\n3. Who would disagree with this assumption most strongly, and what would their argument be?\n4. What's the most common way startups/ventures fail when they hold this exact type of assumption?\n5. If I had to bet AGAINST this assumption, where would I find the evidence?"
    }
  }
}
```

### File Structure

```
/src/data/prompts/            # One JSON per validation approach
  customer-conversations.json
  smoke-test.json
  wizard-of-oz.json
  concierge-mvp.json
  data-mining.json
  expert-review.json
  analogous-scanning.json
  prototype-storyboard.json
  presale-loi.json
  technical-spike.json

/src/data/libraries/           # Future: additional prompt libraries
  startup-validation.json      ← v1 (the 10 above)
  vc-due-diligence.json        ← future
  corporate-innovation.json    ← future
  social-impact.json           ← future
```

---

## Visual Design

### Design DNA (Reference Sites)

The aesthetic is a synthesis of three reference sites:

**1. Cannes Lions Good News (cannesprlions.com)**
- Bold editorial typography as primary visual element
- Floating card elements with strong color blocks
- Playful but premium — not corporate, not startup-pastel
- Take: Card-based UI for assumption cards, bold headings, color confidence

**2. Nillion (nillion.com)**
- Dark mode with vivid saturated accent color (electric blue)
- Dramatic gradient backgrounds with depth/glow
- Monospace secondary text for technical content
- Minimal, confident, lots of breathing room
- Take: Dark foundation, O-Ring colors as vivid accents on dark, monospace for prompt display

**3. ESPN Feature Story (espn.com/feature)**
- Scroll-driven storytelling with full-viewport sections
- Custom illustrations integrated into narrative flow
- Sequential reveal — each scroll advances the story
- Take: Progressive disclosure through the 4 screens, screen transitions feel like narrative steps

### Synthesized Aesthetic

- **Dark mode foundation** — deep navy/charcoal (`#0f0f1a` → `#1a1a2e`)
- **O-Ring colors as vivid accents** — teal, amber, coral pop against dark backgrounds
- **Bold display typography** — large confident headings (Inter Display or similar)
- **Monospace for prompts** — generated prompts displayed in a code-like mono font (JetBrains Mono or similar), reinforcing "this is a tool output you paste elsewhere"
- **Gradient glows** — subtle radial gradients behind the O-Ring visual and Clueless Corner, giving depth (Nillion-inspired)
- **Card elements** — assumption cards have slight elevation, color-coded left border, clean typography
- **Screen transitions** — smooth fade/slide between the 4 steps, feels like turning pages
- **Generous whitespace** — let the content breathe, don't cram

### O-Ring Visual Identity
- Concentric circles appear throughout as a motif
- Screen 2: Interactive ring selector with glow on active ring
- PDF export: O-Ring diagram with assumptions mapped
- Favicon: Simplified three-ring icon (teal/amber/coral)
- Subtle ring motif in background (very low opacity) on all screens

### Responsive Design
- **Mobile (< 640px):** Stacked layout, swipe between screens, matrix becomes scrollable, cards are tappable
- **Tablet/iPad (640-1024px):** Two-column where possible, comfortable drag targets
- **Desktop (> 1024px):** Full experience with sidebars, large matrix, spacious cards

### Drag & Drop
- Touch-friendly drag handles (≥ 44px tap targets)
- Visual feedback: card lifts with shadow on grab, quadrant highlights on hover
- Snap to quadrant with smooth animation
- Mobile alternative: tap card → tap quadrant (for small screens where drag is awkward)

---

## Privacy & Trust Strategy

KluMap is fully client-side with zero data transmission. The trust strategy uses three touch-points — no more.

### Touch-point 1: Welcome Screen (Screen 0)
The primary trust statement. Lock icon + "Your data never leaves your browser. No accounts. No tracking. Nothing stored." — positioned near the CTA so it's the last thing users read before starting. Paired with "Open source — view the code" GitHub link.

### Touch-point 2: Persistent Subtle Indicator
A small lock icon + "Local only" in the bottom bar / progress bar area. Always visible but not shouting. Passive reassurance while users type sensitive business assumptions.

### Touch-point 3: Export Context (Screen 4)
When users export, reinforce: "Your Validation Brief is generated in your browser and downloaded directly to your device."

### What NOT to do
- No cookie banner (there are no cookies)
- No privacy popup/modal on first load
- No excessive badge decoration — research shows too many trust signals decrease trust (inverted U-curve)

### Open Source as Trust Signal
GitHub icon + "Open source — view the code" link on welcome screen. Research shows this is one of the strongest verifiable trust signals, especially for technical audiences.

---

## Help System

### Primary: Embedded Guidance (in-flow)
- Guided question chips on Screen 2 (already specified)
- Quadrant labels and legend on Screen 3
- Prompt style explanations on Screen 4
- Minimum-gate requirements (≥3 assumptions, ≥1 in Clueless Corner) prevent skipping ahead

### Secondary: Contextual Micro-copy
Each screen gets one sentence of "why" text at the top — explaining what this step achieves and why it matters. Not a tutorial wall; more like a chapter heading.

### Tertiary: On-demand Help Panel
A persistent `?` button (bottom-right) opens a slide-out panel with context for the current screen:
- "What is the [O-Rings / Clueless Corner]?" — 2-3 sentences + simplified animated visual (reusing artifact components)
- "Example" — a worked example for the current step
- "Tips" — 2-3 practical tips

Screens 2 & 3 also include a "Learn more" expandable section for users who want to understand the frameworks before using them. Collapsed by default.

### NOT recommended for v1
- Tooltip tours / coach marks — research shows high abandonment (>3 tooltips)
- Video tutorials — too heavy, better suited for blog/YouTube
- Chatbot/AI help — scope creep

---

## Tech Stack

```
Framework:      React 18 + Vite
Styling:        Tailwind CSS 3
Drag & Drop:    @dnd-kit/core + @dnd-kit/sortable
PDF Export:     jsPDF + html2canvas
Clipboard:      navigator.clipboard API
Fonts:          Inter (UI) + JetBrains Mono (prompts)
State:          React Context + useReducer (single app state)
Build Output:   Static /dist folder (HTML + JS + CSS)
Deployment:     FTP upload to one.com (klumap.com)
```

### No External Dependencies At Runtime
- No API calls
- No analytics (v1)
- No cookies
- No localStorage (v1 — state lives in memory, export to save)
- Zero server-side processing

### Build & Deploy

```bash
# Development
npm install
npm run dev          # localhost:5173

# Production build
npm run build        # outputs to /dist

# Deploy to one.com
# FTP upload contents of /dist to klumap.com root
```

---

## Project Structure

```
klumap/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── state/
│   │   ├── AppContext.jsx
│   │   └── reducer.js
│   ├── screens/
│   │   ├── Welcome.jsx
│   │   ├── VentureFraming.jsx
│   │   ├── AssumptionExtraction.jsx
│   │   ├── CluelessCorner.jsx
│   │   └── PromptWorkshop.jsx
│   ├── components/
│   │   ├── ORingVisual.jsx
│   │   ├── ORingMotif.jsx
│   │   ├── AssumptionCard.jsx
│   │   ├── Matrix.jsx
│   │   ├── PromptDisplay.jsx
│   │   ├── ValidationPicker.jsx
│   │   ├── GuidedQuestions.jsx
│   │   ├── HelpPanel.jsx
│   │   ├── HelpButton.jsx
│   │   ├── PrivacyIndicator.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ExportButton.jsx
│   │   └── Layout.jsx
│   ├── data/
│   │   ├── prompts/
│   │   │   ├── customer-conversations.json
│   │   │   ├── smoke-test.json
│   │   │   └── ... (10 files)
│   │   ├── guided-questions.json
│   │   └── stages.json
│   ├── utils/
│   │   ├── promptEngine.js
│   │   ├── exportPDF.js
│   │   └── exportMarkdown.js
│   └── styles/
│       └── globals.css
```

---

## Implementation Plan (Claude Code Sessions)

### Session 1: Foundation, Screen 0 & Screen 1
- [ ] Project scaffold (Vite + React + Tailwind)
- [ ] App state setup (Context + Reducer) — currentScreen includes 0
- [ ] Responsive Layout shell with progress bar (4 steps, Screen 0 excluded from progress)
- [ ] Screen 0: Welcome (O-Ring motif, tagline, how-it-works steps, CTA, privacy + open source footer)
- [ ] O-Ring motif component (three concentric rings, simplified — for welcome screen)
- [ ] Screen 1: Venture Framing (form + stage selector)
- [ ] O-Ring SVG logo/visual component (static version)
- [ ] Navigation between screens (0→1→2→3→4)
- [ ] Dark mode base with O-Ring accent colors
- [ ] Font setup (Inter + JetBrains Mono)
- [ ] Privacy indicator component (lock icon + "Local only" in bottom bar)
- [ ] Help button shell (`?` button, bottom-right, opens empty panel for now)
- **Test:** Can view welcome screen, start mapping, complete Screen 1, advance on mobile + desktop

### Session 2: Assumption Extraction (Screen 2)
- [ ] O-Ring interactive visual (ring selector, highlight active ring with glow)
- [ ] Guided question chips per ring (from guided-questions.json)
- [ ] Assumption input with starter phrase pre-fill
- [ ] Assumption card component (color-coded, editable, deletable)
- [ ] Card list with ring filter tabs
- [ ] Back-navigation between rings
- [ ] Minimum assumption gate (≥3 to proceed)
- **Test:** Can add 5+ assumptions across all rings, edit, delete, navigate freely between rings

### Session 3: Clueless Corner Matrix (Screen 3)
- [ ] 2×2 matrix grid component with quadrant labels
- [ ] @dnd-kit integration for drag & drop
- [ ] Drag from sidebar to quadrant
- [ ] Drag between quadrants
- [ ] Touch-friendly alternative (tap to assign on mobile)
- [ ] Clueless Corner visual emphasis (pulsing glow)
- [ ] Live counter
- [ ] Gradient glow background effect
- **Test:** Can map all assumptions, rearrange, works on iPad with tap

### Session 4: Prompt Workshop (Screen 4)
- [ ] Prompt library JSON files (all 10 × 3 variants = 30 prompts)
- [ ] Validation approach picker (card layout with icons)
- [ ] Prompt engine (template interpolation with venture context)
- [ ] Prompt display in monospace with style toggle (Focused/Exploratory/Devil's Advocate)
- [ ] Copy to clipboard with feedback animation
- [ ] Assumption list navigation in sidebar
- **Test:** Generate and copy prompts for 3 different assumptions across different styles

### Session 5: Export, Help & Polish
- [ ] PDF export — "Validation Brief" with O-Ring visual, matrix, all prompts
- [ ] Tasteful branding on PDF (KluMap logo + mortenwagner.com)
- [ ] Markdown export (all prompts, structured)
- [ ] Export trust message: "Generated in your browser and downloaded directly to your device"
- [ ] Help panel content per screen (framework explainer, worked example, tips)
- [ ] "Learn more" expandable sections on Screens 2 & 3 (reusing artifact animations)
- [ ] Contextual micro-copy at top of each screen (one-sentence "why" text)
- [ ] Responsive pass (test all screens on 375px, 768px, 1280px)
- [ ] Screen transition animations
- [ ] Empty states and edge cases
- [ ] Meta tags (OG image, title, description for social sharing)
- [ ] Favicon (three-ring icon)

### Session 6: Deploy & Test
- [ ] Production build (`npm run build`)
- [ ] FTP to one.com (klumap.com)
- [ ] Test live site
- [ ] Cross-browser check (Chrome, Safari, Firefox)
- [ ] Mobile check (iPhone Safari, iPad)
- [ ] Share test link, gather feedback

---

## Data Model

```typescript
interface AppState {
  venture: {
    name: string;
    description: string;
    stage: 'idea' | 'exploring' | 'building' | 'scaling';
  };
  assumptions: Assumption[];
  currentScreen: 0 | 1 | 2 | 3 | 4;
  activeRing: 'opportunity' | 'offering' | 'operation';
}

interface Assumption {
  id: string;
  text: string;
  ring: 'opportunity' | 'offering' | 'operation';
  quadrant: 'clueless' | 'validated' | 'nice-to-know' | 'known' | null;
  position: { x: number; y: number } | null;
  selectedApproach: string | null;
  promptStyle: 'focused' | 'exploratory' | 'devils-advocate';
  createdAt: number;
}
```

---

## Future Roadmap (Not V1)

- **Prompt Libraries:** VC Due Diligence, Corporate Innovation, Social Enterprise, Impact Assessment
- **Share Links:** Base64-encoded state in URL for sharing/bookmarking
- **Multi-language:** Danish/English toggle
- **Team Mode:** Multiple people add assumptions simultaneously (WebRTC, no server)
- **Template Gallery:** Pre-loaded assumption sets for common venture types (SaaS, marketplace, hardware, etc.)
- **Session History:** localStorage save/load of previous sessions
- **Analytics:** Optional, privacy-respecting usage tracking
- **Blog Integration:** Link to Morten's "Postcards from the Future" and other content
- **API Integration:** Optional bring-your-own-key mode to run prompts directly

---

## Attribution & Branding

**KluMap** by Morten Wagner

Built on:
- **O-Rings of Innovation** — Original framework by Morten Wagner
- Informed by general lean startup, design thinking, and customer development principles (Bland, Blank, Osterwalder et al.)

**Footer:** "KluMap helps you find what you don't know you don't know. Built by Morten Wagner." + link to mortenwagner.com

**PDF Footer:** "Generated with KluMap.com — O-Ring Assumption Mapping by Morten Wagner"
