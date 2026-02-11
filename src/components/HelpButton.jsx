import { useDispatch } from '../state/AppContext'

export default function HelpButton() {
  const dispatch = useDispatch()

  return (
    <button
      onClick={() => dispatch({ type: 'TOGGLE_HELP_PANEL' })}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10
                 flex items-center justify-center text-white/50
                 hover:bg-white/10 hover:text-white/80 hover:border-white/20
                 transition-all duration-200"
      aria-label="Help"
    >
      <span className="text-lg font-medium">?</span>
    </button>
  )
}
