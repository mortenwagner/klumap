import { useAppState } from './state/AppContext'
import Layout from './components/Layout'
import Welcome from './screens/Welcome'
import VentureFraming from './screens/VentureFraming'
import AssumptionExtraction from './screens/AssumptionExtraction'
import CluelessCorner from './screens/CluelessCorner'
import PromptWorkshop from './screens/PromptWorkshop'

const screens = {
  0: Welcome,
  1: VentureFraming,
  2: AssumptionExtraction,
  3: CluelessCorner,
  4: PromptWorkshop,
}

export default function App() {
  const { currentScreen } = useAppState()
  const Screen = screens[currentScreen]

  return (
    <Layout>
      <Screen />
    </Layout>
  )
}
