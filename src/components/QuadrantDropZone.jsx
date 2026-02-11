import { useDroppable } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import MatrixCard from './MatrixCard'

/**
 * QuadrantDropZone — a droppable zone in the 2x2 Clueless Corner matrix.
 *
 * Props:
 * - quadrantKey: 'clueless' | 'validated' | 'nice-to-know' | 'known'
 * - quadrantData: { label, icon, description, color, bgOpacity } from quadrants.json
 * - assumptions: array of assumptions mapped to this quadrant
 * - onUnmap: (id) => void
 * - selectedCardId: string | null — for mobile tap-to-assign
 * - onQuadrantTap: (quadrantKey) => void — for mobile tap-to-assign
 * - onSelectCard: (id) => void — for mobile tap-to-assign
 */
export default function QuadrantDropZone({
  quadrantKey,
  quadrantData,
  assumptions,
  onUnmap,
  selectedCardId,
  onQuadrantTap,
  onSelectCard,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: quadrantKey,
    data: {
      type: 'quadrant',
      quadrantKey,
    },
  })

  const isClueless = quadrantKey === 'clueless'
  const isEmpty = assumptions.length === 0
  const count = assumptions.length

  return (
    <div
      ref={setNodeRef}
      onClick={() => {
        if (onQuadrantTap && selectedCardId) {
          onQuadrantTap(quadrantKey)
        }
      }}
      className={`
        relative rounded-xl border p-3 sm:p-4 min-h-[160px] sm:min-h-[200px]
        transition-all duration-200 flex flex-col
        ${isClueless ? 'clueless-quadrant' : ''}
        ${isOver
          ? 'border-white/40 scale-[1.01]'
          : 'border-white/[0.06]'
        }
        ${selectedCardId ? 'cursor-pointer hover:border-white/30' : ''}
      `}
      style={{
        backgroundColor: isOver
          ? `${quadrantData.color}18`
          : `${quadrantData.color}${Math.round(quadrantData.bgOpacity * 255).toString(16).padStart(2, '0')}`,
        borderColor: isOver ? `${quadrantData.color}60` : undefined,
      }}
    >
      {/* Header row: icon + label + count badge */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5">
          {quadrantData.icon && (
            <span className="text-sm">{quadrantData.icon}</span>
          )}
          <h3
            className="text-xs sm:text-sm font-semibold"
            style={{ color: quadrantData.color }}
          >
            {quadrantData.label}
          </h3>
        </div>
        {count > 0 && (
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: `${quadrantData.color}20`,
              color: quadrantData.color,
            }}
          >
            {count}
          </span>
        )}
      </div>

      {/* Empty state description */}
      {isEmpty && (
        <p className="text-white/20 text-[11px] sm:text-xs italic flex-1 flex items-center justify-center text-center px-2">
          {quadrantData.description}
        </p>
      )}

      {/* Cards */}
      <SortableContext items={assumptions.map((a) => a.id)} strategy={rectSortingStrategy}>
        <div className={`
          flex-1 grid gap-2
          ${count === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}
        `}>
          {assumptions.map((assumption) => (
            <MatrixCard
              key={assumption.id}
              assumption={assumption}
              onUnmap={onUnmap}
              isSelected={selectedCardId === assumption.id}
              onSelect={onSelectCard}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
