import { useDispatch } from '../state/AppContext'

export default function AssumptionExtraction() {
  const dispatch = useDispatch()

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-bold">Assumption Extraction</h2>
        <p className="text-white/40">Coming in Session 2</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => dispatch({ type: 'PREV_SCREEN' })} className="btn-secondary">
            ← Back
          </button>
          <button onClick={() => dispatch({ type: 'NEXT_SCREEN' })} className="btn-primary">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
