"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useDeck } from "@/hooks/use-deck";
import { useKeyboardNav } from "@/hooks/use-keyboard-nav";
import { useGsapEnterExit } from "@/hooks/use-gsap-enter-exit";
import type { SlideData } from "@/lib/types";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export default function SlideRenderer({
  slide,
  presenter = false,
  preview = false,
  print = false,
}: {
  slide: SlideData;
  presenter?: boolean;
  preview?: boolean;
  print?: boolean;
}) {
  const { direction } = useDeck();

  // Keyboard navigation disabled in presenter preview panes
  const shouldEnableKeyboard = !presenter && !preview;
  useKeyboardNav(shouldEnableKeyboard);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];
  useGsapEnterExit({ container: containerRef, items: itemRefs }, direction);

  const fm = slide.frontmatter || {};
  const alignClass =
    fm.align === "left"
      ? "items-start text-left"
      : fm.align === "right"
        ? "items-end text-right"
        : "items-center text-center";

  const bgStyle: React.CSSProperties = fm.bg
    ? fm.bg.startsWith("url(") || fm.bg.includes("gradient")
      ? {
        backgroundImage: fm.bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
      : { background: fm.bg }
    : {};

  const containerClass = cn(
    "relative w-full max-w-[min(100vw,1600px)] bg-card text-card-foreground rounded-lg shadow-sm",
    print ? "aspect-auto overflow-visible" : "aspect-video overflow-hidden"
  );

  // Detect if content is markdown (starts with # or contains markdown syntax)
  const isMarkdown = slide.html.trim().startsWith('#') ||
    slide.html.includes('```') ||
    slide.html.includes('**') ||
    slide.html.includes('##');

  return (
    <div
      ref={containerRef}
      className={containerClass}
      style={bgStyle}
      role={presenter ? "group" : "region"}
      aria-label={fm.title || "Slide"}
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center p-6 md:p-12 gap-4",
          alignClass
        )}
      >
        {/* Title */}
        {fm.title ? (
          <div ref={itemRefs[0]} className="max-w-[80ch]">
            <h1 className="text-balance text-2xl md:text-4xl lg:text-5xl font-semibold">
              {fm.title}
            </h1>
          </div>
        ) : null}
        {/* Content (Markdown or HTML) */}
        <div
          ref={itemRefs[1]}
          className={cn(
            "prose prose-invert max-w-[85ch] text-pretty",
            print ? "" : "max-h-[65vh] md:max-h-[70vh] overflow-auto pr-2"
          )}
        >
          {isMarkdown ? (
            <MarkdownRenderer content={slide.html} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: slide.html }} />
          )}
        </div>
        {/* Placeholder for utility items participating in stagger sequence */}
        <div ref={itemRefs[2]} className="hidden" />
      </div>

      {/* Footer watermark for preview/print */}
      {(preview || print) && (
        <div className="absolute bottom-2 right-3 text-xs text-muted-foreground/70 select-none">
          Preview
        </div>
      )}
    </div>
  );
}
