import { approachById } from '../data/prompts'
import guidedQuestions from '../data/guided-questions.json'

const RING_CONTEXT = {
  opportunity: 'whether a real market opportunity exists',
  offering: 'whether our solution effectively addresses the need',
  operation: 'whether we can feasibly build and deliver this',
}

/**
 * Generate a complete, copy-paste-ready AI prompt for a given assumption,
 * venture context, validation approach, and prompt style.
 */
export function generatePrompt({ assumption, venture, approachId, style }) {
  const approach = approachById[approachId]
  if (!approach) return ''

  const variant = approach.promptVariants[style]
  if (!variant) return ''

  const ringData = guidedQuestions[assumption.ring]

  const context = [
    `Context: I'm working on ${venture.name || 'my venture'}${venture.description ? ' — ' + venture.description : ''}. We're at the ${venture.stage || 'early'} stage.`,
    '',
    `Assumption: I believe that ${assumption.text}. This is an ${ringData.label} assumption — it relates to ${RING_CONTEXT[assumption.ring]}.`,
    '',
    'Evidence status: This assumption is in my "Clueless Corner" — I consider it highly important to our success, but I have little to no evidence for it.',
    '',
    variant.template.replace(/\{\{assumption\}\}/g, assumption.text),
    '',
    'Constraints: I want to test this quickly and with minimal budget.',
    '',
    'What would a "kill signal" look like — what evidence would tell me this assumption is wrong and I should pivot?',
  ].join('\n')

  return context
}
