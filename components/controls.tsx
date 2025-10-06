"use client"

import { useDeck } from "@/hooks/use-deck"

export default function Controls() {
  const { currentIndex, totalSlides, goNext, goPrev } = useDeck()
  return (
    <div className="flex items-center justify-between px-4 py-2 md:px-6">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-muted focus-visible:outline outline-2 outline-ring/50"
          onClick={goPrev}
          aria-label="Previous slide"
        >
          ← Prev
        </button>
        <button
          className="px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline outline-2 outline-ring/50"
          onClick={goNext}
          aria-label="Next slide"
        >
          Next →
        </button>
      </div>
      <div className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
        {currentIndex}/{totalSlides}
      </div>
    </div>
  )
}
