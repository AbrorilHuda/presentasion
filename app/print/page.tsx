import { getSlides } from "@/lib/markdown";
import SlideRenderer from "@/components/slide-renderer";
import { DeckProvider } from "@/components/deck-provider";

export const dynamic = "force-dynamic";

export default async function PrintPage({
  searchParams,
}: {
  searchParams: { format?: string };
}) {
  const slides = await getSlides();
  const params = await searchParams;
  if (params.format === "json") {
    return new Response(JSON.stringify(slides), {
      headers: { "content-type": "application/json" },
    });
  }

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@media print {
  @page { size: 1920px 1080px; margin: 0; }
  .print-slide { page-break-after: always; }
  body { background: white !important; }
}
`,
        }}
      />
      <div className="p-4 md:p-6">
        {slides.map((s, i) => (
          <div
            key={i}
            className="print-slide my-4 border rounded-md overflow-visible"
          >
            <DeckProvider totalSlides={slides.length} initialIndex={i + 1}>
              <SlideRenderer slide={s} print />
            </DeckProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
