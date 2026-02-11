export const initialState = {
  currentScreen: 0,
  venture: {
    name: '',
    description: '',
    stage: null,
  },
  assumptions: [],
  activeRing: 'opportunity',
  helpPanelOpen: false,
}

let nextId = 1

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen }

    case 'NEXT_SCREEN':
      return { ...state, currentScreen: Math.min(state.currentScreen + 1, 4) }

    case 'PREV_SCREEN':
      return { ...state, currentScreen: Math.max(state.currentScreen - 1, 0) }

    case 'SET_VENTURE_FIELD':
      return {
        ...state,
        venture: { ...state.venture, [action.field]: action.value },
      }

    case 'SET_ACTIVE_RING':
      return { ...state, activeRing: action.ring }

    case 'ADD_ASSUMPTION':
      return {
        ...state,
        assumptions: [
          ...state.assumptions,
          {
            id: String(nextId++),
            text: action.text,
            ring: action.ring,
            quadrant: null,
            position: null,
            selectedApproach: null,
            promptStyle: 'focused',
            createdAt: Date.now(),
          },
        ],
      }

    case 'UPDATE_ASSUMPTION':
      return {
        ...state,
        assumptions: state.assumptions.map((a) =>
          a.id === action.id ? { ...a, ...action.updates } : a
        ),
      }

    case 'DELETE_ASSUMPTION':
      return {
        ...state,
        assumptions: state.assumptions.filter((a) => a.id !== action.id),
      }

    case 'TOGGLE_HELP_PANEL':
      return { ...state, helpPanelOpen: !state.helpPanelOpen }

    case 'CLOSE_HELP_PANEL':
      return { ...state, helpPanelOpen: false }

    default:
      return state
  }
}
