/**
 * Simple deterministic hash from a string to get a stable number.
 * Used to derive per-card rotation so it doesn't shift on re-render.
 */
export function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}

/**
 * Derive a rotation in the range [-maxDeg, +maxDeg] from assumption ID.
 */
export function getRotation(id, maxDeg = 4) {
  const h = hashCode(id)
  const normalized = (h % 1000) / 1000
  return normalized * maxDeg
}
