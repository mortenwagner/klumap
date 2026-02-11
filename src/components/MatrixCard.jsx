import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import guidedQuestions from '../data/guided-questions.json'

/**
 * Simple deterministic hash from a string to get a stable number.
 */
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}

/**
 * Derive a rotation in the range [-maxDeg, +maxDeg] from assumption ID.
 */
function getRotation(id, maxDeg = 2.5) {
  const h = hashCode(id)
  const normalized = (h % 1000) / 1000
  return normalized * maxDeg
}

/**
 * MatrixCard — compact draggable post-it card for the Clueless Corner matrix.
 *
 * Props:
 * - assumption: { id, text, ring, quadrant, ... }
 * - isOverlay: boolean — when true, rendered inside DragOverlay (rotated, bigger shadow)
 * - onUnmap: (id) => void — called when user clicks the unmap button
 * - isSelected: boolean — for mobile tap-to-assign highlight
 * - onSelect: (id) => void — for mobile tap-to-assign
 */
export default function MatrixCard({ assumption, isOverlay = false, onUnmap, isSelected = false, onSelect }) {
  const ringData = guidedQuestions[assumption.ring]
  const postitBg = ringData.postitBg
  const postitText = ringData.postitText
  const ringColor = ringData.color
  const ringLabel = ringData.label
  const rotation = getRotation(assumption.id)
  const isClueless = assumption.quadrant === 'clueless'
  const hasQuadrant = assumption.quadrant != null

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: assumption.id,
    data: {
      type: 'assumption',
      assumption,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  // Overlay mode: slightly rotated, bigger shadow, no transform from sortable
  const overlayStyle = isOverlay
    ? {
        transform: `rotate(${rotation + 3}deg) scale(1.05)`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)',
        cursor: 'grabbing',
      }
    : {}

  function handleClick(e) {
    // Don't trigger select if clicking unmap button
    if (e.target.closest('[data-unmap-btn]')) return
    if (onSelect) {
      onSelect(assumption.id)
    }
  }

  const card = (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      style={!isOverlay ? { ...style, backgroundColor: postitBg } : { backgroundColor: postitBg, ...overlayStyle }}
      {...(!isOverlay ? { ...attributes, ...listeners } : {})}
      onClick={handleClick}
      className={`
        group relative rounded-sm p-3 min-h-[44px] touch-manipulation cursor-grab
        ${isOverlay ? 'z-50' : ''}
        ${isSelected ? 'ring-2 ring-accent ring-offset-1 ring-offset-navy-900' : ''}
        ${isDragging ? 'z-10' : ''}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Assumption: ${assumption.text}`}
    >
      {/* Clueless indicator */}
      {isClueless && !isOverlay && (
        <span className="absolute -top-1.5 -left-1.5 text-xs leading-none" aria-label="In Clueless Corner">
          ⚠️
        </span>
      )}

      {/* Unmap button — hover-visible on desktop, touch-accessible */}
      {hasQuadrant && onUnmap && !isOverlay && (
        <button
          data-unmap-btn="true"
          onClick={(e) => {
            e.stopPropagation()
            onUnmap(assumption.id)
          }}
          className="
            absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
            flex items-center justify-center
            text-[10px] leading-none font-bold
            transition-opacity duration-200
            opacity-100 lg:opacity-0 group-hover:opacity-100
            min-w-[20px] min-h-[20px]
          "
          style={{
            backgroundColor: postitText,
            color: postitBg,
          }}
          aria-label={`Remove "${assumption.text}" from quadrant`}
        >
          &times;
        </button>
      )}

      {/* Card content */}
      <p
        className="text-[11px] sm:text-xs leading-snug font-medium line-clamp-3"
        style={{ color: postitText }}
      >
        {assumption.text}
      </p>

      {/* Ring dot + label */}
      <div className="flex items-center gap-1 mt-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: ringColor }}
        />
        <span className="text-[9px]" style={{ color: postitText, opacity: 0.45 }}>
          {ringLabel}
        </span>
      </div>
    </div>
  )

  return card
}
