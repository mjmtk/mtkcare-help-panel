"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { HelpPanelContent } from "@/components/help/help-panel-content"
import { useHelp } from "@/components/help-provider"
import { cn } from "@/lib/utils"

export function IntegratedHelpPanel() {
  const { isOpen, closeHelp, mode } = useHelp()

  if (mode === 'pinned') {
    // For pinned mode, render as a fixed sidebar on the right
    return isOpen ? (
      <div className="fixed right-0 top-0 h-screen w-[400px] border-l bg-background z-40 lg:block hidden">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold">Help & Support</h2>
            <p className="text-sm text-muted-foreground">Get help with MTK Care</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <HelpPanelContent />
          </div>
        </div>
      </div>
    ) : null
  }

  // Sheet mode for mobile and when not pinned
  return (
    <Sheet open={isOpen} onOpenChange={closeHelp}>
      <SheetContent 
        side="right" 
        className={cn(
          "w-full sm:w-[540px] lg:w-[600px] p-0",
          "flex flex-col h-full"
        )}
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Help & Support</SheetTitle>
          <SheetDescription>
            Get help with MTK Care features and troubleshooting
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <HelpPanelContent />
        </div>
      </SheetContent>
    </Sheet>
  )
}