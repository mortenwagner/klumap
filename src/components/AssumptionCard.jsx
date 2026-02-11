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
function getRotation(id, maxDeg = 4) {
  const h = hashCode(id)
  // Map hash to [-1, 1] then scale
  const normalized = (h % 1000) / 1000
  return normalized * maxDeg
}

export default function AssumptionCard({ assumption }) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(assumption.text)
  const inputRef = useRef(null)
  const cancellingRef = useRef(false)
  const ringData = guidedQuestions[assumption.ring]
  const color = ringData.color
  const label = ringData.label
  const postitBg = ringData.postitBg
  const postitText = ringData.postitText
  const rotation = getRotation(assumption.id)

  // Extra rotation for entry animation (larger swing)
  const enterRotation = rotation + (hashCode(assumption.id) % 2 === 0 ? 12 : -12)

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

  return (
    <div
      className="group relative rounded-sm p-4 aspect-square flex flex-col postit-card"
      style={{
        backgroundColor: postitBg,
        '--postit-rotation': `${rotation}deg`,
        '--postit-enter-rotation': `${enterRotation}deg`,
      }}
    >
      {/* Paper fold corner */}
      <div
        className="absolute top-0 right-0 w-5 h-5"
        style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.08) 50%)' }}
      />

      {/* Tape strip at top center */}
      {!isEditing && (
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm"
          style={{
            background: 'rgba(255,255,255,0.5)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        />
      )}

      {isEditing ? (
        /* Edit mode — flattened, no rotation, subtle glow */
        <div className="flex-1 flex items-center">
          <textarea
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-[13px] leading-snug resize-none
                       focus:outline-none focus:ring-1
                       transition-colors"
            style={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(0,0,0,0.1)',
              color: postitText,
            }}
          />
        </div>
      ) : (
        <>
          {/* Assumption text — centered in card */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[13px] leading-snug font-medium text-center" style={{ color: postitText }}>
              {assumption.text}
            </p>
          </div>

          {/* Bottom bar: ring tag + action buttons */}
          <div className="flex items-center justify-between mt-auto pt-1">
            {/* Ring tag */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px]" style={{ color: postitText, opacity: 0.4 }}>{label}</span>
            </div>

            {/* Action buttons — visible on hover (desktop) or always (mobile) */}
            <div className="flex items-center gap-0.5 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => {
                  setEditText(assumption.text)
                  setIsEditing(true)
                }}
                className="p-1.5 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                style={{ color: `${postitText}55` }}
                onMouseEnter={(e) => { e.currentTarget.style.color = postitText; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = `${postitText}55`; e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="Edit assumption"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 1.5L12.5 4 4.5 12H2V9.5L10 1.5Z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
                style={{ color: `${postitText}55` }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.06)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = `${postitText}55`; e.currentTarget.style.backgroundColor = 'transparent' }}
                aria-label="Delete assumption"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="2" y1="2" x2="12" y2="12" />
                  <line x1="12" y1="2" x2="2" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
