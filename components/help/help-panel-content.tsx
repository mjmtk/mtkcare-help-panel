"use client"

import { useState, useRef, useEffect } from "react"
import { HelpCircle, PanelRightClose, PanelRightOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area"
import { HelpSearch } from "./help-search"
import { HelpTopicCard } from "./help-topic-card"
import { HelpTopicDetails } from "./help-topic-details"
import { useHelpContent, useHelpTopic } from "@/hooks/use-help-content"
import type { HelpContent } from "@/types/help"

interface HelpPanelContentProps {
  isShared?: boolean
  onClose?: () => void
  onToggleShared?: () => void
  selectedTopicId?: string
  onTopicSelect?: (topic: HelpContent) => void
}

export function HelpPanelContent({
  isShared = false,
  onClose,
  onToggleShared,
  selectedTopicId,
  onTopicSelect,
}: HelpPanelContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("content")
  const { content, loading: contentLoading, error, refetch } = useHelpContent({ query: searchQuery || undefined })
  const { topic: selectedTopic, loading: topicLoading } = useHelpTopic(selectedTopicId || null)

  const scrollAreaViewportRef = useRef<HTMLDivElement>(null)

  const handleTopicSelect = (topic: HelpContent) => {
    console.log("HelpPanelContent: Topic selected:", topic.id)
    onTopicSelect?.(topic)
    setActiveTab("details")
  }

  useEffect(() => {
    if (activeTab === "content" && selectedTopicId && scrollAreaViewportRef.current) {
      const selectedElement = scrollAreaViewportRef.current.querySelector(
        `[data-topic-id="${selectedTopicId}"]`,
      ) as HTMLElement | null
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }, [selectedTopicId, activeTab, contentLoading])

  console.log("HelpPanelContent render:", {
    contentLoading,
    contentCount: content.length,
    error,
    searchQuery,
    selectedTopicIdProp: selectedTopicId,
    selectedTopicState: selectedTopic?.id,
    activeTab,
  })

  return (
    <div className={`${isShared ? "h-full" : ""} space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          <span className="font-semibold">Help & Documentation</span>
        </div>
        <div className="flex items-center gap-2">
          {onToggleShared && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleShared}
              className="h-8 px-2"
              title={isShared ? "Unpin help panel" : "Pin help panel"}
            >
              {isShared ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </Button>
          )}
          {!isShared && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <PanelRightClose className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <HelpSearch onSearch={setSearchQuery} />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">Error loading help content: {error}</p>
          <Button variant="outline" size="sm" onClick={refetch} className="mt-2 bg-transparent">
            Retry
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Help Topics</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <ScrollArea className={`${isShared ? "h-[calc(100vh-200px)]" : "h-[400px]"} pr-4`}>
            <ScrollAreaViewport ref={scrollAreaViewportRef}>
              <div className="space-y-2">
                {contentLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : content.length > 0 ? (
                  content.map((topic) => (
                    <HelpTopicCard
                      key={topic.id}
                      topic={topic}
                      isSelected={selectedTopicId === topic.id}
                      onClick={handleTopicSelect}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No help topics found</p>
                    {searchQuery && <p className="text-sm mt-2">Try adjusting your search terms</p>}
                  </div>
                )}
              </div>
            </ScrollAreaViewport>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="details" className="mt-4">
          {/* Removed key prop, relying on useHelpTopic's useEffect to re-fetch */}
          <HelpTopicDetails topic={selectedTopic} loading={topicLoading} isShared={isShared} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
