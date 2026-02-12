# Session 5: Polish & Export Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add PDF/markdown export, enrich the help panel, add screen transition animations, learn-more expandables, meta tags, and favicon.

**Architecture:** Export utilities generate PDF (jsPDF + html2canvas) and markdown. The existing HelpPanel gets richer per-screen content. Learn-more sections on Screens 2 & 3 reuse the existing explainer modal components. CSS transitions between screens. Meta tags in index.html.

**Tech Stack:** jsPDF, html2canvas, existing React components, Tailwind CSS

---

## Task 1: Install export dependencies + create export utilities

**Files:**
- Modify: `package.json`
- Create: `src/utils/exportMarkdown.js`
- Create: `src/utils/exportPDF.js`

Install jsPDF and html2canvas:
```bash
npm install jspdf html2canvas
```

### exportMarkdown.js

Takes assumptions (clueless only with selectedApproach), venture data, and generates a structured markdown string:

```
# Validation Brief — [Venture Name]

> [Venture description] | Stage: [stage]

Generated with KluMap.com — O-Ring Assumption Mapping by Morten Wagner

---

## 1. [Assumption text]

**Ring:** [Opportunity/Offering/Operation]
**Approach:** [Approach name]
**Style:** [Focused/Exploratory/Devil's Advocate]

[Full rendered prompt]

---

## 2. [Next assumption...]
```

### exportPDF.js

Uses jsPDF to create a simple text-based PDF (no html2canvas needed for v1 — keep it simple):
- Page 1: Title "Validation Brief", venture name, description, stage, date
- Subsequent pages: Each assumption with its rendered prompt
- Footer on every page: "Generated with KluMap.com — O-Ring Assumption Mapping by Morten Wagner"
- Clean, readable layout with proper margins and font sizes

**Commit:** `feat: add markdown and PDF export utilities`

---

## Task 2: Add export buttons to Prompt Workshop

**Files:**
- Modify: `src/screens/PromptWorkshop.jsx`

Add to the footer area (after the existing "Copy All" button):
- **"Download Validation Brief"** button — calls exportPDF, downloads a PDF file
- Trust message: "Your Validation Brief is generated in your browser and downloaded directly to your device."

The existing "Copy All Prompts" already exports markdown to clipboard. Add a "Download as Markdown" option that triggers a `.md` file download.

Wire up:
```js
import { exportPDF } from '../utils/exportPDF'
import { exportMarkdown } from '../utils/exportMarkdown'
```

**Commit:** `feat: add PDF and markdown download to Prompt Workshop`

---

## Task 3: Enrich help panel content + learn-more expandables

**Files:**
- Modify: `src/components/HelpPanel.jsx`

The HelpPanel already has basic content per screen. Enrich it:
- Add a "Learn more" collapsible section on Screens 2 and 3 that shows a brief framework explanation
- Screen 2: Explain the O-Rings concept (Opportunity → Offering → Operation, concentric rings, each layer building on the last)
- Screen 3: Explain the Clueless Corner concept (2×2 matrix, Importance × Evidence, why top-left is dangerous)
- Add a collapsible `<details>` element with `<summary>` for the learn-more sections
- Keep the existing tips

**Commit:** `feat: enrich help panel with learn-more framework explainers`

---

## Task 4: Screen transition animations

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles/globals.css`

Add a subtle fade+slide transition when switching screens:
- Wrap the screen component in a transition container
- Use CSS animation: fade-in from slight translate (e.g., 20px upward, opacity 0→1, 300ms)
- Use `key={currentScreen}` on the wrapper to trigger animation on screen change

Add to globals.css:
```css
@keyframes screen-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.screen-enter {
  animation: screen-enter 0.3s ease-out;
}
```

In App.jsx, wrap `<Screen />` with:
```jsx
<div key={currentScreen} className="screen-enter flex-1 flex flex-col">
  <Screen />
</div>
```

**Commit:** `feat: add screen transition animation`

---

## Task 5: Meta tags and favicon

**Files:**
- Modify: `index.html`
- Create: `public/favicon.svg` (three concentric rings SVG)

Add to `<head>` in index.html:
- `<title>KluMap — Map your assumptions</title>`
- `<meta name="description" content="Identify the riskiest assumptions in your venture and generate AI prompts to test them.">`
- Open Graph tags: og:title, og:description, og:type (website), og:url (https://klumap.com)
- Favicon: inline SVG of three concentric rings using the ring colors

**Commit:** `feat: add meta tags and favicon`

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Export utilities (markdown + PDF) | `exportMarkdown.js`, `exportPDF.js`, `package.json` |
| 2 | Export buttons on Screen 4 | `PromptWorkshop.jsx` |
| 3 | Help panel learn-more sections | `HelpPanel.jsx` |
| 4 | Screen transition animations | `App.jsx`, `globals.css` |
| 5 | Meta tags + favicon | `index.html`, `public/favicon.svg` |
