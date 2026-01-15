"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllSlides, StoredSlide } from "@/lib/slide-storage";
import { DeckProvider } from "@/components/deck-provider";
import SlideRenderer from "@/components/slide-renderer";
import Controls from "@/components/controls";
import Progress from "@/components/progress";
import ThemeToggle from "@/components/theme-toggle";

export default function SlidePage() {
  const params = useParams();
  const [slides, setSlides] = useState<StoredSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load slides from localStorage on client-side
    const loadedSlides = getAllSlides();
    setSlides(loadedSlides);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const totalSlides = slides.length;
  const index = params.index as string;
  const idx = Math.max(1, Math.min(totalSlides, Number(index || "1")));
  const slide = slides[idx - 1];

  return (
    <DeckProvider totalSlides={totalSlides} initialIndex={idx}>
      <main className="min-h-dvh flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 md:px-6">
          <div className="text-sm md:text-base text-muted-foreground">
            {slide?.frontmatter?.title || `Slide ${idx}`}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-2 md:p-6">
          <SlideRenderer slide={slide} />
        </div>
        <div className="border-t">
          <Progress />
          <Controls />
        </div>
      </main>
    </DeckProvider>
  );
}
