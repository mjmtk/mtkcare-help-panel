"use client"

import { useState } from "react"
import { HelpCircle, TrendingUp, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Progress } from "@/components/ui/progress"
import { HelpPanelContent } from "./help-panel-content"
import { InteractiveHelpText } from "./interactive-help-text"
import { HelpBadge } from "./help-badge"
import type { HelpContent } from "@/types/help"

interface HelpPanelProps {
  currentContext?: string
  onContextChange?: (context: string) => void
}

export default function HelpPanel({ currentContext = "dashboard-overview", onContextChange }: HelpPanelProps) {
  const [isSharedMode, setIsSharedMode] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string>(currentContext)

  const handleTopicSelect = (topic: HelpContent) => {
    console.log("HelpPanel: Topic selected:", topic.id)
    setSelectedTopicId(topic.id)
    onContextChange?.(topic.id)
  }

  const handleHelpClick = (helpId: string) => {
    console.log("HelpPanel: Interactive Help clicked:", helpId)
    setSelectedTopicId(helpId)
    onContextChange?.(helpId)

    // Open help panel if not already open
    if (!isSharedMode) {
      setIsHelpOpen(true)
    }
  }

  const handleToggleShared = () => {
    console.log("Toggling shared mode:", !isSharedMode)
    setIsSharedMode(!isSharedMode)
    if (!isSharedMode) {
      // If switching to shared mode, close the overlay
      setIsHelpOpen(false)
    }
  }

  return (
    <div className="flex h-screen w-full">
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${isSharedMode ? "mr-0" : ""}`}>
        <div className="h-full p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Your Application Dashboard</h1>
              <div className="flex items-center gap-2">
                {/* Only show help button when not in shared mode */}
                {!isSharedMode && (
                  <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Help
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] sm:w-[540px] p-6">
                      <HelpPanelContent
                        selectedTopicId={selectedTopicId}
                        onTopicSelect={handleTopicSelect}
                        onClose={() => setIsHelpOpen(false)}
                        onToggleShared={handleToggleShared}
                        isShared={false}
                      />
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>

            {/* Simplified Interactive Help Content Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <InteractiveHelpText
                        helpId="real-time-metrics"
                        tooltip="Live data that updates automatically every few seconds"
                        onHelpClick={handleHelpClick}
                      >
                        Real-time Metrics
                      </InteractiveHelpText>
                    </span>
                    <HelpBadge
                      helpId="api-rate-limits"
                      tooltip="Current API usage against your plan limits"
                      onHelpClick={handleHelpClick}
                      variant="outline"
                    >
                      85% Used
                    </HelpBadge>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground">850/1000 requests this hour</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <InteractiveHelpText
                        helpId="conversion-rate"
                        tooltip="Percentage of visitors who complete desired actions"
                        onHelpClick={handleHelpClick}
                      >
                        Conversion Rate
                      </InteractiveHelpText>
                    </span>
                    <span className="text-sm font-bold text-green-600">3.2%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                  <p className="text-xs text-muted-foreground">↑ 0.3% from last week</p>
                </div>
              </div>
            </div>

            {/* Sample content cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analytics Dashboard
                  </CardTitle>
                  <CardDescription>View comprehensive analytics with real-time updates.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Monitor your key performance indicators and track user engagement across all channels.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Performance Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Our platform automatically optimizes performance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    General Help
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">Click the help button for general assistance.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Mode Help Panel */}
      {isSharedMode && (
        <div className="w-[600px] border-l bg-background flex flex-col">
          <div className="p-6 h-full">
            <HelpPanelContent
              isShared={true}
              onToggleShared={handleToggleShared}
              selectedTopicId={selectedTopicId}
              onTopicSelect={handleTopicSelect}
            />
          </div>
        </div>
      )}
    </div>
  )
}
