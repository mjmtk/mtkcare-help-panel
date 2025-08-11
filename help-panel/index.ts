/**
 * MTK Care Help Panel
 * Standalone help panel component for integration with Django apps
 */

// Main components
export { HelpProvider, useHelp } from './components/help-provider'
export { HelpTrigger } from './components/help-trigger'
export { IntegratedHelpPanel } from './components/integrated-help-panel'

// Help panel components
export { HelpPanelContent } from './components/help-panel-content'
export { HelpSearch } from './components/help-search'
export { HelpTopicCard } from './components/help-topic-card'
export { HelpTopicDetails } from './components/help-topic-details'

// Hooks
export { useHelpContent, useHelpTopic } from './hooks/use-help-content'

// Types
export type { 
  HelpContent, 
  HelpSearchParams, 
  HelpAnalytics,
  HelpPanelConfig 
} from './types/help'

// API client
export { HelpAPI } from './lib/help-api'

// Version
export const version = '1.0.0'