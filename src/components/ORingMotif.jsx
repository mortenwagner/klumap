import guidedQuestions from '../data/guided-questions.json'

const RING_ORDER = ['opportunity', 'offering', 'operation']

export default function ORingMotif({ size = 120 }) {
  const center = size / 2
  const rings = RING_ORDER.map((name, i) => ({
    r: size * (0.18 + i * 0.12),
    color: guidedQuestions[name].color,
    opacity: 0.8 - i * 0.2,
  }))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-motif">
      {rings.map((ring, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeWidth={2}
          opacity={ring.opacity}
        />
      ))}
      <circle cx={center} cy={center} r={3} fill={guidedQuestions.opportunity.color} opacity={0.9} />
    </svg>
  )
}
