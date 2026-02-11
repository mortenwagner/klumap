import guidedQuestions from '../data/guided-questions.json'

const RING_RADII = { opportunity: 30, offering: 55, operation: 80 }
const RING_ORDER = ['opportunity', 'offering', 'operation']
const RINGS = RING_ORDER.map((name) => ({
  name,
  color: guidedQuestions[name].color,
  r: RING_RADII[name],
  label: guidedQuestions[name].label,
}))

export default function ORingSelector({ activeRing, onRingClick, assumptionCounts = {} }) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* SVG Ring Visualization */}
      <svg
        viewBox="0 0 200 200"
        className="w-48 h-48"
        role="img"
        aria-label="O-Ring layer selector"
      >
        {/* Center dot */}
        <circle cx="100" cy="100" r="4" fill="#4ECDC4" opacity="0.8" />

        {/* Rings — rendered outermost first so inner rings are on top for click priority */}
        {[...RINGS].reverse().map((ring) => {
          const isActive = activeRing === ring.name
          return (
            <g key={ring.name}>
              {/* Invisible wider hit area for 44px tap target */}
              <circle
                cx="100"
                cy="100"
                r={ring.r}
                fill="none"
                stroke="transparent"
                strokeWidth="22"
                className="cursor-pointer"
                onClick={() => onRingClick(ring.name)}
                role="button"
                aria-label={`Select ${ring.label} ring`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onRingClick(ring.name)
                  }
                }}
              />
              {/* Visible ring stroke */}
              <circle
                cx="100"
                cy="100"
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={isActive ? 3 : 2}
                opacity={isActive ? 1 : 0.4}
                className="pointer-events-none transition-all duration-300"
                style={isActive ? {
                  filter: `drop-shadow(0 0 8px ${ring.color}60)`,
                  animation: 'pulse-ring 2s ease-in-out infinite',
                } : {}}
              />
            </g>
          )
        })}

        <style>{`
          @keyframes pulse-ring {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </svg>

      {/* Labels with dots and counts */}
      <div className="flex flex-col gap-2 w-full">
        {RINGS.map((ring) => {
          const isActive = activeRing === ring.name
          const count = assumptionCounts[ring.name] || 0
          return (
            <button
              key={ring.name}
              onClick={() => onRingClick(ring.name)}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-left
                transition-all duration-200 min-h-[44px]
                ${isActive
                  ? 'bg-white/5'
                  : 'hover:bg-white/[0.03]'
                }
              `}
            >
              {/* Colored dot */}
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 transition-opacity duration-200"
                style={{
                  backgroundColor: ring.color,
                  opacity: isActive ? 1 : 0.4,
                }}
              />
              {/* Ring name */}
              <span className={`text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-white/40'
              }`}>
                {ring.label}
              </span>
              {/* Count badge */}
              {count > 0 && (
                <span
                  className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded-md transition-opacity duration-200"
                  style={{
                    backgroundColor: `${ring.color}15`,
                    color: ring.color,
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
    </div>
  )
}
