import { useState, useEffect, useCallback } from 'react'

// ── Post-it colors ──────────────────────────────────

const POSTIT_COLORS = [
  { bg: '#FDEB71', text: '#5c4b00' },
  { bg: '#FFB3C6', text: '#6b1a30' },
  { bg: '#A7F3D0', text: '#14532d' },
  { bg: '#93C5FD', text: '#1e3a5f' },
  { bg: '#FCD34D', text: '#713f12' },
  { bg: '#C4B5FD', text: '#3b1f7e' },
]

// ── Scenarios ──────────────────────────────────────────

const scenarios = [
  {
    assumptions: [
      { text: 'Parents will pay €12/meal for healthy kits', color: 0, rotation: -3, fromX: -140, fromY: -80 },
      { text: 'They want healthy, not just fast', color: 1, rotation: 2.5, fromX: 150, fromY: -60 },
      { text: 'We can source & deliver fresh in 24h', color: 2, rotation: -1.5, fromX: -120, fromY: 90 },
      { text: 'Subscription beats one-off purchases', color: 3, rotation: 2, fromX: 140, fromY: 70 },
    ],
    prompt: 'Help me design a smoke test to validate whether busy parents would pay €12/meal for weekly healthy meal kits. What conversion rate from a "Pre-order" button signals real demand versus polite interest? What\'s the minimum traffic I need for a meaningful signal?',
    answer: 'Create a landing page with meal photos, a clear €12/meal price, and a "Pre-order Now" button. Drive 300+ visitors via a targeted Facebook ad (€50–100, parents aged 28–42). A 3–5% click-through on the pre-order button suggests genuine willingness to pay. Below 1% is a kill signal — rethink price or proposition before building anything.',
  },
  {
    assumptions: [
      { text: 'Freelancers actively hate invoicing', color: 4, rotation: 1.5, fromX: 140, fromY: -70 },
      { text: 'AI can auto-categorize their expenses', color: 5, rotation: -2.5, fromX: -150, fromY: -40 },
      { text: 'They\'ll pay €9/mo to avoid spreadsheets', color: 0, rotation: 1, fromX: 130, fromY: 80 },
      { text: 'Acquisition cost stays under €30', color: 1, rotation: -2, fromX: -120, fromY: 60 },
    ],
    prompt: 'Play devil\'s advocate on my assumption that freelancers will prefer AI invoicing over spreadsheets. What are the 3 strongest reasons this assumption is probably wrong? What cognitive biases might make me believe this despite evidence?',
    answer: 'Spreadsheets are free, familiar, and "good enough." Most freelancers invoice fewer than 10 clients — the pain is low. You may be suffering from the curse of knowledge: you see invoicing as broken because you\'re deep in the problem. Ask 20 freelancers to rank their top 5 business pains — if invoicing isn\'t top 3, reconsider your entire premise.',
  },
]

// ── Phase timing ──────────────────────────────────────

const PHASE_POSTITS = 4000
const PHASE_TYPEWRITER = 5500
const PHASE_MATRIX = 5000
const PHASE_PAUSE = 2000
const TOTAL_CYCLE = PHASE_POSTITS + PHASE_TYPEWRITER + PHASE_MATRIX + PHASE_PAUSE

// ── Component ──────────────────────────────────────────

export default function JourneyAnimation() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [phase, setPhase] = useState('postits')
  const [visiblePostits, setVisiblePostits] = useState(0)
  const [typedChars, setTypedChars] = useState(0)
  const [revealedLines, setRevealedLines] = useState(0)
  const [matrixChars, setMatrixChars] = useState([])

  const scenario = scenarios[scenarioIdx]
  const answerLines = splitIntoLines(scenario.answer, 44)

  const resetCycle = useCallback(() => {
    setPhase('postits')
    setVisiblePostits(0)
    setTypedChars(0)
    setRevealedLines(0)
    setMatrixChars([])
  }, [])

  useEffect(() => {
    resetCycle()
    const timer = setInterval(() => {
      setScenarioIdx(prev => (prev + 1) % scenarios.length)
    }, TOTAL_CYCLE)
    return () => clearInterval(timer)
  }, [resetCycle])

  useEffect(() => { resetCycle() }, [scenarioIdx, resetCycle])

  // Phase: post-its fly in
  useEffect(() => {
    if (phase !== 'postits') return
    const count = scenario.assumptions.length
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisiblePostits(i)
      if (i >= count) {
        clearInterval(interval)
        setTimeout(() => setPhase('typewriter'), 800)
      }
    }, 600)
    return () => clearInterval(interval)
  }, [phase, scenario.assumptions.length])

  // Phase: typewriter
  useEffect(() => {
    if (phase !== 'typewriter') return
    let i = 0
    const interval = setInterval(() => {
      i += 2
      setTypedChars(i)
      if (i >= scenario.prompt.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('matrix'), 500)
      }
    }, 20)
    return () => clearInterval(interval)
  }, [phase, scenario.prompt])

  // Phase: matrix reveal
  useEffect(() => {
    if (phase !== 'matrix') return
    setMatrixChars(answerLines.map(l => l.split('').map(() => randomChar())))
    let line = 0
    const interval = setInterval(() => {
      line++
      setRevealedLines(line)
      if (line >= answerLines.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('pause'), 400)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [phase, answerLines.length])

  // Matrix scramble
  useEffect(() => {
    if (phase !== 'matrix') return
    const interval = setInterval(() => {
      setMatrixChars(prev =>
        prev.map((line, li) =>
          li < revealedLines ? answerLines[li].split('') : line.map(() => randomChar())
        )
      )
    }, 60)
    return () => clearInterval(interval)
  }, [phase, revealedLines, answerLines])

  const receded = phase !== 'postits'
  const showPrompt = phase === 'typewriter' || phase === 'matrix' || phase === 'pause'
  const showMatrix = phase === 'matrix' || phase === 'pause'

  return (
    <div className="h-full relative overflow-hidden select-none">
      {/* Phase label — pinned top */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <PhaseIndicator phase={phase} />
      </div>

      {/* Post-its layer — stays visible, shrinks and moves up */}
      <div
        className="absolute top-8 left-0 right-0 z-10 transition-all duration-700 ease-out origin-top"
        style={{
          transform: receded ? 'scale(0.72) translateY(-8%)' : 'scale(1)',
          opacity: receded ? 0.5 : 1,
        }}
      >
        <div className="grid grid-cols-2 gap-2.5 max-w-[340px] mx-auto">
          {scenario.assumptions.map((a, i) => {
            const postit = POSTIT_COLORS[a.color]
            const visible = i < visiblePostits

            return (
              <div
                key={i}
                style={{
                  transform: visible
                    ? `rotate(${a.rotation}deg)`
                    : `rotate(${a.rotation + 15}deg) translate(${a.fromX}px, ${a.fromY}px)`,
                  opacity: visible ? 1 : 0,
                  transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s`,
                }}
              >
                <div
                  className="aspect-square rounded-sm shadow-lg relative flex items-center justify-center p-3"
                  style={{ backgroundColor: postit.bg, color: postit.text }}
                >
                  <div
                    className="absolute top-0 right-0 w-5 h-5"
                    style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)' }}
                  />
                  <div
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm opacity-40"
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                  />
                  <p className="text-[13px] font-medium leading-snug text-center">{a.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Prompt card — overlaps post-its from below */}
      <div
        className="absolute left-0 right-0 z-20 transition-all duration-500"
        style={{
          top: showPrompt ? '45%' : '55%',
          opacity: showPrompt ? 1 : 0,
          transform: showPrompt
            ? (showMatrix ? 'translateY(-100%) scale(0.97)' : 'translateY(-100%)')
            : 'translateY(-80%)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="mx-auto max-w-[420px] rounded-xl p-4 border shadow-2xl shadow-black/30 transition-opacity duration-500"
          style={{
            backgroundColor: 'rgba(15,15,26,0.97)',
            borderColor: showMatrix ? 'rgba(255,255,255,0.06)' : 'rgba(200,149,106,0.2)',
            opacity: showMatrix ? 0.85 : 0.92,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent tracking-wide">
              PROMPT
            </span>
          </div>
          <p className="text-[13px] font-mono text-white/60 leading-relaxed">
            {showPrompt && (
              <>
                {scenario.prompt.slice(0, typedChars)}
                {typedChars < scenario.prompt.length && phase === 'typewriter' && (
                  <span className="inline-block w-[2px] h-4 bg-accent ml-0.5 animate-blink align-middle" />
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* AI Response card — overlaps prompt from below */}
      <div
        className="absolute left-0 right-0 bottom-0 z-30 transition-all duration-500"
        style={{
          opacity: showMatrix ? 1 : 0,
          transform: showMatrix ? 'translateY(0)' : 'translateY(24px)',
          pointerEvents: 'none',
        }}
      >
        <div className="mx-auto max-w-[420px] bg-navy-900/95 border border-emerald-500/15 rounded-xl p-4 shadow-2xl shadow-black/40 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 tracking-wide">
              AI RESPONSE
            </span>
          </div>
          <div className="font-mono text-[13px] leading-relaxed">
            {matrixChars.map((lineChars, li) => (
              <div key={li} className="whitespace-pre-wrap">
                {lineChars.map((char, ci) => (
                  <span
                    key={ci}
                    className={li < revealedLines ? 'text-emerald-300/80' : 'text-emerald-500/20'}
                    style={li < revealedLines ? { transition: 'color 0.3s' } : undefined}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.6s step-end infinite;
        }
      `}</style>
    </div>
  )
}

// ── Sub-components ──

function PhaseIndicator({ phase }) {
  const configs = {
    postits:    { label: 'Capturing assumptions...', dotClass: 'bg-white/20', textClass: 'text-white/30' },
    typewriter: { label: 'Generating validation prompt...', dotClass: 'bg-accent/60', textClass: 'text-accent/50' },
    matrix:     { label: 'AI validation strategy', dotClass: 'bg-emerald-400/60', textClass: 'text-emerald-400/50' },
    pause:      { label: 'AI validation strategy', dotClass: 'bg-emerald-400/60', textClass: 'text-emerald-400/50' },
  }
  const c = configs[phase]
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-1.5 h-1.5 rounded-full ${c.dotClass}`} />
      <span className={`text-[11px] uppercase tracking-wider font-medium ${c.textClass}`}>
        {c.label}
      </span>
    </div>
  )
}

// ── Helpers ──

function randomChar() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>{}[]'
  return chars[Math.floor(Math.random() * chars.length)]
}

function splitIntoLines(text, maxLen) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    if (current.length + word.length + 1 > maxLen) {
      lines.push(current)
      current = word
    } else {
      current = current ? current + ' ' + word : word
    }
  }
  if (current) lines.push(current)
  return lines
}
