"use client"

import { useContext } from "react"
import { DeckContext } from "@/components/deck-provider"

// Safe version that doesn't throw when context is missing
export function useDeck() {
    const ctx = useContext(DeckContext)
    if (!ctx) {
        // Return default values when not in DeckProvider (e.g., presenter mode)
        return {
            totalSlides: 0,
            currentIndex: 1,
            setTotalSlides: () => { },
            goNext: () => { },
            goPrev: () => { },
            goTo: () => { },
            direction: "forward" as const,
        }
    }
    return ctx
}
