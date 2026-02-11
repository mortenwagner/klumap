import { generatePrompt } from './promptEngine'
import { approachById } from '../data/prompts'
import guidedQuestions from '../data/guided-questions.json'

export function exportMarkdown({ assumptions, venture }) {
  const clueless = assumptions.filter(a => a.quadrant === 'clueless' && a.selectedApproach)
  if (clueless.length === 0) return ''

  const header = [
    `# Validation Brief — ${venture.name || 'My Venture'}`,
    '',
    venture.description ? `> ${venture.description} | Stage: ${venture.stage || 'early'}` : '',
    '',
    '_Generated with [KluMap.com](https://klumap.com) — O-Ring Assumption Mapping by Morten Wagner_',
    '',
    '---',
    '',
  ].join('\n')

  const sections = clueless.map((a, i) => {
    const ringData = guidedQuestions[a.ring]
    const approach = approachById[a.selectedApproach]
    const prompt = generatePrompt({
      assumption: a,
      venture,
      approachId: a.selectedApproach,
      style: a.promptStyle || 'focused',
    })

    return [
      `## ${i + 1}. ${a.text}`,
      '',
      `**Ring:** ${ringData.label} | **Approach:** ${approach?.name || 'N/A'} | **Style:** ${a.promptStyle || 'focused'}`,
      '',
      '```',
      prompt,
      '```',
      '',
      '---',
      '',
    ].join('\n')
  })

  return header + sections.join('')
}

export function downloadMarkdown({ assumptions, venture }) {
  const md = exportMarkdown({ assumptions, venture })
  if (!md) return
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `validation-brief-${(venture.name || 'venture').toLowerCase().replace(/\s+/g, '-')}.md`
  a.click()
  URL.revokeObjectURL(url)
}
