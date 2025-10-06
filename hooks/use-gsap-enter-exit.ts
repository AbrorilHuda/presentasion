"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

type Refs = {
  container: React.RefObject<HTMLElement | null>
  items?: Array<React.RefObject<HTMLElement | null>>
}

export function useGsapEnterExit(refs: Refs, direction: "forward" | "backward" = "forward") {
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const container = refs.container.current
    const items = (refs.items || []).map((r) => r.current).filter(Boolean) as HTMLElement[]

    if (!container) return

    if (reduceMotion) {
      // Immediately show elements without animation
      container.style.opacity = "1"
      items.forEach((el) => {
        el.style.opacity = "1"
        el.style.transform = ""
      })
      return
    }

    const fromX = direction === "forward" ? 60 : -60
    const toX = 0
    const ease = "power3.out"
    const durIn = 0.7
    const durOut = 0.5

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.fromTo(container, { x: fromX, opacity: 0, skewX: 6 }, { x: toX, opacity: 1, skewX: 0, duration: durIn, ease }, 0)

    if (items.length) {
      tl.fromTo(items, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease }, 0.1)
    }

    return () => {
      // Leave animation
      if (reduceMotion) return
      gsap.to(container, {
        x: direction === "forward" ? -60 : 60,
        opacity: 0,
        skewX: 6,
        duration: durOut,
        ease,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction])
}
