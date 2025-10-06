"use client"

import { useEffect, useMemo, useState } from "react"
import { useDeck } from "@/hooks/use-deck"

export default function Progress() {
  const { currentIndex, totalSlides, goTo } = useDeck()
  const pct = useMemo(() => Math.round((currentIndex / Math.max(1, totalSlides)) * 100), [currentIndex, totalSlides])
  const [showMiniMap, setShowMiniMap] = useState(true)

  useEffect(() => {
    const v = localStorage.getItem("showMiniMap")
    if (v != null) setShowMiniMap(v === "true")
  }, [])

  useEffect(() => {
    localStorage.setItem("showMiniMap", String(showMiniMap))
  }, [showMiniMap])

  return (
    <div className="px-4 md:px-6 py-2">
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden" title={`${pct}%`}>
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{pct}%</div>
        <button
          className="text-xs underline text-muted-foreground hover:text-foreground"
          onClick={() => setShowMiniMap((s) => !s)}
          aria-pressed={showMiniMap}
          aria-label="Toggle minimap"
        >
          {showMiniMap ? "Hide mini-map" : "Show mini-map"}
        </button>
      </div>
      {showMiniMap ? (
        <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label="Slide mini-map">
          {Array.from({ length: totalSlides }).map((_, i) => {
            const isActive = i + 1 === currentIndex
            return (
              <button
                key={i}
                className={`h-2 w-4 rounded ${isActive ? "bg-primary" : "bg-muted hover:bg-muted-foreground/30"}`}
                onClick={() => goTo(i + 1)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? "true" : "false"}
                title={`Slide ${i + 1}`}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
