"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDeck } from "@/hooks/use-deck";
import type { SlideData } from "@/lib/types";
import SlideRenderer from "@/components/slide-renderer";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

export default function PresenterPage() {
  return <PresenterLoader />;
}

function PresenterLoader() {
  const [slides, setSlides] = useState<SlideData[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/print?format=json", { cache: "no-store" });
      const data = (await res.json()) as SlideData[];
      setSlides(data);
    })();
  }, []);

  if (!slides.length) {
    return (
      <div className="p-6 text-muted-foreground">Loading presenter view…</div>
    );
  }

  return <PresenterContent slides={slides} />;
}

function PresenterContent({ slides }: { slides: SlideData[] }) {
  const { currentIndex, goNext, goPrev, setTotalSlides } = useDeck();
  const [showNotes, setShowNotes] = useState(true);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTotalSlides(slides.length);
  }, [slides.length, setTotalSlides]);

  useEffect(() => {
    if (!running) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setRunning((r) => !r);
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setShowNotes((s) => !s);
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  const slide = slides[currentIndex - 1];
  const nextSlide = slides[Math.min(slides.length - 1, currentIndex)];

  const mmss = useMemo(() => {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [elapsed]);

  const totalSlides = slides.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 min-h-screen">
      <section aria-label="Current slide" className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Current ({currentIndex}/{totalSlides})
        </div>
        <div className="border rounded-lg overflow-hidden bg-card">
          <SlideRenderer slide={slide} presenter />
        </div>
      </section>
      <section aria-label="Next and notes" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Next</div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-muted"
              onClick={() => setRunning((r) => !r)}
              aria-pressed={running}
              aria-label={running ? "Stop timer" : "Start timer"}
            >
              {running ? "Stop" : "Start"}
            </button>
            <button
              className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-muted"
              onClick={() => setElapsed(0)}
              aria-label="Reset timer"
            >
              Reset
            </button>
            <span
              className={cn(
                "font-mono text-lg",
                elapsed > 60 ? "text-destructive" : "text-foreground"
              )}
            >
              {mmss}
            </span>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden bg-card">
          <SlideRenderer slide={nextSlide} presenter preview />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold">Notes</h3>
            <button
              className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-muted"
              onClick={() => setShowNotes((s) => !s)}
              aria-pressed={showNotes}
              aria-label="Toggle notes"
            >
              {showNotes ? "Hide" : "Show"}
            </button>
          </div>
          {showNotes ? (
            <div className="mt-2 p-3 rounded-md bg-muted text-muted-foreground whitespace-pre-wrap min-h-24">
              {slide?.frontmatter?.notes || "No notes for this slide."}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
