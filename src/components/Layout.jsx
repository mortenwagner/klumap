import { useAppState } from '../state/AppContext'
import ProgressBar from './ProgressBar'
import PrivacyIndicator from './PrivacyIndicator'
import HelpButton from './HelpButton'
import HelpPanel from './HelpPanel'

export default function Layout({ children }) {
  const { currentScreen } = useAppState()
  const isWelcome = currentScreen === 0

  return (
    <div className="min-h-screen flex flex-col">
      {!isWelcome && (
        <header className="border-b border-white/5">
          <div className="max-w-5xl mx-auto px-4">
            <ProgressBar />
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {!isWelcome && (
        <footer className="border-t border-white/5">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <PrivacyIndicator />
            <HelpButton />
          </div>
        </footer>
      )}

      <HelpPanel />
    </div>
  )
}
