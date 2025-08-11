"use client"

import type React from "react"

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InteractiveHelpTextProps {
  children: React.ReactNode
  helpId: string
  tooltip: string
  onHelpClick: (helpId: string) => void
  className?: string
}

export function InteractiveHelpText({
  children,
  helpId,
  tooltip,
  onHelpClick,
  className = "",
}: InteractiveHelpTextProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onHelpClick(helpId)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex items-center gap-1 cursor-help text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-dotted underline-offset-2 transition-colors ${className}`}
            onClick={handleClick}
          >
            {children}
            <HelpCircle className="h-3 w-3 opacity-60" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for detailed help</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
