"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HelpBadgeProps {
  children: React.ReactNode
  helpId: string
  tooltip: string
  onHelpClick: (helpId: string) => void
  variant?: "default" | "secondary" | "destructive" | "outline"
}

export function HelpBadge({ children, helpId, tooltip, onHelpClick, variant = "secondary" }: HelpBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onHelpClick(helpId)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className="cursor-help hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            onClick={handleClick}
          >
            {children}
            <HelpCircle className="h-3 w-3 ml-1 opacity-60" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
          <p className="text-xs text-muted-foreground mt-1">Click for detailed help</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
