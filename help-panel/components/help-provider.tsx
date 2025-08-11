"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import type { HelpContextType, HelpPanelConfig } from '../types/help'

const HelpContext = createContext<HelpContextType | undefined>(undefined)

interface HelpProviderProps {
  children: React.ReactNode
  config?: Partial<HelpPanelConfig>
}

const defaultConfig: HelpPanelConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_HELP_API_URL || '/api',
  theme: 'auto',
  position: 'right',
  defaultMode: 'sheet',
  analytics: false, // Disabled by default for compliance
}

export function HelpProvider({ children, config: userConfig }: HelpProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'sheet' | 'pinned'>(userConfig?.defaultMode || 'sheet')
  const [currentSection, setCurrentSection] = useState<string>()

  const config = { ...defaultConfig, ...userConfig }

  const toggleHelp = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const openHelp = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeHelp = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <HelpContext.Provider
      value={{
        isOpen,
        mode,
        toggleHelp,
        openHelp,
        closeHelp,
        setMode,
        currentSection,
        setCurrentSection,
        config,
      }}
    >
      {children}
    </HelpContext.Provider>
  )
}

export function useHelp() {
  const context = useContext(HelpContext)
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider')
  }
  return context
}