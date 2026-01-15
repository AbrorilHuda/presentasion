"use client";

import { useEffect, useState } from "react";
import { getAllSlides } from "@/lib/slide-storage";
import SlideRenderer from "@/components/slide-renderer";
import { DeckProvider } from "@/components/deck-provider";
import type { SlideData } from "@/lib/types";

export default function PrintPage() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedSlides = getAllSlides();
    setSlides(loadedSlides);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading slides for print...</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          No slides found. Create slides in the admin dashboard first.
        </p>
      </div>
    );
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            @page { 
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .print-slide {
              page-break-after: always;
              page-break-inside: avoid;
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .print-slide:last-child {
              page-break-after: auto;
            }
            .no-print {
              display: none !important;
            }
          }
          @media screen {
            .print-slide {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              border-bottom: 2px solid #e5e7eb;
            }
          }
        `,
        }}
      />

      {/* Print Instructions - Hidden when printing */}
      <div className="no-print fixed top-4 right-4 bg-card border rounded-lg shadow-lg p-4 max-w-md z-50">
        <h3 className="font-semibold mb-2">📄 Export to PDF</h3>
        <ol className="text-sm space-y-1 text-muted-foreground">
          <li>
            1. Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+P</kbd>{" "}
            (or <kbd className="px-2 py-1 bg-muted rounded">Cmd+P</kbd> on Mac)
          </li>
          <li>2. Select "Save as PDF" as destination</li>
          <li>3. Choose "Landscape" orientation</li>
          <li>4. Set margins to "None"</li>
          <li>5. Enable "Background graphics"</li>
          <li>6. Click "Save"</li>
        </ol>
        <p className="text-xs mt-3 text-muted-foreground">
          Total slides: <strong>{slides.length}</strong>
        </p>
      </div>

      {/* Slides for printing */}
      <div>
        {slides.map((slide, i) => (
          <div key={i} className="print-slide">
            <DeckProvider totalSlides={slides.length} initialIndex={i + 1}>
              <SlideRenderer slide={slide} print />
            </DeckProvider>
          </div>
        ))}
      </div>
    </>
  );
}
