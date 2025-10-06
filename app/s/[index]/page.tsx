import { getSlides } from "@/lib/markdown";
import { DeckProvider } from "@/components/deck-provider";
import SlideRenderer from "@/components/slide-renderer";
import Controls from "@/components/controls";
import Progress from "@/components/progress";
import ThemeToggle from "@/components/theme-toggle";

export const dynamic = "force-static";

export default async function SlidePage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const slides = await getSlides();
  const totalSlides = slides.length;
  const { index } = await params;
  const idx = Math.max(1, Math.min(totalSlides, Number(index || "1")));
  const slide = slides[idx - 1];

  return (
    <DeckProvider totalSlides={totalSlides} initialIndex={idx}>
      <main className="min-h-dvh flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 md:px-6">
          <div className="text-sm md:text-base text-muted-foreground">
            {slide.frontmatter?.title || `Slide ${idx}`}
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
