# Session 2: Assumption Extraction (Screen 2) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Screen 2 where users add business assumptions organized by O-Ring layer, with guided question chips, inline editing, and a minimum-3 gate.

**Architecture:** Two-panel layout (ring selector left, input + card list right). Guided questions stored in a JSON data file, rendered as clickable chips that pre-fill the input. Assumptions are color-coded cards with edit/delete, filterable by ring tab. The O-Ring visual is an interactive SVG where clicking a ring switches the active layer.

**Tech Stack:** React 18, Tailwind CSS 3, existing AppContext + reducer (already has ADD/UPDATE/DELETE_ASSUMPTION and SET_ACTIVE_RING actions).

---

### Task 1: Create guided-questions.json data file

**Files:**
- Create: `src/data/guided-questions.json`

**Step 1: Create the data file**

```json
{
  "opportunity": {
    "label": "Opportunity",
    "subtitle": "Is there a real need?",
    "questions": [
      { "question": "Who has this problem?", "starter": "We assume our target customer is..." },
      { "question": "How painful is it?", "starter": "We assume this problem is urgent enough that..." },
      { "question": "How many people have it?", "starter": "We assume the market size is..." },
      { "question": "Why hasn't it been solved?", "starter": "We assume existing solutions fail because..." },
      { "question": "Why now?", "starter": "We assume the timing is right because..." },
      { "question": "Will they look for a solution?", "starter": "We assume people actively seek solutions by..." }
    ]
  },
  "offering": {
    "label": "Offering",
    "subtitle": "Does our solution work?",
    "questions": [
      { "question": "Does it actually solve the problem?", "starter": "We assume our solution addresses the core pain by..." },
      { "question": "Will they choose us?", "starter": "We assume people will prefer us over alternatives because..." },
      { "question": "What's the key differentiator?", "starter": "We assume our unique advantage is..." },
      { "question": "Will they understand it?", "starter": "We assume our value proposition is clear enough that..." },
      { "question": "Will they come back?", "starter": "We assume users will return because..." },
      { "question": "Will they tell others?", "starter": "We assume users will recommend us because..." }
    ]
  },
  "operation": {
    "label": "Operation",
    "subtitle": "Can we make it work?",
    "questions": [
      { "question": "Can we build the hard part?", "starter": "We assume we can technically deliver..." },
      { "question": "Can we deliver at viable cost?", "starter": "We assume our unit economics work because..." },
      { "question": "Do we have the right team?", "starter": "We assume our team can execute because..." },
      { "question": "Can we acquire customers affordably?", "starter": "We assume customer acquisition cost will be..." },
      { "question": "Will it scale?", "starter": "We assume we can scale by..." },
      { "question": "What's the regulatory risk?", "starter": "We assume compliance/regulation won't block us because..." }
    ]
  }
}
```

**Step 2: Commit**

```bash
git add src/data/guided-questions.json
git commit -m "feat: add guided questions data for assumption extraction"
```

---

### Task 2: Build the interactive O-Ring selector component

**Files:**
- Create: `src/components/ORingSelector.jsx`

This is the left-panel interactive ring visual for Screen 2. It shows three concentric rings, highlights the active one with a glow, and clicking a ring switches to that layer. Labels appear beside each ring. The active ring's label is bold/bright, others are dimmed.

**Step 1: Build the component**

The component receives `activeRing` (string) and `onRingClick` (callback) as props. It renders an SVG with three concentric circle strokes. The active ring gets:
- Thicker stroke (3px vs 2px)
- Full opacity (1 vs 0.4)
- A glow filter (`drop-shadow`)
- A subtle pulse animation

Ring layout (SVG viewBox 200x200, center at 100,100):
- Opportunity (innermost): r=30, color `#4ECDC4`
- Offering (middle): r=55, color `#FFB347`
- Operation (outermost): r=80, color `#FF6B6B`

Each ring is a `<circle>` wrapped in a `<g>` with `cursor-pointer` and an `onClick` handler. Add a small center dot in the opportunity color.

Labels appear to the right of the SVG as a vertical stack, each with a colored dot + ring name. Active label is white, others are `text-white/40`.

Ring count badges: show the count of assumptions per ring as small badges next to each label (only if count > 0).

**Step 2: Commit**

```bash
git add src/components/ORingSelector.jsx
git commit -m "feat: add interactive O-Ring selector component"
```

---

### Task 3: Build the AssumptionCard component

**Files:**
- Create: `src/components/AssumptionCard.jsx`

A card displaying a single assumption. Shows:
- Left color border (4px) matching the ring color
- Assumption text (editable on click)
- Ring tag (small colored dot + label like "Opportunity")
- Edit button (pencil icon) — toggles inline edit mode
- Delete button (x icon) — dispatches DELETE_ASSUMPTION

Props: `assumption` (object), `onEdit` (callback receiving id + new text), `onDelete` (callback receiving id).

Edit mode: clicking the edit button replaces the text with an input pre-filled with the assumption text. Enter or blur saves, Escape cancels. The input auto-focuses when entering edit mode.

Ring colors map: `{ opportunity: '#4ECDC4', offering: '#FFB347', operation: '#FF6B6B' }`.

Card styling: `bg-white/5 border border-white/10 rounded-xl p-4` with the colored left border. Hover reveals the edit/delete buttons (opacity transition).

**Step 1: Build the component**

**Step 2: Commit**

```bash
git add src/components/AssumptionCard.jsx
git commit -m "feat: add AssumptionCard component with edit/delete"
```

---

### Task 4: Build the full AssumptionExtraction screen

**Files:**
- Modify: `src/screens/AssumptionExtraction.jsx` (replace placeholder)

This is the main Screen 2 component. Layout:

**Desktop (lg+):** Two columns — left panel (O-Ring selector, ~300px) + right panel (input area + card list, flex-1).

**Mobile (<lg):** Stacked — ring tabs at top (horizontal pills), then input + cards below.

**Right panel structure (top to bottom):**

1. **Header:** "Surface your assumptions" + micro-copy: "What do you believe to be true about your venture? Don't overthink it — capture what you haven't proven yet."

2. **Ring tab bar (mobile):** Three horizontal pill buttons showing ring names with colored dots. Active ring is highlighted. (Hidden on desktop where the left-panel ORingSelector is used instead.)

3. **Ring context:** Show the active ring's subtitle from guided-questions.json (e.g., "Opportunity — Is there a real need?") as a section header.

4. **Guided question chips:** Horizontal wrapping flex of small pill buttons. Each shows the question text. Clicking a chip sets the input value to that question's starter phrase and focuses the input. Chips use `bg-white/5 border border-white/10` styling, with the active ring's color on hover border.

5. **Input area:** A text input + "Add" button. Pressing Enter or clicking Add dispatches `ADD_ASSUMPTION` with the text and current `activeRing`. Clear input after adding. Input placeholder: "Type an assumption or pick a question above..."

6. **Assumption cards:** Filtered by active ring (tab). Show cards using AssumptionCard. If no assumptions for this ring yet, show a subtle empty state: "No assumptions for [Ring] yet. Use the questions above for inspiration."

7. **All assumptions summary:** Below the filtered list, show a small count: "X assumptions total (Y Opportunity, Z Offering, W Operation)" — so users see their overall progress even when filtered.

8. **Footer navigation:** Back button (← Back to Framing) + CTA "Map Priority →". CTA is disabled when total assumptions < 3, with a tooltip/hint: "Add at least 3 assumptions to continue".

State: uses `useAppState()` for `assumptions` and `activeRing`, `useDispatch()` for actions. Local state for `inputValue`.

**Step 1: Build the full screen component**

**Step 2: Commit**

```bash
git add src/screens/AssumptionExtraction.jsx
git commit -m "feat: build Assumption Extraction screen with guided chips and cards"
```

---

### Task 5: Visual polish and responsive refinements

**Files:**
- Modify: `src/screens/AssumptionExtraction.jsx` (if needed)
- Modify: `src/components/ORingSelector.jsx` (if needed)
- Modify: `src/styles/globals.css` (add any needed utility classes)

**Step 1: Test the full flow manually**

Run: `npm run dev`

Walk through: Welcome → Venture Framing (fill in name/desc/stage) → Assumption Extraction.

Verify:
- O-Ring selector highlights active ring with glow
- Clicking rings switches the active layer and updates chips
- Question chips pre-fill the input with starter phrases
- Adding assumptions creates color-coded cards
- Edit mode works (click pencil → inline input → Enter saves)
- Delete removes the card
- Ring filter tabs work (mobile) / ring selector works (desktop)
- Assumption count summary updates correctly
- "Map Priority →" button is disabled until 3+ assumptions exist
- Back button returns to Venture Framing with state preserved
- Responsive: stacks properly on mobile widths

**Step 2: Fix any issues found**

**Step 3: Commit**

```bash
git add -A
git commit -m "fix: polish assumption extraction responsive layout and interactions"
```

---

### Task 6: Build verification and final commit

**Step 1: Run build**

Run: `npm run build`
Expected: Clean build, no warnings.

**Step 2: Final commit if needed**

```bash
git add -A
git commit -m "Session 2: Assumption Extraction screen complete"
```

---

## Acceptance Criteria (from spec)

- [ ] Can add 5+ assumptions across all rings
- [ ] Can edit assumption text inline
- [ ] Can delete assumptions
- [ ] Can navigate freely between rings
- [ ] Guided question chips pre-fill input with starter phrases
- [ ] Minimum 3 assumptions gate blocks proceeding to Screen 3
- [ ] Responsive layout works on mobile and desktop
