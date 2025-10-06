"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark" | "brand"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const saved = localStorage.getItem("deck-theme") as Theme | null
    if (saved) applyTheme(saved)
  }, [])

  function applyTheme(next: Theme) {
    setTheme(next)
    localStorage.setItem("deck-theme", next)
    const root = document.documentElement
    if (next === "light") {
      root.classList.remove("dark")
      root.style.setProperty("--bg", "oklch(1 0 0)")
      root.style.setProperty("--fg", "oklch(0.145 0 0)")
      root.style.setProperty("--accent", "oklch(0.6 0.118 184.704)")
    } else if (next === "dark") {
      root.classList.add("dark")
      root.style.setProperty("--bg", "oklch(0.145 0 0)")
      root.style.setProperty("--fg", "oklch(0.985 0 0)")
      root.style.setProperty("--accent", "oklch(0.696 0.17 162.48)")
    } else {
      // brand gradient preset
      root.classList.remove("dark")
      root.style.setProperty("--bg", "linear-gradient(135deg, oklch(0.98 0 0) 0%, oklch(0.95 0.05 220) 100%)")
      root.style.setProperty("--fg", "oklch(0.145 0 0)")
      root.style.setProperty("--accent", "oklch(0.646 0.222 41.116)")
    }
  }

  function onClick() {
    const order: Theme[] = ["light", "dark", "brand"]
    const idx = order.indexOf(theme)
    applyTheme(order[(idx + 1) % order.length])
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault()
        onClick()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [theme])

  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-muted"
      aria-label="Toggle theme (Ctrl/Cmd + J)"
      title="Toggle theme (Ctrl/Cmd + J)"
    >
      Theme: {theme}
    </button>
  )
}
