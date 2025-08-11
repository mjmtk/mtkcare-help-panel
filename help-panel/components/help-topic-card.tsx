"use client"

import { ChevronRight, Book, FileText, Lightbulb, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HelpContent } from "@/types/help"

interface HelpTopicCardProps {
  topic: HelpContent
  isSelected?: boolean
  onClick: (topic: HelpContent) => void
}

export function HelpTopicCard({ topic, isSelected, onClick }: HelpTopicCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "manual":
        return <Book className="h-4 w-4" />
      case "reference":
        return <FileText className="h-4 w-4" />
      case "tips":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "manual":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "reference":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "tips":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "ring-2 ring-primary" : ""}`}
      onClick={() => onClick(topic)}
      data-topic-id={topic.id}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {getCategoryIcon(topic.category)}
            {topic.title}
          </CardTitle>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription className="text-xs">{topic.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`text-xs ${getCategoryColor(topic.category)}`}>
            {topic.category}
          </Badge>
          <div className="flex gap-1">
            {topic.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {topic.viewCount > 0 && (
            <Badge variant="outline" className="text-xs ml-auto">
              {topic.viewCount} views
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
