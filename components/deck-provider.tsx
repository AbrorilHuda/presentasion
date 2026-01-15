"use client"

import type React from "react"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { clampIndex, nextIndex, prevIndex } from "@/utils/deck"

type DeckContextType = {
  totalSlides: number
  currentIndex: number
  setTotalSlides: (n: number) => void
  goNext: () => void
  goPrev: () => void
  goTo: (i: number, opts?: { replace?: boolean }) => void
  direction: "forward" | "backward"
}

export const DeckContext = createContext<DeckContextType | null>(null)

export function DeckProvider({
  children,
  totalSlides,
  initialIndex,
}: {
  children: React.ReactNode
  totalSlides: number
  initialIndex: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [count, setCount] = useState(totalSlides)
  const [index, setIndex] = useState(initialIndex)
  const [direction, setDirection] = useState<"forward" | "backward">("forward")
  const bcRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      bcRef.current = new BroadcastChannel("deck-nav")
      const bc = bcRef.current
      bc.onmessage = (ev) => {
        if (typeof ev.data?.index === "number") {
          setDirection(ev.data.index > index ? "forward" : "backward")
          setIndex(clampIndex(ev.data.index, count))
        }
      }
      return () => bc.close()
    }
  }, [count, index])

  useEffect(() => {
    setCount(totalSlides)
  }, [totalSlides])

  // Sync with URL param changes (back/forward)
  useEffect(() => {
    const match = pathname?.match(/\/s\/(\d+)/)
    if (match) {
      const i = clampIndex(Number(match[1]), count)
      setDirection(i > index ? "forward" : i < index ? "backward" : direction)
      setIndex(i)
    }
  }, [pathname, count]) // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (i: number, opts?: { replace?: boolean }) => {
      const target = clampIndex(i, count)
      setDirection(target > index ? "forward" : target < index ? "backward" : direction)
      setIndex(target)
      bcRef.current?.postMessage({ index: target })
      const url = `/s/${target}`
      if (opts?.replace) router.replace(url, { scroll: false })
      else router.push(url, { scroll: false })
    },
    [count, index, router, direction],
  )

  const goNext = useCallback(() => goTo(nextIndex(index, count)), [goTo, index, count])
  const goPrev = useCallback(() => goTo(prevIndex(index, count)), [goTo, index, count])

  const value = useMemo(
    () => ({
      totalSlides: count,
      currentIndex: index,
      setTotalSlides: setCount,
      goNext,
      goPrev,
      goTo,
      direction,
    }),
    [count, index, goNext, goPrev, goTo, direction],
  )

  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
}

export function useDeckContext() {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error("useDeckContext must be used within DeckProvider")
  return ctx
}
