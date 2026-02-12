import { useState } from 'react'
import ORingMotif from './ORingMotif'

const STEPS = [
  {
    title: 'What is KluMap?',
    content: 'value-prop',
  },
  {
    title: 'How it works',
    content: 'how-it-works',
  },
  {
    title: 'Ready to start',
    content: 'ready',
  },
]

const HOW_IT_WORKS_CARDS = [
  { number: 1, text: 'Frame your venture — name + one-liner' },
  { number: 2, text: 'List your assumptions — what you believe but haven\'t proven' },
  { number: 3, text: 'Map your blind spots — importance vs evidence' },
  { number: 4, text: 'Get AI prompts — validation strategies ready to paste' },
]

export default function OnboardingStepper({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState('forward')

  function goNext() {
    if (currentStep < STEPS.length - 1) {
      setDirection('forward')
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setDirection('backward')
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-8">
      {/* Step content */}
      <div
        key={currentStep}
        className={`stepper-step-${direction}`}
      >
        {currentStep === 0 && (
          <div className="space-y-6">
            <ORingMotif size={100} />
            <h2 className="text-2xl sm:text-3xl font-bold">What is KluMap?</h2>
            <p className="text-white/50 text-base leading-relaxed">
              KluMap helps founders identify their riskiest business assumptions
              and generate AI prompts to validate them.
            </p>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {HOW_IT_WORKS_CARDS.map((card) => (
                <div
                  key={card.number}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <span className="shrink-0 w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center">
                    {card.number}
                  </span>
                  <p className="text-white/60 text-sm leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to start</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your data stays in your browser — nothing is sent anywhere</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Open source — verify it yourself</span>
              </div>
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tap <strong className="text-white/70">?</strong> anytime for help</span>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="btn-primary text-lg px-10 py-4"
            >
              Let's go
              <span className="ml-1">&rarr;</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentStep > 0 ? (
            <button
              onClick={goBack}
              className="btn-secondary text-sm"
            >
              &larr; Back
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentStep ? 'forward' : 'backward')
                setCurrentStep(i)
              }}
              className={`stepper-dot ${i === currentStep ? 'stepper-dot-active' : ''}`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <div>
          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              className="btn-primary text-sm px-5 py-2.5"
            >
              Next &rarr;
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Skip link */}
      <div className="text-center">
        <button
          onClick={onSkip}
          className="text-white/30 text-sm hover:text-white/50 transition-colors underline underline-offset-2"
        >
          Skip intro
        </button>
      </div>
    </div>
  )
}
