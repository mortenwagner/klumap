import customerConversations from './customer-conversations.json'
import smokeTest from './smoke-test.json'
import wizardOfOz from './wizard-of-oz.json'
import conciergeMvp from './concierge-mvp.json'
import dataMining from './data-mining.json'
import expertReview from './expert-review.json'
import analogousScanning from './analogous-scanning.json'
import prototypeStoryboard from './prototype-storyboard.json'
import presaleLoi from './presale-loi.json'
import technicalSpike from './technical-spike.json'

const approaches = [
  customerConversations,
  smokeTest,
  wizardOfOz,
  conciergeMvp,
  dataMining,
  expertReview,
  analogousScanning,
  prototypeStoryboard,
  presaleLoi,
  technicalSpike,
]

export default approaches

export const approachById = Object.fromEntries(
  approaches.map((a) => [a.id, a])
)
