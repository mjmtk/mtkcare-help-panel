"use client"

import { Book, FileText, Lightbulb, HelpCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { HelpContent } from "@/types/help"

interface HelpTopicDetailsProps {
  topic: HelpContent | null
  loading?: boolean
  isShared?: boolean
}

export function HelpTopicDetails({ topic, loading, isShared }: HelpTopicDetailsProps) {
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        <div className="text-center">
          <HelpCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Select a help topic to view details</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className={`${isShared ? "h-[calc(100vh-200px)]" : "h-[400px]"} pr-4`}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(topic.category)}
            <h3 className="text-lg font-semibold">{topic.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Content</h4>
          <div className="text-sm leading-relaxed whitespace-pre-line">{topic.content}</div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium mb-2">Tags</h4>
          <div className="flex flex-wrap gap-1">
            {topic.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground">
          <p>Views: {topic.viewCount}</p>
          <p>Last updated: {new Date(topic.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </ScrollArea>
  )
}
