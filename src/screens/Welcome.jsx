import { useDispatch } from '../state/AppContext'
import ORingMotif from '../components/ORingMotif'
import JourneyAnimation from '../components/JourneyAnimation'

export default function Welcome() {
  const dispatch = useDispatch()

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
      {/* Left: copy + CTA */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 lg:py-0">
        <div className="max-w-md w-full space-y-8">
          {/* O-Ring motif */}
          <ORingMotif size={80} />

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              KluMap
            </h1>
            <p className="text-white/40 text-lg italic">
              Map your assumptions. Challenge your convictions.
            </p>
          </div>

          {/* Description */}
          <p className="text-white/50 text-base leading-relaxed">
            Identify the riskiest assumptions in your venture
            and generate AI prompts to test them.
          </p>

          {/* CTA */}
          <button
            onClick={() => dispatch({ type: 'NEXT_SCREEN' })}
            className="btn-primary text-lg px-10 py-4"
          >
            Start Mapping
            <span className="ml-1">→</span>
          </button>

          {/* Trust signals */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-5 text-sm text-white/35">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Data never leaves your browser</span>
              </div>
              <a
                href="https://github.com/mortenwagner/klumap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Open source</span>
              </a>
            </div>
            <p className="text-xs text-white/20">
              No accounts. No tracking. Nothing stored.
            </p>
          </div>

          {/* Attribution */}
          <p className="text-xs text-white/20 pt-1">
            Built by{' '}
            <a
              href="https://mortenwagner.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors underline underline-offset-2"
            >
              Morten Wagner
            </a>
          </p>
        </div>
      </div>

      {/* Right: animated journey */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 lg:py-0 lg:border-l border-white/[0.04]">
        <div className="w-full max-w-md h-[480px] lg:h-[520px]">
          <JourneyAnimation />
        </div>
      </div>
    </div>
  )
}
