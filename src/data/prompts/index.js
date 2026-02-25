// Auto-discover all prompt JSON files in this directory.
// To add a new approach: just drop a .json file here. No other changes needed.
const modules = import.meta.glob('./*.json', { eager: true })

const approaches = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name))

export default approaches

export const approachById = Object.fromEntries(
  approaches.map((a) => [a.id, a])
)
