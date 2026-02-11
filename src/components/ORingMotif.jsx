export default function ORingMotif({ size = 120 }) {
  const center = size / 2
  const rings = [
    { r: size * 0.18, color: '#4ECDC4', opacity: 0.8 },
    { r: size * 0.30, color: '#FFB347', opacity: 0.6 },
    { r: size * 0.42, color: '#FF6B6B', opacity: 0.4 },
  ]

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
      <circle cx={center} cy={center} r={3} fill="#4ECDC4" opacity={0.9} />

      <style>{`
        @keyframes motifPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-motif {
          animation: motifPulse 4s ease-in-out infinite;
        }
      `}</style>
    </svg>
  )
}
