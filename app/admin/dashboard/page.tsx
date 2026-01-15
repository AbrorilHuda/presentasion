"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SlideEditor from "@/components/admin/slide-editor";
import SlidesList from "@/components/admin/slides-list";
import { getAllSlides, addSlide } from "@/lib/slide-storage";
import type { SlideData } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuthenticated =
      sessionStorage.getItem("admin_authenticated") === "true";
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // Load slides
    setSlides(getAllSlides());
    setIsLoading(false);
  }, [router]);

  const handleAddSlide = () => {
    const newSlide: SlideData = {
      frontmatter: { title: "New Slide", layout: "content" },
      html: "<p>Edit this content...</p>",
    };
    const updated = addSlide(newSlide);
    setSlides(updated);
    setSelectedIndex(updated.length - 1);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="border-b">
        <div className="flex items-center justify-between p-4 md:p-6">
          <h1 className="text-2xl font-bold">Slide Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddSlide}>
              Add Slide
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/print', '_blank')}
            >
              Export PDF
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6">
        <div className="lg:col-span-1">
          <SlidesList
            slides={slides}
            selectedIndex={selectedIndex}
            onSelectSlide={setSelectedIndex}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedIndex !== null && selectedIndex < slides.length ? (
            <SlideEditor
              slide={slides[selectedIndex]}
              index={selectedIndex}
              onUpdate={(updated) => {
                const newSlides = [...slides];
                newSlides[selectedIndex] = updated;
                setSlides(newSlides);
              }}
              onDelete={() => {
                const newSlides = slides.filter((_, i) => i !== selectedIndex);
                setSlides(newSlides);
                setSelectedIndex(null);
              }}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Select a slide to edit</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
