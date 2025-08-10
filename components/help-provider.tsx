"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

interface HelpContextType {
  isOpen: boolean
  mode: 'sheet' | 'pinned'
  toggleHelp: () => void
  openHelp: () => void
  closeHelp: () => void
  setMode: (mode: 'sheet' | 'pinned') => void
  currentSection?: string
  setCurrentSection: (section: string) => void
}

const HelpContext = createContext<HelpContextType | undefined>(undefined)

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'sheet' | 'pinned'>('sheet')
  const [currentSection, setCurrentSection] = useState<string>()

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