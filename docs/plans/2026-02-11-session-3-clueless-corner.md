# Session 3: Clueless Corner Matrix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Screen 3 — the interactive 2×2 matrix where users drag assumptions into quadrants (Importance × Evidence) to identify their riskiest blind spots.

**Architecture:** A full-screen matrix layout with an unmapped-cards sidebar. Desktop uses @dnd-kit for drag-and-drop between sidebar and quadrants. Mobile uses a tap-to-assign flow (tap card → tap quadrant). The existing `UPDATE_ASSUMPTION` reducer action handles quadrant assignment via `{ quadrant, position }` fields already present in the assumption data model.

**Tech Stack:** React 18, @dnd-kit/core + @dnd-kit/sortable, Tailwind CSS 3, existing AppContext state

---

## Context for the implementer

### Existing state shape (from `src/state/reducer.js`)
Each assumption already has `quadrant: null` and `position: null` fields. The `UPDATE_ASSUMPTION` action accepts `{ id, updates: { quadrant, position } }`. No reducer changes needed.

### Quadrant definitions
| Key | Label | Position | Meaning |
|-----|-------|----------|---------|
| `clueless` | Clueless Corner ⚠️ | Top-left | Important + Low Evidence. Test first. |
| `validated` | Validated ✓ | Top-right | Important + High Evidence. Keep monitoring. |
| `nice-to-know` | Nice to Know | Bottom-left | Low Importance + Low Evidence. Park these. |
| `known` | Known Territory | Bottom-right | Low Importance + High Evidence. Move on. |

### Axes
- Y-axis: **Importance** (high at top, low at bottom)
- X-axis: **Evidence** (low at left, high at right)

### Post-it card colors (from `src/data/guided-questions.json`)
- Opportunity: bg `#FFB3C6`, text `#6b1a30`, ring color `#c0392b`
- Offering: bg `#93C5FD`, text `#1e3a5f`, ring color `#4a6a8a`
- Operation: bg `#A7F3D0`, text `#14532d`, ring color `#7a8a7a`

### File being replaced
`src/screens/CluelessCorner.jsx` — currently a placeholder ("Coming in Session 3").

---

## Task 1: Install @dnd-kit

**Files:**
- Modify: `package.json`

**Step 1: Install dependencies**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Step 2: Verify installation**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
node -e "require('@dnd-kit/core'); console.log('ok')"
```

Expected: `ok`

**Step 3: Verify dev server still works**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
npm run build
```

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
git add package.json package-lock.json
git commit -m "chore: add @dnd-kit for drag-and-drop support"
```

---

## Task 2: Create quadrant config data file

**Files:**
- Create: `src/data/quadrants.json`

Create the quadrant metadata as an external data file (same pattern as `guided-questions.json` — easy to edit/i18n).

**Step 1: Create the data file**

Create `src/data/quadrants.json`:

```json
{
  "axes": {
    "x": { "low": "Low Evidence", "high": "High Evidence", "label": "Evidence" },
    "y": { "low": "Low Importance", "high": "High Importance", "label": "Importance" }
  },
  "quadrants": {
    "clueless": {
      "label": "Clueless Corner",
      "icon": "⚠️",
      "position": "top-left",
      "row": 0,
      "col": 0,
      "description": "Important but unproven. Test these first.",
      "color": "#c8956a",
      "bgOpacity": 0.08
    },
    "validated": {
      "label": "Validated",
      "icon": "✓",
      "position": "top-right",
      "row": 0,
      "col": 1,
      "description": "Important and supported. Keep monitoring.",
      "color": "#4ade80",
      "bgOpacity": 0.04
    },
    "nice-to-know": {
      "label": "Nice to Know",
      "icon": "",
      "position": "bottom-left",
      "row": 1,
      "col": 0,
      "description": "Unproven but low-stakes. Park these.",
      "color": "#94a3b8",
      "bgOpacity": 0.03
    },
    "known": {
      "label": "Known Territory",
      "icon": "",
      "position": "bottom-right",
      "row": 1,
      "col": 1,
      "description": "Supported and low-stakes. Move on.",
      "color": "#64748b",
      "bgOpacity": 0.03
    }
  }
}
```

**Step 2: Verify it's valid JSON**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
node -e "require('./src/data/quadrants.json'); console.log('valid')"
```

Expected: `valid`

**Step 3: Commit**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
git add src/data/quadrants.json
git commit -m "feat: add quadrant metadata for Clueless Corner matrix"
```

---

## Task 3: Build the MatrixCard component

**Files:**
- Create: `src/components/MatrixCard.jsx`

A compact post-it card used inside the matrix quadrants and sidebar. Smaller than the `AssumptionCard` on Screen 2 — no edit/delete actions, just displays text + ring dot. Must work as a @dnd-kit draggable.

**Step 1: Create the component**

Create `src/components/MatrixCard.jsx`:

```jsx
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import guidedQuestions from '../data/guided-questions.json'

export default function MatrixCard({ assumption, isOverlay = false }) {
  const ringData = guidedQuestions[assumption.ring]
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: assumption.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: ringData.postitBg,
    color: ringData.postitText,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  }

  if (isOverlay) {
    return (
      <div
        className="rounded-sm p-3 shadow-xl rotate-2 w-[140px]"
        style={{ backgroundColor: ringData.postitBg, color: ringData.postitText }}
      >
        <p className="text-xs font-medium leading-snug">{assumption.text}</p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-sm p-2.5 shadow-md text-left touch-manipulation
                 hover:shadow-lg hover:scale-[1.03] transition-shadow min-h-[44px]"
    >
      <p className="text-xs font-medium leading-snug line-clamp-3">{assumption.text}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: ringData.color }}
        />
        <span className="text-[9px] opacity-40">{ringData.label}</span>
      </div>
    </div>
  )
}
```

**Step 2: Verify dev server compiles**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
npm run build
```

Expected: Build succeeds (component isn't used yet but should parse cleanly).

**Step 3: Commit**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
git add src/components/MatrixCard.jsx
git commit -m "feat: add MatrixCard component for drag-and-drop matrix"
```

---

## Task 4: Build the QuadrantDropZone component

**Files:**
- Create: `src/components/QuadrantDropZone.jsx`

A droppable zone representing one quadrant of the 2×2 matrix. Shows label, description, and renders cards dropped into it. Highlights when a card is being dragged over.

**Step 1: Create the component**

Create `src/components/QuadrantDropZone.jsx`:

```jsx
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import MatrixCard from './MatrixCard'

export default function QuadrantDropZone({ quadrantKey, config, assumptions }) {
  const { setNodeRef, isOver } = useDroppable({ id: quadrantKey })
  const isClueless = quadrantKey === 'clueless'

  return (
    <div
      ref={setNodeRef}
      className={`
        relative rounded-xl border p-3 flex flex-col min-h-[180px] lg:min-h-[220px]
        transition-all duration-200
        ${isOver ? 'scale-[1.01]' : ''}
        ${isClueless ? 'clueless-quadrant' : ''}
      `}
      style={{
        backgroundColor: isOver
          ? `${config.color}15`
          : `${config.color}${Math.round(config.bgOpacity * 255).toString(16).padStart(2, '0')}`,
        borderColor: isOver ? `${config.color}50` : `${config.color}20`,
      }}
    >
      {/* Quadrant label */}
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        {config.icon && (
          <span className="text-xs">{config.icon}</span>
        )}
      </div>

      {/* Description (shown when empty) */}
      {assumptions.length === 0 && (
        <p className="text-[11px] text-white/20 italic flex-1 flex items-center justify-center text-center px-2">
          {config.description}
        </p>
      )}

      {/* Cards */}
      <SortableContext items={assumptions.map(a => a.id)} strategy={rectSortingStrategy}>
        <div className="flex flex-wrap gap-2 flex-1 content-start">
          {assumptions.map((a) => (
            <MatrixCard key={a.id} assumption={a} />
          ))}
        </div>
      </SortableContext>

      {/* Card count badge */}
      {assumptions.length > 0 && (
        <div className="absolute top-2 right-2">
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {assumptions.length}
          </span>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Add the Clueless Corner pulsing glow CSS**

Add to `src/styles/globals.css` (after the existing `.postit-card` rule):

```css
/* Clueless Corner quadrant — subtle pulsing glow */
@keyframes clueless-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(200, 149, 106, 0.08); }
  50% { box-shadow: 0 0 35px rgba(200, 149, 106, 0.15); }
}

.clueless-quadrant {
  animation: clueless-pulse 3s ease-in-out infinite;
}
```

**Step 3: Verify build**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
npm run build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
git add src/components/QuadrantDropZone.jsx src/styles/globals.css
git commit -m "feat: add QuadrantDropZone with pulsing Clueless Corner glow"
```

---

## Task 5: Build the CluelessCorner screen

**Files:**
- Modify: `src/screens/CluelessCorner.jsx` (replace placeholder)

This is the main screen. Layout:
- **Desktop (lg+):** Left sidebar (unmapped cards, ~260px) + 2×2 matrix grid + axis labels
- **Mobile (<lg):** Stacked — unmapped cards at top, matrix below, tap-to-assign mode

Key behaviors:
- Wraps everything in `DndContext` from @dnd-kit
- Tracks which card is being dragged (for overlay)
- On drag end: dispatches `UPDATE_ASSUMPTION` with new quadrant
- On mobile: tap a card to select it, then tap a quadrant to assign
- Gate: "Generate Prompts →" enabled only when ≥1 assumption in `clueless` quadrant

**Step 1: Build the full screen**

Replace `src/screens/CluelessCorner.jsx` with:

```jsx
import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useAppState, useDispatch } from '../state/AppContext'
import QuadrantDropZone from '../components/QuadrantDropZone'
import MatrixCard from '../components/MatrixCard'
import quadrantData from '../data/quadrants.json'
import guidedQuestions from '../data/guided-questions.json'

const QUADRANT_ORDER = ['clueless', 'validated', 'nice-to-know', 'known']

export default function CluelessCorner() {
  const { assumptions } = useAppState()
  const dispatch = useDispatch()
  const [activeId, setActiveId] = useState(null)
  const [selectedId, setSelectedId] = useState(null) // mobile tap-to-assign

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  const unmapped = assumptions.filter((a) => a.quadrant === null)
  const cluelessCount = assumptions.filter((a) => a.quadrant === 'clueless').length
  const mappedCount = assumptions.filter((a) => a.quadrant !== null).length
  const canProceed = cluelessCount >= 1

  const activeAssumption = activeId
    ? assumptions.find((a) => a.id === activeId)
    : null

  const getQuadrantAssumptions = useCallback(
    (q) => assumptions.filter((a) => a.quadrant === q),
    [assumptions]
  )

  function handleDragStart(event) {
    setActiveId(event.active.id)
    setSelectedId(null)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    // Determine target quadrant
    let targetQuadrant = null
    if (QUADRANT_ORDER.includes(over.id)) {
      targetQuadrant = over.id
    } else {
      // Dropped on another card — find which quadrant that card is in
      const overAssumption = assumptions.find((a) => a.id === over.id)
      if (overAssumption) {
        targetQuadrant = overAssumption.quadrant
      }
    }

    if (targetQuadrant === null) return

    const draggedAssumption = assumptions.find((a) => a.id === active.id)
    if (draggedAssumption && draggedAssumption.quadrant !== targetQuadrant) {
      dispatch({
        type: 'UPDATE_ASSUMPTION',
        id: active.id,
        updates: { quadrant: targetQuadrant },
      })
    }
  }

  // Mobile: tap card to select, tap quadrant to assign
  function handleCardTap(id) {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  function handleQuadrantTap(quadrantKey) {
    if (!selectedId) return
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      id: selectedId,
      updates: { quadrant: quadrantKey },
    })
    setSelectedId(null)
  }

  // Unmap: move card back to sidebar
  function handleUnmap(id) {
    dispatch({
      type: 'UPDATE_ASSUMPTION',
      id,
      updates: { quadrant: null },
    })
    setSelectedId(null)
  }

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6 gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold">Map your assumptions</h2>
        <p className="text-white/40 text-sm">
          Drag each assumption into the quadrant that fits. How important is it — and how much evidence backs it up?
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          {/* Sidebar — unmapped cards */}
          <aside className="lg:w-[240px] lg:shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/60">
                Unmapped
              </h3>
              <span className="text-xs text-white/30 font-mono">
                {unmapped.length}
              </span>
            </div>

            {unmapped.length === 0 ? (
              <p className="text-xs text-white/20 italic py-4 text-center">
                All assumptions mapped!
              </p>
            ) : (
              <SortableContext items={unmapped.map(a => a.id)} strategy={rectSortingStrategy}>
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  {unmapped.map((a) => (
                    <div
                      key={a.id}
                      className={`shrink-0 w-[140px] lg:w-full ${
                        selectedId === a.id ? 'ring-2 ring-accent rounded-sm' : ''
                      }`}
                      onClick={() => handleCardTap(a.id)}
                    >
                      <MatrixCard assumption={a} />
                    </div>
                  ))}
                </div>
              </SortableContext>
            )}
          </aside>

          {/* Matrix area */}
          <div className="flex-1 flex flex-col gap-1">
            {/* Y-axis label */}
            <div className="hidden lg:flex items-center gap-2 mb-1">
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                ↑ {quadrantData.axes.y.high}
              </span>
            </div>

            {/* 2×2 grid */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {QUADRANT_ORDER.map((key) => {
                const config = quadrantData.quadrants[key]
                const quadrantAssumptions = getQuadrantAssumptions(key)
                return (
                  <div
                    key={key}
                    onClick={() => handleQuadrantTap(key)}
                    className={selectedId ? 'cursor-pointer' : ''}
                  >
                    <QuadrantDropZone
                      quadrantKey={key}
                      config={config}
                      assumptions={quadrantAssumptions}
                    />
                  </div>
                )
              })}
            </div>

            {/* X-axis label */}
            <div className="hidden lg:flex justify-between items-center mt-1">
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                {quadrantData.axes.x.low}
              </span>
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                {quadrantData.axes.x.high} →
              </span>
            </div>
          </div>
        </div>

        {/* Drag overlay — floating card that follows cursor */}
        <DragOverlay>
          {activeAssumption ? (
            <MatrixCard assumption={activeAssumption} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Clueless Corner counter */}
      {mappedCount > 0 && (
        <div className="text-sm text-white/40 flex items-center gap-2">
          <span style={{ color: quadrantData.quadrants.clueless.color }}>
            {cluelessCount}
          </span>
          <span>assumption{cluelessCount !== 1 ? 's' : ''} in the Clueless Corner</span>
          <span className="text-white/15">·</span>
          <span className="text-white/25">
            {mappedCount}/{assumptions.length} mapped
          </span>
        </div>
      )}

      {/* Mobile tap-to-assign hint */}
      {selectedId && (
        <div className="lg:hidden text-center py-2">
          <p className="text-xs text-accent animate-pulse">
            Tap a quadrant to place this assumption
          </p>
        </div>
      )}

      {/* Footer navigation */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button
          onClick={() => dispatch({ type: 'PREV_SCREEN' })}
          className="btn-secondary text-sm"
        >
          &larr; Back
        </button>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => { if (canProceed) dispatch({ type: 'NEXT_SCREEN' }) }}
            disabled={!canProceed}
            className={`btn-primary ${!canProceed ? 'opacity-30 cursor-not-allowed hover:scale-100 hover:brightness-100' : ''}`}
          >
            Generate Prompts &rarr;
          </button>
          {!canProceed && (
            <span className="text-white/20 text-xs">
              Place at least 1 assumption in the Clueless Corner
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify build and UI**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
npm run build
```

Expected: Build succeeds. Navigate to Screen 3 in browser — should see sidebar with unmapped cards and 2×2 matrix.

**Step 3: Commit**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
git add src/screens/CluelessCorner.jsx
git commit -m "feat: build Clueless Corner screen with drag-and-drop matrix"
```

---

## Task 6: Add unmap (return to sidebar) capability and card actions in quadrants

**Files:**
- Modify: `src/components/MatrixCard.jsx`
- Modify: `src/components/QuadrantDropZone.jsx`

Cards that are in a quadrant should have a small "×" button to unmap them (return to sidebar). Cards in the Clueless Corner should have a ⚠️ indicator.

**Step 1: Add unmap button and clueless indicator to MatrixCard**

Modify `src/components/MatrixCard.jsx` — add an `onUnmap` prop and clueless indicator:

The component should accept `onUnmap` callback prop. When the card's quadrant is not null, show a small "×" button in the top-right corner (visible on hover on desktop, always visible on mobile). If the card is in the `clueless` quadrant, show a small ⚠️ indicator.

Update the non-overlay render to include:
```jsx
{/* Unmap button — top right */}
{assumption.quadrant && onUnmap && (
  <button
    onClick={(e) => {
      e.stopPropagation()
      onUnmap(assumption.id)
    }}
    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white/10
               text-white/40 hover:bg-red-500/80 hover:text-white
               text-xs flex items-center justify-center
               opacity-0 group-hover:opacity-100 lg:opacity-0 transition-opacity"
    aria-label="Return to sidebar"
  >
    ×
  </button>
)}

{/* Clueless indicator */}
{assumption.quadrant === 'clueless' && (
  <span className="absolute -top-1 -left-1 text-[10px]">⚠️</span>
)}
```

Also add `group relative` to the card's className.

**Step 2: Wire onUnmap through QuadrantDropZone**

Modify `src/components/QuadrantDropZone.jsx` — accept `onUnmap` prop and pass it to each `MatrixCard`:

```jsx
<MatrixCard key={a.id} assumption={a} onUnmap={onUnmap} />
```

**Step 3: Pass handleUnmap from CluelessCorner screen**

In `src/screens/CluelessCorner.jsx`, the `handleUnmap` function already exists. Pass it through:

```jsx
<QuadrantDropZone
  quadrantKey={key}
  config={config}
  assumptions={quadrantAssumptions}
  onUnmap={handleUnmap}
/>
```

**Step 4: Verify in browser**

Drag a card into a quadrant. Hover over it — "×" button should appear. Click it — card returns to sidebar. Cards in Clueless Corner should show ⚠️.

**Step 5: Commit**

```bash
cd "/Users/morten/Documents/Other Creations/dev/Klumap"
git add src/components/MatrixCard.jsx src/components/QuadrantDropZone.jsx src/screens/CluelessCorner.jsx
git commit -m "feat: add unmap button and clueless indicator to matrix cards"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Install @dnd-kit | `package.json` |
| 2 | Quadrant config data | `src/data/quadrants.json` |
| 3 | MatrixCard component | `src/components/MatrixCard.jsx` |
| 4 | QuadrantDropZone component | `src/components/QuadrantDropZone.jsx`, `globals.css` |
| 5 | CluelessCorner screen (full) | `src/screens/CluelessCorner.jsx` |
| 6 | Unmap + clueless indicator | `MatrixCard.jsx`, `QuadrantDropZone.jsx`, `CluelessCorner.jsx` |
