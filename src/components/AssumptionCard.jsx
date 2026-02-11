import { useState, useRef, useEffect } from 'react'
import { useDispatch } from '../state/AppContext'
import guidedQuestions from '../data/guided-questions.json'

export default function AssumptionCard({ assumption }) {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(assumption.text)
  const inputRef = useRef(null)

  const color = guidedQuestions[assumption.ring].color
  const label = guidedQuestions[assumption.ring].label

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

  function handleCancel() {
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
      className="group bg-white/5 border border-white/10 rounded-xl p-4 border-l-4 transition-colors duration-200 hover:bg-white/[0.07]"
      style={{ borderLeftColor: color }}
    >
      {isEditing ? (
        /* Edit mode */
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2
                     text-white text-sm
                     focus:outline-none focus:border-oring-opportunity/50 focus:ring-1 focus:ring-oring-opportunity/25
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
