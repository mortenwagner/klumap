import { useState, useEffect } from 'react'

const examples = [
  {
    ring: 'opportunity',
    ringLabel: 'Opportunity',
    ringColor: '#4ECDC4',
    assumption: 'We assume busy parents will pay a premium for healthy meal kits delivered weekly',
    approach: '🚪 Smoke Test',
    promptSnippet: 'Help me design a smoke test landing page to validate whether busy parents would pay €12/meal for a weekly healthy meal kit. What conversion rate from the "Pre-order" button would signal real demand vs. casual interest? What\'s the minimum traffic I need for a meaningful signal?',
    style: 'Focused',
  },
  {
    ring: 'offering',
    ringLabel: 'Offering',
    ringColor: '#FFB347',
    assumption: 'We assume freelancers will prefer our AI invoicing tool over spreadsheets',
    approach: '🎤 Customer Conversations',
    promptSnippet: 'I want to deeply explore whether freelancers would actually switch from spreadsheets to an AI invoicing tool. Who are the different freelancer segments I should talk to? What adjacent pain points around invoicing should I probe that might reveal unspoken needs?',
    style: 'Exploratory',
  },
  {
    ring: 'operation',
    ringLabel: 'Operation',
    ringColor: '#FF6B6B',
    assumption: 'We assume we can keep customer acquisition cost under €30 per user',
    approach: '📊 Data Mining',
    promptSnippet: 'Play devil\'s advocate on my assumption that we can acquire customers for under €30. What are the 3 strongest reasons this is probably wrong? What cognitive biases might be making me underestimate CAC? Where would I find evidence to bet against this?',
    style: 'Devil\'s Advocate',
  },
]

export default function PromptShowcase() {
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setActive((prev) => (prev + 1) % examples.length)
        setFading(false)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const ex = examples[active]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider text-center mb-4">
        What you'll get
      </p>

      <div
        className={`transition-opacity duration-400 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Assumption card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
          {/* The assumption */}
          <div className="flex items-start gap-3">
            <div
              className="w-2 h-2 rounded-full mt-2 shrink-0"
              style={{ backgroundColor: ex.ringColor }}
            />
            <div className="space-y-1 min-w-0">
              <p className="text-xs text-white/30 uppercase tracking-wider">{ex.ringLabel} assumption</p>
              <p className="text-white/70 text-sm leading-relaxed italic">"{ex.assumption}"</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center gap-2 px-5">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-white/20 text-xs">↓ generates</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* The prompt output */}
          <div className="bg-navy-900/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">{ex.approach}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30">{ex.style}</span>
              </div>
              <span className="text-[10px] text-white/20 font-mono">Ready to paste</span>
            </div>
            <p className="text-white/50 text-sm font-mono leading-relaxed">
              {ex.promptSnippet}
            </p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {examples.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setActive(i); setFading(false) }, 300) }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === active ? 'bg-white/40 w-4' : 'bg-white/15 hover:bg-white/25'
            }`}
            aria-label={`Example ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
