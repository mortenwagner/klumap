export default function ScreenIntroCard({ title, description, visual, onDismiss }) {
  return (
    <div className="intro-card-enter fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-md w-[calc(100%-2rem)]">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {visual && (
            <div className="shrink-0 hidden sm:block">{visual}</div>
          )}
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold text-white/90">{title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm font-medium text-accent bg-accent/10 rounded-lg
                       hover:bg-accent/20 transition-colors min-h-[36px]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
