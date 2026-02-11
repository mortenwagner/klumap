import { useState, useCallback, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  pointerWithin,
  rectIntersection,
  closestCenter,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useAppState, useDispatch } from '../state/AppContext'
import QuadrantDropZone from '../components/QuadrantDropZone'
import MatrixCard from '../components/MatrixCard'
import quadrantsConfig from '../data/quadrants.json'

const QUADRANT_ORDER = ['clueless', 'validated', 'nice-to-know', 'known']

/**
 * Custom collision detection: prefer quadrant drop zones,
 * fall back to closest center for card-to-card.
 */
function customCollisionDetection(args) {
  // First check pointer-within for quadrant zones
  const pointerCollisions = pointerWithin(args)
  if (pointerCollisions.length > 0) {
    // Prefer quadrant droppables over card droppables
    const quadrantHit = pointerCollisions.find(
      (c) => c.data?.droppableContainer?.data?.current?.type === 'quadrant'
    )
    if (quadrantHit) return [quadrantHit]
    return pointerCollisions
  }

  // Fallback to rect intersection then closest center
  const rectCollisions = rectIntersection(args)
  if (rectCollisions.length > 0) return rectCollisions

  return closestCenter(args)
}

export default function CluelessCorner() {
  const { assumptions } = useAppState()
  const dispatch = useDispatch()

  const [activeId, setActiveId] = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)

  // Sensors with activation constraints to distinguish tap from drag
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const sensors = useSensors(pointerSensor, touchSensor)

  // Partition assumptions
  const unmappedAssumptions = useMemo(
    () => assumptions.filter((a) => a.quadrant == null),
    [assumptions]
  )
  const mappedByQuadrant = useMemo(() => {
    const map = {}
    for (const key of QUADRANT_ORDER) {
      map[key] = assumptions.filter((a) => a.quadrant === key)
    }
    return map
  }, [assumptions])

  const totalCount = assumptions.length
  const mappedCount = assumptions.filter((a) => a.quadrant != null).length
  const cluelessCount = mappedByQuadrant['clueless'].length
  const canProceed = cluelessCount >= 1

  const activeAssumption = activeId
    ? assumptions.find((a) => a.id === activeId)
    : null

  // --- Handlers ---

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
    setSelectedCardId(null) // Clear tap selection when dragging
  }, [])

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event
      setActiveId(null)

      if (!over) return

      const activeAssumptionData = active.data?.current?.assumption
      if (!activeAssumptionData) return

      // Determine target quadrant
      let targetQuadrant = null

      if (over.data?.current?.type === 'quadrant') {
        // Dropped directly onto a quadrant zone
        targetQuadrant = over.data.current.quadrantKey
      } else if (over.data?.current?.type === 'assumption') {
        // Dropped onto another card — adopt that card's quadrant
        targetQuadrant = over.data.current.assumption.quadrant
      }

      // If dropped back on unmapped sidebar, unmap it
      if (over.id === 'unmapped-sidebar') {
        targetQuadrant = null
      }

      // Only dispatch if quadrant actually changed
      if (targetQuadrant !== activeAssumptionData.quadrant) {
        dispatch({
          type: 'UPDATE_ASSUMPTION',
          id: active.id,
          updates: { quadrant: targetQuadrant },
        })
      }
    },
    [dispatch]
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
  }, [])

  const handleUnmap = useCallback(
    (id) => {
      dispatch({
        type: 'UPDATE_ASSUMPTION',
        id,
        updates: { quadrant: null },
      })
      setSelectedCardId(null)
    },
    [dispatch]
  )

  // Mobile tap-to-assign
  const handleSelectCard = useCallback((id) => {
    setSelectedCardId((prev) => (prev === id ? null : id))
  }, [])

  const handleQuadrantTap = useCallback(
    (quadrantKey) => {
      if (!selectedCardId) return
      dispatch({
        type: 'UPDATE_ASSUMPTION',
        id: selectedCardId,
        updates: { quadrant: quadrantKey },
      })
      setSelectedCardId(null)
    },
    [selectedCardId, dispatch]
  )

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold">Map your assumptions</h2>
        <p className="text-white/40 text-sm">
          Drag each assumption into the quadrant that best fits. How important is it,
          and how much evidence do you have?
        </p>
      </div>

      {/* Live counter */}
      <div className="text-sm text-white/40 flex items-center gap-2 flex-wrap">
        <span style={{ color: '#c8956a' }} className="font-medium">
          {cluelessCount} assumption{cluelessCount !== 1 ? 's' : ''} in the Clueless Corner
        </span>
        <span className="text-white/15">&middot;</span>
        <span>{mappedCount}/{totalCount} mapped</span>
      </div>

      {/* Mobile tap hint */}
      {selectedCardId && (
        <div className="lg:hidden text-xs text-accent animate-pulse">
          Tap a quadrant to place the selected assumption
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0">
          {/* Unmapped sidebar */}
          <UnmappedSidebar
            assumptions={unmappedAssumptions}
            selectedCardId={selectedCardId}
            onSelectCard={handleSelectCard}
          />

          {/* Matrix area */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Top axis label (desktop) */}
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-white/25 pl-1 mb-1">
              <span>&uarr;</span>
              <span>High Importance</span>
            </div>

            {/* 2x2 grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1">
              {QUADRANT_ORDER.map((key) => (
                <QuadrantDropZone
                  key={key}
                  quadrantKey={key}
                  quadrantData={quadrantsConfig.quadrants[key]}
                  assumptions={mappedByQuadrant[key]}
                  onUnmap={handleUnmap}
                  selectedCardId={selectedCardId}
                  onQuadrantTap={handleQuadrantTap}
                  onSelectCard={handleSelectCard}
                />
              ))}
            </div>

            {/* Bottom axis labels (desktop) */}
            <div className="hidden lg:flex items-center justify-between text-[11px] text-white/25 px-1 mt-1">
              <span>Low Evidence</span>
              <span>High Evidence &rarr;</span>
            </div>
          </div>
        </div>

        {/* Drag overlay — rendered outside the layout for correct z-index */}
        <DragOverlay dropAnimation={null}>
          {activeAssumption ? (
            <MatrixCard assumption={activeAssumption} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

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

/**
 * UnmappedSidebar — shows unmapped assumption cards.
 * Horizontal scroll on mobile, vertical sidebar on desktop.
 */
function UnmappedSidebar({ assumptions, selectedCardId, onSelectCard }) {
  const { setNodeRef } = useDroppableZone('unmapped-sidebar')
  const isEmpty = assumptions.length === 0

  return (
    <div
      ref={setNodeRef}
      className={`
        lg:w-[240px] lg:shrink-0 rounded-xl border border-white/[0.06]
        bg-white/[0.02] p-3 sm:p-4
        ${isEmpty ? 'min-h-[80px] lg:min-h-0' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-white/50">
          Unmapped
        </h3>
        {assumptions.length > 0 && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 text-white/30">
            {assumptions.length}
          </span>
        )}
      </div>

      {isEmpty ? (
        <p className="text-white/15 text-xs italic text-center py-4">
          All assumptions mapped!
        </p>
      ) : (
        <SortableContext items={assumptions.map((a) => a.id)} strategy={rectSortingStrategy}>
          {/* Horizontal scroll on mobile, vertical on desktop */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[calc(100vh-400px)] pb-1 lg:pb-0 -mx-1 px-1">
            {assumptions.map((assumption) => (
              <div key={assumption.id} className="shrink-0 w-[160px] sm:w-[180px] lg:w-full">
                <MatrixCard
                  assumption={assumption}
                  isSelected={selectedCardId === assumption.id}
                  onSelect={onSelectCard}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  )
}

/**
 * Small hook wrapper so UnmappedSidebar can be a drop target.
 */
function useDroppableZone(id) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'sidebar' },
  })
  return { setNodeRef, isOver }
}
