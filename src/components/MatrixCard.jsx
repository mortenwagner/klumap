import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import guidedQuestions from '../data/guided-questions.json'
import { hashCode, getRotation } from '../utils/hash'

export default function MatrixCard({ assumption, isOverlay = false, onUnmap, isSelected = false, onSelect, square = false }) {
  const ringData = guidedQuestions[assumption.ring]
  const postitBg = ringData.postitBg
  const postitText = ringData.postitText
  const ringColor = ringData.color
  const ringLabel = ringData.label
  const rotation = getRotation(assumption.id, 3)
  const isClueless = assumption.quadrant === 'clueless'
  const hasQuadrant = assumption.quadrant != null

  // Entry animation rotation (larger swing)
  const enterRotation = rotation + (hashCode(assumption.id) % 2 === 0 ? 10 : -10)

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

  // Merge dnd-kit transform with our rotation
  const dndTransform = CSS.Transform.toString(transform)
  const style = {
    transform: dndTransform
      ? `${dndTransform} rotate(${rotation}deg)`
      : undefined,
    transition,
    opacity: isDragging ? 0.4 : 1,
    backgroundColor: postitBg,
    '--postit-rotation': `${rotation}deg`,
    '--postit-enter-rotation': `${enterRotation}deg`,
  }

  // Overlay mode: slightly rotated, bigger shadow, no transform from sortable
  const overlayStyle = isOverlay
    ? {
        transform: `rotate(${rotation + 3}deg) scale(1.05)`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)',
        cursor: 'grabbing',
        backgroundColor: postitBg,
      }
    : {}

  function handleClick(e) {
    if (e.target.closest('[data-unmap-btn]')) return
    if (onSelect) {
      onSelect(assumption.id)
    }
  }

  return (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      style={!isOverlay ? style : overlayStyle}
      {...(!isOverlay ? { ...attributes, ...listeners } : {})}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e)
        }
      }}
      className={`
        group relative rounded-sm p-2.5 min-h-[44px] touch-manipulation cursor-grab
        ${square ? 'aspect-square flex flex-col postit-card' : ''}
        ${isOverlay ? 'z-50' : ''}
        ${isSelected ? 'ring-2 ring-accent ring-offset-1 ring-offset-navy-900' : ''}
        ${isDragging ? 'z-10' : ''}
      `}
      role="button"
      tabIndex={0}
      aria-label={`Assumption: ${assumption.text}`}
    >
      {/* Paper fold corner */}
      <div
        className="absolute top-0 right-0 w-4 h-4"
        style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)' }}
      />

      {/* Tape strip */}
      {!isDragging && !isOverlay && (
        <div
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-2 rounded-sm"
          style={{
            background: 'rgba(255,255,255,0.5)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        />
      )}

      {/* Clueless indicator */}
      {isClueless && !isOverlay && (
        <span className="absolute -top-1.5 -left-1.5 text-xs leading-none" aria-label="In Clueless Corner">
          ⚠️
        </span>
      )}

      {/* Unmap button */}
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
            min-w-[20px] min-h-[20px] z-10
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
        className={`text-[11px] sm:text-xs leading-snug font-medium ${square ? 'flex-1 flex items-center justify-center text-center' : 'line-clamp-3'}`}
        style={{ color: postitText }}
      >
        {assumption.text}
      </p>

      {/* Ring dot + label */}
      <div className={`flex items-center gap-1 ${square ? 'mt-auto pt-1' : 'mt-1.5'}`}>
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
}
