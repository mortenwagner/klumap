import { useDispatch } from '../state/AppContext'

export default function PromptWorkshop() {
  const dispatch = useDispatch()

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Prompt Workshop</h2>
        <p className="text-white/40">Coming in Session 4</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => dispatch({ type: 'PREV_SCREEN' })} className="btn-secondary">
            ← Back
          </button>
        </div>
      </div>
    </div>
  )
}
