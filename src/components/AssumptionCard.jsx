import { useState, useRef, useEffect } from 'react'
import { useDispatch } from '../state/AppContext'
import guidedQuestions from '../data/guided-questions.json'

/**
 * Simple deterministic hash from a string to get a stable number.
 * Used to derive per-card rotation so it doesn't shift on re-render.
 */
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}

/**
 * Derive a rotation in the range [-maxDeg, +maxDeg] from assumption ID.
 */
function getRotation(id, maxDeg = 2.5) {
  const h = hashCode(id)
  // Map hash to [-1, 1] then scale
  const normalized = (h % 1000) / 1000
  return normalized * maxDeg
}

export default function AssumptionCard({ assumption, isNew = false }) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(assumption.text)
  const inputRef = useRef(null)
  const cancellingRef = useRef(false)
  const [entering, setEntering] = useState(isNew)

  const color = guidedQuestions[assumption.ring].color
  const label = guidedQuestions[assumption.ring].label
  const rotation = getRotation(assumption.id)

  // Extra rotation for entry animation (larger swing)
  const enterRotation = rotation + (hashCode(assumption.id) % 2 === 0 ? 8 : -8)

  useEffect(() => {
    if (entering) {
      const timer = setTimeout(() => setEntering(false), 500)
      return () => clearTimeout(timer)
    }
  }, [entering])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  function handleSave() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== assumption.text) {
      dispatch({ type: 'UPDATE_ASSUMPTION', id: assumption.id, updates: { text: trimmed } })
    }
    setIsEditing(false)
  }

  function handleBlur() {
    if (cancellingRef.current) {
      cancellingRef.current = false
      return
    }
    handleSave()
  }

  function handleCancel() {
    cancellingRef.current = true
    setEditText(assumption.text)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_ASSUMPTION', id: assumption.id })
  }

  // Post-it background: muted/pastel tint of ring color on dark bg
  const postitBg = `${color}15`

  return (
    <div
      className={`
        group relative border-l-4 rounded-lg p-4
        transition-all duration-300
        ${isEditing
          ? 'bg-white/[0.08] shadow-lg shadow-white/5'
          : 'hover:bg-white/[0.07]'
        }
        ${entering ? 'postit-entering' : ''}
      `}
      style={{
        borderLeftColor: color,
        backgroundColor: isEditing ? undefined : postitBg,
        transform: isEditing ? 'rotate(0deg)' : `rotate(${rotation}deg)`,
        boxShadow: isEditing
          ? `0 0 20px ${color}20, 0 4px 12px rgba(0,0,0,0.3)`
          : '0 2px 8px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.15)',
        '--postit-rotation': `${rotation}deg`,
        '--postit-enter-rotation': `${enterRotation}deg`,
      }}
    >
      {/* Tape strip at top center */}
      {!isEditing && (
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm"
          style={{
            background: 'rgba(255,255,255,0.12)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        />
      )}

      {isEditing ? (
        /* Edit mode — flattened, no rotation, subtle glow */
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2
                     text-white text-sm
                     focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10
                     transition-colors"
        />
      ) : (
        /* Display mode */
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Assumption text */}
            <p className="text-white text-sm leading-relaxed">{assumption.text}</p>
            {/* Ring tag */}
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-white/30">{label}</span>
            </div>
          </div>

          {/* Action buttons — visible on hover (desktop) or always (mobile) */}
          <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
            {/* Edit button */}
            <button
              onClick={() => {
                setEditText(assumption.text)
                setIsEditing(true)
              }}
              className="p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Edit assumption"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 1.5L12.5 4 4.5 12H2V9.5L10 1.5Z" />
              </svg>
            </button>
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Delete assumption"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
