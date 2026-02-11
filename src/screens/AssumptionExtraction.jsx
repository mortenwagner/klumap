import { useState, useRef } from 'react'
import { useAppState, useDispatch } from '../state/AppContext'
import ORingSelector from '../components/ORingSelector'
import AssumptionCard from '../components/AssumptionCard'
import guidedQuestions from '../data/guided-questions.json'

const RING_ORDER = Object.keys(guidedQuestions)

export default function AssumptionExtraction() {
  const { assumptions, activeRing } = useAppState()
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const ringData = guidedQuestions[activeRing]
  const ringColor = ringData.color
  const filteredAssumptions = assumptions.filter((a) => a.ring === activeRing)
  const totalCount = assumptions.length
  const canProceed = totalCount >= 3

  // Counts per ring
  const counts = {
    opportunity: assumptions.filter((a) => a.ring === 'opportunity').length,
    offering: assumptions.filter((a) => a.ring === 'offering').length,
    operation: assumptions.filter((a) => a.ring === 'operation').length,
  }

  function handleAdd() {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_ASSUMPTION', text: trimmed, ring: activeRing })
    setInputValue('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  function handleChipClick(starter) {
    setInputValue(starter)
    inputRef.current?.focus()
  }

  function handleRingClick(ring) {
    dispatch({ type: 'SET_ACTIVE_RING', ring })
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-5xl mx-auto w-full px-4 py-8 gap-8">
      {/* Left panel — ORingSelector (desktop only) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:shrink-0 lg:pt-4">
        <ORingSelector
          activeRing={activeRing}
          onRingClick={handleRingClick}
          assumptionCounts={counts}
        />
      </aside>

      {/* Mobile ring tab pills (visible below lg) */}
      <div className="flex lg:hidden gap-2">
        {RING_ORDER.map((ring) => {
          const isActive = activeRing === ring
          const color = guidedQuestions[ring].color
          const count = counts[ring]
          return (
            <button
              key={ring}
              onClick={() => handleRingClick(ring)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 min-h-[44px] flex-1 justify-center
                ${isActive
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/[0.07]'
                }
              `}
              style={isActive ? { borderColor: `${color}40` } : {}}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: color, opacity: isActive ? 1 : 0.4 }}
              />
              <span className={isActive ? 'text-white' : ''}>
                {guidedQuestions[ring].label}
              </span>
              {count > 0 && (
                <span
                  className="text-xs font-mono px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right panel — Input area + cards */}
      <div className="flex-1 flex flex-col min-w-0 gap-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold">Surface your assumptions</h2>
          <p className="text-white/40 text-sm">
            What do you believe to be true about your venture? Include both tested and untested assumptions — you'll sort them next.
          </p>
        </div>

        {/* Ring context line */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold" style={{ color: ringColor }}>
            {ringData.label}
          </span>
          <span className="text-white/30">—</span>
          <span className="text-white/40">{ringData.subtitle}</span>
        </div>

        {/* Guided question chips */}
        <div className="flex flex-wrap gap-2">
          {ringData.questions.map((q) => (
            <button
              key={q.question}
              onClick={() => handleChipClick(q.starter)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full
                         text-sm text-white/60 transition-colors duration-200
                         hover:border-current min-h-[36px]"
              style={{ '--tw-border-opacity': 1 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ringColor}60` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '' }}
            >
              {q.question}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an assumption or pick a question above..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                       text-white placeholder:text-white/20 text-sm
                       focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10
                       transition-colors min-h-[44px]"
          />
          <button
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200
                       min-h-[44px] min-w-[44px] shrink-0
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:brightness-110 active:scale-[0.98]"
            style={{
              backgroundColor: inputValue.trim() ? ringColor : `${ringColor}40`,
              color: '#0f0f1a',
            }}
          >
            Add
          </button>
        </div>

        {/* Assumption cards — board zone */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 bg-white/[0.02] rounded-xl p-4 -mx-1">
          {filteredAssumptions.length === 0 ? (
            <p className="text-white/20 text-sm italic py-8 text-center">
              No {ringData.label} assumptions yet. Use the questions above for inspiration.
            </p>
          ) : (
            filteredAssumptions.map((assumption) => (
              <AssumptionCard key={assumption.id} assumption={assumption} />
            ))
          )}
        </div>

        {/* All assumptions count */}
        {totalCount > 0 && (
          <div className="text-sm text-white/30 flex items-center gap-1 flex-wrap">
            <span>{totalCount} assumption{totalCount !== 1 ? 's' : ''} total</span>
            <span className="text-white/15">(</span>
            {RING_ORDER.map((ring, i) => (
              <span key={ring} className="inline-flex items-center gap-1">
                {i > 0 && <span className="text-white/15">,</span>}
                <span style={{ color: guidedQuestions[ring].color }}>{counts[ring]}</span>
                <span className="text-white/20">{guidedQuestions[ring].label}</span>
              </span>
            ))}
            <span className="text-white/15">)</span>
          </div>
        )}

        {/* Guidance text */}
        <p className="text-white/20 text-xs italic">
          Capture everything — proven or not. Mapping what you know alongside what you don't is just as valuable.
        </p>

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
              Map Priority &rarr;
            </button>
            {!canProceed && (
              <span className="text-white/20 text-xs">
                Add at least 3 assumptions to continue
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
