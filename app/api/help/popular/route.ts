import { NextResponse } from "next/server"
import type { HelpContent } from "@/types/help"

// Mock database - IMPORTANT: This array must be identical to the one in app/api/help/content/route.ts
const helpContent: HelpContent[] = [
  {
    id: "dashboard-overview",
    title: "Dashboard Overview",
    description: "Understanding your main dashboard",
    content:
      "The dashboard provides a comprehensive view of your account activity, recent transactions, and key metrics. Use the navigation cards to quickly access different sections of the application.\n\nKey features:\n• Real-time metrics\n• Quick navigation\n• Recent activity feed\n• Performance indicators",
    category: "manual",
    tags: ["dashboard", "overview", "navigation"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    viewCount: 245,
  },
  {
    id: "user-settings",
    title: "User Settings",
    description: "Managing your account preferences",
    content:
      "Access your user settings to update your profile information, change password, manage notifications, and configure application preferences. Settings are automatically saved when changed.\n\nAvailable settings:\n• Profile information\n• Password management\n• Notification preferences\n• Theme selection\n• Privacy controls",
    category: "manual",
    tags: ["settings", "profile", "account"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-10T00:00:00Z",
    viewCount: 189,
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    description: "Speed up your workflow with shortcuts",
    content:
      "Master these keyboard shortcuts to improve your productivity:\n\n• Ctrl+K: Open command palette\n• Ctrl+/: Toggle help panel\n• Ctrl+B: Toggle sidebar\n• Ctrl+S: Save current work\n• Ctrl+Z: Undo last action\n• Ctrl+Y: Redo last action\n• Esc: Close modals and panels\n• Tab: Navigate between form fields",
    category: "reference",
    tags: ["shortcuts", "keyboard", "productivity"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
    viewCount: 156,
  },
  {
    id: "data-export",
    title: "Data Export",
    description: "How to export your data",
    content:
      "You can export your data in multiple formats including CSV, JSON, and PDF. Go to Settings > Data Export to access export options. Large exports may take a few minutes to process.\n\nSupported formats:\n• CSV: For spreadsheet applications\n• JSON: For developers and APIs\n• PDF: For reports and documentation\n• XML: For system integrations\n\nExport limitations:\n• Maximum 10,000 records per export\n• Files expire after 24 hours\n• Premium users get priority processing",
    category: "manual",
    tags: ["export", "data", "csv", "pdf"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-12T00:00:00Z",
    viewCount: 98,
  },
  {
    id: "performance-tips",
    title: "Performance Tips",
    description: "Optimize your experience",
    content:
      "Follow these tips to optimize your application experience:\n\n• Use filters to reduce data load and improve response times\n• Enable dark mode to reduce eye strain during long sessions\n• Bookmark frequently used pages for quick access\n• Clear browser cache if experiencing loading issues\n• Close unused tabs to free up memory\n• Use keyboard shortcuts for faster navigation\n• Enable notifications for important updates\n• Regularly update your browser for best performance",
    category: "tips",
    tags: ["performance", "optimization", "tips"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z",
    viewCount: 134,
  },
  {
    id: "api-integration",
    title: "API Integration Guide",
    description: "Connect external services to your account",
    content:
      "Learn how to integrate external APIs with your account:\n\n1. Generate API keys in Settings > API Access\n2. Use proper authentication headers\n3. Follow rate limiting guidelines\n4. Handle errors gracefully\n5. Monitor API usage in the dashboard\n\nExample request:\n```\ncurl -H 'Authorization: Bearer YOUR_API_KEY' \\\n  https://api.example.com/v1/data\n```\n\nRate limits:\n• Free tier: 100 requests/hour\n• Pro tier: 1,000 requests/hour\n• Enterprise: Custom limits",
    category: "reference",
    tags: ["api", "integration", "development"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-22T00:00:00Z",
    viewCount: 67,
  },
  // New interactive help content
  {
    id: "real-time-metrics",
    title: "Real-time Metrics",
    description: "Understanding live data updates",
    content:
      "Real-time metrics provide instant insights into your system's performance and user activity. These metrics update automatically every few seconds to give you the most current view of your data.\n\nKey real-time metrics include:\n\n• Active Users: Number of users currently online\n• Response Time: Average API response time in milliseconds\n• Error Rate: Percentage of failed requests in the last minute\n• Throughput: Requests processed per second\n• Memory Usage: Current system memory consumption\n\nHow real-time updates work:\n• Data is pushed via WebSocket connections\n• Updates occur every 5-10 seconds\n• Historical data is maintained for trend analysis\n• Alerts trigger when thresholds are exceeded\n\nTroubleshooting:\n• If metrics stop updating, check your internet connection\n• Refresh the page if data appears stale\n• Contact support if metrics show inconsistent values",
    category: "reference",
    tags: ["metrics", "real-time", "monitoring", "performance"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-25T00:00:00Z",
    viewCount: 89,
  },
  {
    id: "conversion-rate",
    title: "Conversion Rate Optimization",
    description: "Improving your conversion metrics",
    content:
      "Conversion rate measures the percentage of visitors who complete a desired action on your platform. Understanding and optimizing this metric is crucial for business success.\n\nWhat affects conversion rate:\n\n• Page load speed (every second counts)\n• User experience and interface design\n• Clear call-to-action buttons\n• Trust signals and social proof\n• Mobile responsiveness\n• Checkout process simplicity\n\nOptimization strategies:\n\n1. A/B test different page layouts\n2. Optimize form fields (reduce friction)\n3. Add customer testimonials\n4. Improve page loading times\n5. Simplify navigation\n6. Use compelling headlines\n7. Add urgency or scarcity elements\n\nMeasuring success:\n• Track conversion rate over time\n• Segment by traffic source\n• Monitor micro-conversions\n• Set up goal funnels\n• Use heat mapping tools\n\nBenchmarks:\n• E-commerce: 2-3% average\n• SaaS: 3-5% for free trials\n• Lead generation: 2-5%",
    category: "tips",
    tags: ["conversion", "optimization", "analytics", "business"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-26T00:00:00Z",
    viewCount: 156,
  },
  {
    id: "api-rate-limits",
    title: "API Rate Limits",
    description: "Understanding and managing API usage limits",
    content:
      "API rate limits prevent abuse and ensure fair usage across all users. Understanding these limits helps you build more efficient applications.\n\nRate limit types:\n\n• Requests per minute (RPM)\n• Requests per hour (RPH)\n• Requests per day (RPD)\n• Concurrent connections\n• Data transfer limits\n\nCurrent limits by plan:\n\nFree Tier:\n• 100 requests/hour\n• 1,000 requests/day\n• 2 concurrent connections\n• 10MB data transfer/day\n\nPro Tier:\n• 1,000 requests/hour\n• 10,000 requests/day\n• 10 concurrent connections\n• 100MB data transfer/day\n\nEnterprise:\n• Custom limits based on needs\n• Dedicated infrastructure\n• Priority support\n• SLA guarantees\n\nBest practices:\n• Implement exponential backoff\n• Cache responses when possible\n• Use webhooks instead of polling\n• Monitor your usage regularly\n• Upgrade plan before hitting limits\n\nHandling rate limit errors:\n• Check the 'Retry-After' header\n• Implement proper error handling\n• Queue requests during high traffic\n• Use multiple API keys if allowed",
    category: "reference",
    tags: ["api", "rate-limits", "development", "best-practices"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-27T00:00:00Z",
    viewCount: 234,
  },
  {
    id: "data-retention",
    title: "Data Retention Policies",
    description: "How long we keep your data",
    content:
      "Our data retention policies ensure compliance with privacy regulations while maintaining the data you need for your business operations.\n\nRetention periods by data type:\n\nUser Data:\n• Profile information: Retained while account is active\n• Login logs: 90 days\n• Activity logs: 1 year\n• Deleted accounts: 30 days (then permanently deleted)\n\nApplication Data:\n• Metrics and analytics: 2 years\n• API logs: 6 months\n• Error logs: 1 year\n• Backup data: 90 days\n\nBilling Data:\n• Invoices: 7 years (legal requirement)\n• Payment methods: Until removed by user\n• Transaction history: 7 years\n\nCompliance:\n• GDPR: Right to be forgotten\n• CCPA: Data deletion requests\n• SOX: Financial record retention\n• HIPAA: Healthcare data protection\n\nData export options:\n• Download your data anytime\n• Automated backups available\n• API access to historical data\n• Bulk export tools\n\nDeletion process:\n• Soft delete: Data marked for deletion\n• Hard delete: Permanent removal after retention period\n• Secure deletion: DoD 5220.22-M standard\n• Verification: Deletion certificates available",
    category: "manual",
    tags: ["data", "retention", "privacy", "compliance"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-28T00:00:00Z",
    viewCount: 78,
  },
]

export async function GET() {
  // Return top 5 most viewed topics
  const popularTopics = helpContent.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)

  return NextResponse.json(popularTopics)
}
