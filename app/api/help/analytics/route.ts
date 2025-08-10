import { type NextRequest, NextResponse } from "next/server"
import type { HelpAnalytics } from "@/types/help"

// Mock analytics storage - in a real app, this would be a proper database
const analytics: HelpAnalytics[] = []

export async function POST(request: NextRequest) {
  try {
    const data: HelpAnalytics = await request.json()

    // Validate the data
    if (!data.topicId || !data.action || !data.timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store analytics data
    analytics.push(data)

    // In a real app, you might also:
    // - Send to analytics service (Google Analytics, Mixpanel, etc.)
    // - Store in database
    // - Trigger webhooks

    console.log("Help analytics tracked:", data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics:", error)
    return NextResponse.json({ error: "Failed to track analytics" }, { status: 500 })
  }
}

export async function GET() {
  // Return analytics summary (for admin dashboard)
  const summary = {
    totalEvents: analytics.length,
    topTopics: analytics
      .filter((a) => a.action === "view")
      .reduce(
        (acc, curr) => {
          acc[curr.topicId] = (acc[curr.topicId] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    searchQueries: analytics
      .filter((a) => a.action === "search")
      .map((a) => a.context)
      .filter(Boolean),
  }

  return NextResponse.json(summary)
}
