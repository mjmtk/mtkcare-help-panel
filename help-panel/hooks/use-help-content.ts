"use client"

import { useState, useEffect } from "react"
import type { HelpContent, HelpSearchParams } from "@/types/help"
import { HelpAPI } from "@/lib/help/help-api"

export function useHelpContent(params?: HelpSearchParams) {
  const [content, setContent] = useState<HelpContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await HelpAPI.getHelpContent(params)
      setContent(data)
    } catch (err) {
      console.error("Error fetching help content:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch content")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [params?.query, params?.category, params?.tags?.join(",")])

  return { content, loading, error, refetch: fetchContent }
}

export function useHelpTopic(id: string | null) {
  const [topic, setTopic] = useState<HelpContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setTopic(null)
      return
    }

    const fetchTopic = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await HelpAPI.getHelpTopic(id)
        setTopic(data)

        // Track view analytics
        await HelpAPI.trackAnalytics({
          topicId: id,
          action: "view",
          timestamp: new Date().toISOString(),
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch topic")
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [id])

  return { topic, loading, error }
}
