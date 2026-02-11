import { useAppState, useDispatch } from '../state/AppContext'

const stages = [
  { value: 'idea', emoji: '💡', label: 'Idea', description: 'I think there\'s something here' },
  { value: 'exploring', emoji: '🔬', label: 'Exploring', description: 'I\'m testing the waters' },
  { value: 'building', emoji: '🏗️', label: 'Building', description: 'We\'re making it real' },
  { value: 'scaling', emoji: '📈', label: 'Scaling', description: 'We need to grow' },
]

export default function VentureFraming() {
  const { venture } = useAppState()
  const dispatch = useDispatch()

  const canProceed = venture.name.trim() && venture.description.trim() && venture.stage

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Frame your venture</h2>
          <p className="text-white/40 text-sm">
            Just enough context to make your validation prompts personal and actionable.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Venture name */}
          <div className="space-y-2">
            <label htmlFor="venture-name" className="block text-sm font-medium text-white/60">
              Venture name
            </label>
            <input
              id="venture-name"
              type="text"
              value={venture.name}
              onChange={(e) => dispatch({ type: 'SET_VENTURE_FIELD', field: 'name', value: e.target.value })}
              placeholder="e.g. MealKit, GreenFleet, SkillBridge"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder:text-white/20
                         focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25
                         transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="venture-desc" className="block text-sm font-medium text-white/60">
              One-liner description
            </label>
            <input
              id="venture-desc"
              type="text"
              value={venture.description}
              onChange={(e) => dispatch({ type: 'SET_VENTURE_FIELD', field: 'description', value: e.target.value })}
              placeholder="e.g. A subscription meal kit for busy parents who want healthy dinners"
              maxLength={150}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder:text-white/20
                         focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25
                         transition-colors"
            />
            <p className="text-xs text-white/20 text-right">{venture.description.length}/150</p>
          </div>

          {/* Stage selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/60">
              Stage
            </label>
            <div className="grid grid-cols-2 gap-3">
              {stages.map((stage) => {
                const isSelected = venture.stage === stage.value
                return (
                  <button
                    key={stage.value}
                    onClick={() => dispatch({ type: 'SET_VENTURE_FIELD', field: 'stage', value: stage.value })}
                    className={`
                      flex flex-col items-start gap-1 p-4 rounded-xl border text-left
                      transition-all duration-200 min-h-[44px]
                      ${isSelected
                        ? 'border-accent/50 bg-accent/10 ring-1 ring-accent/25'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{stage.emoji}</span>
                      <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-white/70'}`}>
                        {stage.label}
                      </span>
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-white/50' : 'text-white/30'}`}>
                      {stage.description}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => dispatch({ type: 'PREV_SCREEN' })}
            className="btn-secondary text-sm"
          >
            ← Back
          </button>
          <button
            onClick={() => dispatch({ type: 'NEXT_SCREEN' })}
            disabled={!canProceed}
            className={`btn-primary ${!canProceed ? 'opacity-30 cursor-not-allowed hover:scale-100 hover:brightness-100' : ''}`}
          >
            Start Mapping →
          </button>
        </div>
      </div>
    </div>
  )
}
