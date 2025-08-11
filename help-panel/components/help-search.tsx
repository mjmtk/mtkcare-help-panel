"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { HelpAPI } from "@/lib/help/help-api"

interface HelpSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function HelpSearch({ onSearch, placeholder = "Search help topics..." }: HelpSearchProps) {
  const [query, setQuery] = useState("")

  const handleSearch = async (value: string) => {
    setQuery(value)
    onSearch(value)

    if (value.trim()) {
      // Track search analytics
      await HelpAPI.trackAnalytics({
        topicId: "",
        action: "search",
        timestamp: new Date().toISOString(),
        context: value,
      })
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input placeholder={placeholder} value={query} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
    </div>
  )
}
