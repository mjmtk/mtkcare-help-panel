export interface HelpContent {
  id: string
  title: string
  description: string
  content: string
  category: "manual" | "reference" | "tips"
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
  action: "view" | "search" | "share"
  timestamp: string
  context?: string
}
