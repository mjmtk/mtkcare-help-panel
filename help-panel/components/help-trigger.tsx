"use client"

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { useHelp } from "@/components/help-provider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function HelpTrigger() {
  const { toggleHelp } = useHelp()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleHelp}
            className="h-8 w-8"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">Toggle help panel</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Help & Support</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}