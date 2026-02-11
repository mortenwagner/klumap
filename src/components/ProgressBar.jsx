import { useAppState } from '../state/AppContext'

const steps = [
  { num: 1, label: 'Frame' },
  { num: 2, label: 'Extract' },
  { num: 3, label: 'Map' },
  { num: 4, label: 'Test' },
]

export default function ProgressBar() {
  const { currentScreen } = useAppState()

  if (currentScreen === 0) return null

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {steps.map((step, i) => {
        const isActive = currentScreen === step.num
        const isComplete = currentScreen > step.num

        return (
          <div key={step.num} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${isComplete
                    ? 'bg-accent text-navy-900'
                    : isActive
                      ? 'bg-white/20 text-white ring-2 ring-accent'
                      : 'bg-white/5 text-white/30'
                  }
                `}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-sm hidden sm:inline transition-colors duration-300 ${
                  isActive ? 'text-white font-medium' : isComplete ? 'text-white/60' : 'text-white/30'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px transition-colors duration-300 ${
                  isComplete ? 'bg-accent' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
