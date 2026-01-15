"use client"

import { useEffect } from "react"
import { useDeck } from "./use-deck"

export function useKeyboardNav(enabled = true) {
  const { goNext, goPrev, goTo, totalSlides } = useDeck()
  useEffect(() => {
    if (!enabled) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      } else if (e.key === "Home") {
        e.preventDefault()
        goTo(1)
      } else if (e.key === "End") {
        e.preventDefault()
        goTo(totalSlides)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [enabled, goNext, goPrev, goTo, totalSlides])
}
