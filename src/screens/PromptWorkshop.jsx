import { useState, useMemo, useCallback } from 'react'
import { useAppState, useDispatch } from '../state/AppContext'
import guidedQuestions from '../data/guided-questions.json'
import approaches from '../data/prompts'
import { approachById } from '../data/prompts'
import { generatePrompt } from '../utils/promptEngine'

const PROMPT_STYLES = [
  { key: 'focused', label: 'Focused', icon: '🎯' },
  { key: 'exploratory', label: 'Exploratory', icon: '🧭' },
  { key: 'devils-advocate', label: "Devil's Advocate", icon: '😈' },
]

export default function PromptWorkshop() {
  const { assumptions, venture } = useAppState()
  const dispatch = useDispatch()

  const [copiedSingle, setCopiedSingle] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)

  // Only show clueless-corner assumptions
  const cluelessAssumptions = useMemo(
    () => assumptions.filter((a) => a.quadrant === 'clueless'),
    [assumptions]
  )

  // Track active assumption by ID — default to first clueless one
  const [activeId, setActiveId] = useState(() =>
    cluelessAssumptions.length > 0 ? cluelessAssumptions[0].id : null
  )

  const activeAssumption = useMemo(
    () => cluelessAssumptions.find((a) => a.id === activeId) || cluelessAssumptions[0] || null,
    [cluelessAssumptions, activeId]
  )

  // Generate the prompt for the active assumption
  const renderedPrompt = useMemo(() => {
    if (!activeAssumption?.selectedApproach) return ''
    return generatePrompt({
      assumption: activeAssumption,
      venture,
      approachId: activeAssumption.selectedApproach,
      style: activeAssumption.promptStyle || 'focused',
    })
  }, [activeAssumption, venture])

  // Handlers

  const handleSelectAssumption = useCallback((id) => {
    setActiveId(id)
  }, [])

  const handleSelectApproach = useCallback(
    (approachId) => {
      if (!activeAssumption) return
      dispatch({
        type: 'UPDATE_ASSUMPTION',
        id: activeAssumption.id,
        updates: { selectedApproach: approachId },
      })
    },
    [activeAssumption, dispatch]
  )

  const handleSelectStyle = useCallback(
    (style) => {
      if (!activeAssumption) return
      dispatch({
        type: 'UPDATE_ASSUMPTION',
        id: activeAssumption.id,
        updates: { promptStyle: style },
      })
    },
    [activeAssumption, dispatch]
  )

  const handleCopySingle = useCallback(async () => {
    if (!renderedPrompt) return
    try {
      await navigator.clipboard.writeText(renderedPrompt)
      setCopiedSingle(true)
      setTimeout(() => setCopiedSingle(false), 2000)
    } catch {
      // Fallback: select text for manual copy
    }
  }, [renderedPrompt])

  const handleCopyAll = useCallback(async () => {
    const allPrompts = cluelessAssumptions
      .filter((a) => a.selectedApproach)
      .map((a) => {
        const prompt = generatePrompt({
          assumption: a,
          venture,
          approachId: a.selectedApproach,
          style: a.promptStyle || 'focused',
        })
        return `## ${a.text}\n(${approachById[a.selectedApproach]?.name} — ${a.promptStyle || 'focused'})\n\n${prompt}`
      })

    if (allPrompts.length === 0) return

    const combined = allPrompts.join('\n\n---\n\n')
    try {
      await navigator.clipboard.writeText(combined)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch {
      // Fallback
    }
  }, [cluelessAssumptions, venture])

  const configuredCount = cluelessAssumptions.filter((a) => a.selectedApproach).length

  // Empty state
  if (cluelessAssumptions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Prompt Workshop</h2>
          <p className="text-white/40">No assumptions in the Clueless Corner yet. Go back and map your priorities.</p>
          <button
            onClick={() => dispatch({ type: 'PREV_SCREEN' })}
            className="btn-secondary"
          >
            &larr; Back to Mapping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-6 sm:py-8 gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold">Prompt Workshop</h2>
        <p className="text-white/40 text-sm">
          Choose a validation approach for each assumption, then copy the generated prompt into your favorite AI tool.
        </p>
      </div>

      {/* Two-panel layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 min-h-0">
        {/* Left sidebar — assumption list */}
        <aside className="lg:w-[260px] lg:shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-semibold text-white/50">
              Clueless Corner
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 text-white/30">
              {cluelessAssumptions.length}
            </span>
          </div>

          {/* Horizontal on mobile, vertical on desktop */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[calc(100vh-360px)] pb-1 lg:pb-0 -mx-1 px-1">
            {cluelessAssumptions.map((assumption) => {
              const ringData = guidedQuestions[assumption.ring]
              const isActive = activeAssumption?.id === assumption.id
              const approach = assumption.selectedApproach
                ? approachById[assumption.selectedApproach]
                : null

              return (
                <button
                  key={assumption.id}
                  onClick={() => handleSelectAssumption(assumption.id)}
                  className={`
                    shrink-0 w-[200px] lg:w-full text-left px-3 py-2.5 rounded-lg
                    transition-all duration-200 min-h-[44px]
                    ${isActive
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/[0.03] border border-transparent hover:bg-white/[0.06] hover:border-white/10'
                    }
                  `}
                  style={isActive ? { borderColor: `${ringData.color}40` } : {}}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ backgroundColor: ringData.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug line-clamp-2 ${isActive ? 'text-white' : 'text-white/60'}`}>
                        {assumption.text}
                      </p>
                      {approach && (
                        <span className="text-[10px] text-white/30 mt-0.5 inline-flex items-center gap-1">
                          <span>{approach.icon}</span>
                          <span>{approach.name}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {activeAssumption && (
            <>
              {/* Selected assumption card */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="shrink-0 mt-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${guidedQuestions[activeAssumption.ring].color}20`,
                      color: guidedQuestions[activeAssumption.ring].color,
                    }}
                  >
                    {guidedQuestions[activeAssumption.ring].label}
                  </span>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                    {activeAssumption.text}
                  </p>
                </div>
              </div>

              {/* Validation approach picker */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/60">
                  Choose a validation approach
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {approaches.map((approach) => {
                    const isSelected = activeAssumption.selectedApproach === approach.id
                    const isAffinityMatch = approach.ringAffinity.includes(activeAssumption.ring)

                    return (
                      <button
                        key={approach.id}
                        onClick={() => handleSelectApproach(approach.id)}
                        className={`
                          flex flex-col items-start gap-1.5 p-3 sm:p-4 rounded-xl border text-left
                          transition-all duration-200 min-h-[44px]
                          ${isSelected
                            ? 'border-accent/50 bg-accent/10 ring-1 ring-accent/25'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                          }
                        `}
                      >
                        <span className="text-xl sm:text-2xl">{approach.icon}</span>
                        <span className={`font-medium text-xs sm:text-sm leading-tight ${isSelected ? 'text-white' : 'text-white/70'}`}>
                          {approach.name}
                        </span>
                        <span className={`text-[10px] sm:text-xs leading-snug ${isSelected ? 'text-white/50' : 'text-white/30'}`}>
                          {approach.shortDescription}
                        </span>
                        {isAffinityMatch && !isSelected && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full mt-0.5"
                            style={{
                              backgroundColor: `${guidedQuestions[activeAssumption.ring].color}15`,
                              color: guidedQuestions[activeAssumption.ring].color,
                            }}
                          >
                            Recommended
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Prompt style toggle + prompt display (only when approach selected) */}
              {activeAssumption.selectedApproach && (
                <>
                  {/* Prompt style toggle */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/60">
                      Prompt style
                    </h3>
                    <div className="flex gap-2">
                      {PROMPT_STYLES.map((style) => {
                        const isActive = (activeAssumption.promptStyle || 'focused') === style.key
                        return (
                          <button
                            key={style.key}
                            onClick={() => handleSelectStyle(style.key)}
                            className={`
                              inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                              transition-all duration-200 min-h-[44px]
                              ${isActive
                                ? 'bg-accent/20 text-accent border border-accent/40'
                                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                              }
                            `}
                          >
                            <span>{style.icon}</span>
                            <span className="hidden sm:inline">{style.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Prompt display */}
                  <div className="relative">
                    {/* Copy button */}
                    <button
                      onClick={handleCopySingle}
                      className={`
                        absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200 min-h-[36px]
                        ${copiedSingle
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/10 text-white/60 border border-white/10 hover:bg-white/15 hover:text-white/80'
                        }
                      `}
                    >
                      {copiedSingle ? 'Copied!' : 'Copy'}
                    </button>

                    <div className="rounded-xl bg-navy-800 border border-white/[0.06] p-4 sm:p-6 pr-20">
                      <pre className="font-mono text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                        {renderedPrompt}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Copy All Prompts button */}
          {configuredCount > 1 && (
            <button
              onClick={handleCopyAll}
              className={`
                self-start inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 min-h-[44px]
                ${copiedAll
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70'
                }
              `}
            >
              {copiedAll
                ? 'All prompts copied!'
                : `Copy all ${configuredCount} prompts`
              }
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 pb-4">
        <button
          onClick={() => dispatch({ type: 'PREV_SCREEN' })}
          className="btn-secondary text-sm"
        >
          &larr; Back
        </button>
        <p className="text-white/20 text-xs text-right max-w-[280px]">
          Your prompts are generated in your browser — nothing is sent anywhere.
        </p>
      </div>
    </div>
  )
}
