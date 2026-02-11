import { jsPDF } from 'jspdf'
import { generatePrompt } from './promptEngine'
import { approachById } from '../data/prompts'
import guidedQuestions from '../data/guided-questions.json'

export function exportPDF({ assumptions, venture }) {
  const clueless = assumptions.filter(a => a.quadrant === 'clueless' && a.selectedApproach)
  if (clueless.length === 0) return

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - margin * 2
  let y = margin

  function addFooter() {
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text('Generated with KluMap.com — O-Ring Assumption Mapping by Morten Wagner', pageWidth / 2, pageHeight - 10, { align: 'center' })
  }

  function checkPage(needed) {
    if (y + needed > pageHeight - 20) {
      addFooter()
      doc.addPage()
      y = margin
    }
  }

  // Title page
  doc.setFontSize(28)
  doc.setTextColor(40)
  doc.text('Validation Brief', margin, y + 20)
  y += 35

  doc.setFontSize(16)
  doc.setTextColor(80)
  doc.text(venture.name || 'My Venture', margin, y)
  y += 10

  if (venture.description) {
    doc.setFontSize(11)
    doc.setTextColor(120)
    const descLines = doc.splitTextToSize(venture.description, maxWidth)
    doc.text(descLines, margin, y)
    y += descLines.length * 5 + 5
  }

  doc.setFontSize(10)
  doc.setTextColor(140)
  doc.text(`Stage: ${venture.stage || 'early'} | Date: ${new Date().toLocaleDateString()}`, margin, y)
  y += 15

  doc.setDrawColor(200)
  doc.line(margin, y, pageWidth - margin, y)
  y += 15

  // Assumptions
  clueless.forEach((a, i) => {
    checkPage(60)

    const ringData = guidedQuestions[a.ring]
    const approach = approachById[a.selectedApproach]

    // Assumption header
    doc.setFontSize(13)
    doc.setTextColor(40)
    const headerLines = doc.splitTextToSize(`${i + 1}. ${a.text}`, maxWidth)
    doc.text(headerLines, margin, y)
    y += headerLines.length * 6 + 3

    // Meta
    doc.setFontSize(9)
    doc.setTextColor(120)
    doc.text(`${ringData.label} · ${approach?.name || 'N/A'} · ${a.promptStyle || 'focused'}`, margin, y)
    y += 8

    // Prompt
    const prompt = generatePrompt({
      assumption: a,
      venture,
      approachId: a.selectedApproach,
      style: a.promptStyle || 'focused',
    })

    doc.setFontSize(9)
    doc.setTextColor(60)
    const promptLines = doc.splitTextToSize(prompt, maxWidth)

    promptLines.forEach(line => {
      checkPage(5)
      doc.text(line, margin, y)
      y += 4.5
    })

    y += 10

    // Separator
    if (i < clueless.length - 1) {
      checkPage(5)
      doc.setDrawColor(220)
      doc.line(margin, y, pageWidth - margin, y)
      y += 10
    }
  })

  addFooter()

  const filename = `validation-brief-${(venture.name || 'venture').toLowerCase().replace(/\s+/g, '-')}.pdf`
  doc.save(filename)
}
