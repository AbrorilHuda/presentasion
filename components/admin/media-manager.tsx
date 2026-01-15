"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMediaGallery,
  deleteMediaFile,
  addMediaFile,
} from "@/lib/slide-storage";
import type { MediaFile } from "@/lib/slide-storage";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MediaManagerProps {
  onSelectMedia: (url: string) => void;
}

export default function MediaManager({ onSelectMedia }: MediaManagerProps) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMedia(getMediaGallery());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        const mediaFile = await addMediaFile(file);
        setMedia((prev) => [...prev, mediaFile]);
        successCount++;
      } catch (err) {
        console.error("Upload failed:", err);
        failCount++;
      }
    }
    setIsUploading(false);
    e.currentTarget.value = "";

    // Show toast notification
    if (successCount > 0) {
      toast.success(`${successCount} file berhasil diupload!`);
    }
    if (failCount > 0) {
      toast.error(`${failCount} file gagal diupload!`);
    }
  };

  const handleDelete = (id: string) => {
    deleteMediaFile(id);
    setMedia((prev) => prev.filter((m) => m.id !== id));
    toast.success("Media berhasil dihapus!");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Media</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {isUploading ? "Uploading..." : "Supports PNG, JPG, GIF, MP4, WebM"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Media Gallery ({media.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No media uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {media.map((m) => (
                <div
                  key={m.id}
                  className="relative group cursor-pointer rounded-lg overflow-hidden bg-muted border"
                >
                  <div
                    className="w-full aspect-square bg-muted flex items-center justify-center"
                    onClick={() => onSelectMedia(m.url)}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.url || "/placeholder.svg"}
                        alt={m.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(m.id);
                      }}
                      className="p-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 pointer-events-auto"
                      aria-label="Delete media"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground p-2 truncate">
                    {m.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div >
  );
}
