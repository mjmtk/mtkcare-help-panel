// Copy from main types with additions for configuration
export interface HelpContent {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  viewCount: number
}

export interface HelpSearchParams {
  query?: string
  category?: string
  tags?: string[]
}

export interface HelpAnalytics {
  topicId: string
  action: 'view' | 'search' | 'feedback'
  timestamp: string
  context?: string
  sessionHash?: string
}

// New configuration interface for help panel
export interface HelpPanelConfig {
  apiBaseUrl: string
  theme?: 'light' | 'dark' | 'auto'
  position?: 'right' | 'left'
  defaultMode?: 'sheet' | 'pinned'
  analytics?: boolean
  customStyles?: string
  allowedOrigins?: string[]
}

// Context type for help provider
export interface HelpContextType {
  isOpen: boolean
  mode: 'sheet' | 'pinned'
  toggleHelp: () => void
  openHelp: () => void
  closeHelp: () => void
  setMode: (mode: 'sheet' | 'pinned') => void
  currentSection?: string
  setCurrentSection: (section: string) => void
  config: HelpPanelConfig
}