import { useAppState, useDispatch } from '../state/AppContext'

const helpContent = {
  0: {
    title: 'Welcome to KluMap',
    description: 'KluMap helps you identify the riskiest assumptions in your venture and generate AI prompts to test them.',
    tips: [
      'Works entirely in your browser — nothing is stored or sent anywhere.',
      'You\'ll move through 4 steps: Frame, Extract, Map, and Test.',
    ],
  },
  1: {
    title: 'Venture Framing',
    description: 'Give your venture a name and a short description. This context will be woven into your validation prompts later.',
    tips: [
      'Keep the description to one sentence — what does your venture do and for whom?',
      'The stage you pick helps tailor prompts to your current reality.',
    ],
  },
  2: {
    title: 'The O-Rings of Innovation',
    description: 'Every venture rests on three layers of assumptions: Opportunity (is there a real need?), Offering (does our solution work?), and Operation (can we deliver it?).',
    tips: [
      'Don\'t overthink it. Capture what you believe to be true but haven\'t proven.',
      'Use the question chips for inspiration — they\'re common assumptions founders hold.',
      'You can always come back and add more.',
    ],
  },
  3: {
    title: 'The Clueless Corner',
    description: 'Plot each assumption by how important it is to your venture\'s success and how much evidence you have for it. The top-left quadrant — high importance, low evidence — is your Clueless Corner.',
    tips: [
      'The Clueless Corner is where ventures go to die: critical assumptions with no evidence.',
      'Be honest about your evidence. "I just know" isn\'t evidence.',
      'You need at least one assumption in the Clueless Corner to generate prompts.',
    ],
  },
  4: {
    title: 'Prompt Workshop',
    description: 'For each Clueless Corner assumption, pick a validation approach and get a ready-to-use AI prompt. Copy it into Claude, ChatGPT, or any AI assistant.',
    tips: [
      'Try different prompt styles — Devil\'s Advocate can surface blind spots.',
      'The prompts are starting points. Edit them to match your specific context.',
      'Export everything as a Validation Brief when you\'re done.',
    ],
  },
}

export default function HelpPanel() {
  const { helpPanelOpen, currentScreen } = useAppState()
  const dispatch = useDispatch()

  const content = helpContent[currentScreen] || helpContent[0]

  return (
    <>
      {helpPanelOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => dispatch({ type: 'CLOSE_HELP_PANEL' })}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-navy-800 border-l border-white/10
                     z-50 transform transition-transform duration-300 ease-out
                     ${helpPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{content.title}</h2>
            <button
              onClick={() => dispatch({ type: 'CLOSE_HELP_PANEL' })}
              className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
              aria-label="Close help panel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-white/60 text-sm leading-relaxed mb-6">
            {content.description}
          </p>

          {content.tips && (
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Tips</h3>
              <ul className="space-y-3">
                {content.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-white/50 leading-relaxed">
                    <span className="text-accent mt-0.5 shrink-0">&#8250;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
