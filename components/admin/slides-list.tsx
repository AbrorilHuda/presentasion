"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SlideData } from "@/lib/types";

interface SlidesListProps {
  slides: SlideData[];
  selectedIndex: number | null;
  onSelectSlide: (index: number) => void;
}

export default function SlidesList({
  slides,
  selectedIndex,
  onSelectSlide,
}: SlidesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Slides ({slides.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {slides.map((slide, idx) => (
            <Button
              key={idx}
              variant={selectedIndex === idx ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onSelectSlide(idx)}
            >
              <span className="mr-2 font-mono text-xs">{idx + 1}</span>
              <span className="truncate">
                {slide.frontmatter?.title || `Slide ${idx + 1}`}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
