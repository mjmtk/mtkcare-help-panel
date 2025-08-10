import type { HelpContent, HelpSearchParams, HelpAnalytics } from "@/types/help"

const API_BASE = "/api/help"

export class HelpAPI {
  static async getHelpContent(params?: HelpSearchParams): Promise<HelpContent[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params?.query) searchParams.set("query", params.query)
      if (params?.category) searchParams.set("category", params.category)
      if (params?.tags) searchParams.set("tags", params.tags.join(","))

      const url = `${API_BASE}/content?${searchParams}`
      console.log("Fetching help content from:", url)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received help content:", data)
      return data
    } catch (error) {
      console.error("Error in getHelpContent:", error)
      throw error
    }
  }

  static async getHelpTopic(id: string): Promise<HelpContent> {
    try {
      const url = `${API_BASE}/content/${id}`
      console.log("Fetching help topic from:", url)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received help topic:", data)
      return data
    } catch (error) {
      console.error("Error in getHelpTopic:", error)
      throw error
    }
  }

  static async trackAnalytics(data: HelpAnalytics): Promise<void> {
    try {
      await fetch(`${API_BASE}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error("Error tracking analytics:", error)
      // Don't throw here as analytics failures shouldn't break the app
    }
  }

  static async getPopularTopics(): Promise<HelpContent[]> {
    try {
      const response = await fetch(`${API_BASE}/popular`)
      if (!response.ok) throw new Error("Failed to fetch popular topics")
      return response.json()
    } catch (error) {
      console.error("Error in getPopularTopics:", error)
      throw error
    }
  }
}
