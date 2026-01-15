"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StoredSlide } from "@/lib/slide-storage";
import { updateSlide, deleteSlide } from "@/lib/slide-storage";
import MediaManager from "./media-manager";
import { toast } from "sonner";

interface SlideEditorProps {
  slide: StoredSlide;
  index: number;
  onUpdate: (slide: StoredSlide) => void;
  onDelete: () => void;
}

export default function SlideEditor({
  slide,
  index,
  onUpdate,
  onDelete,
}: SlideEditorProps) {
  const [formData, setFormData] = useState(slide);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  // Sync formData with slide prop when it changes (fixes navigation bug)
  useEffect(() => {
    setFormData(slide);
  }, [slide]);

  const handleSave = async () => {
    setIsSaving(true);
    updateSlide(index, formData);
    onUpdate(formData);
    setIsSaving(false);
    toast.success("Slide berhasil disimpan!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      deleteSlide(index);
      onDelete();
      toast.success("Slide berhasil dihapus!");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      frontmatter: {
        ...formData.frontmatter,
        title: e.target.value,
      },
    });
  };

  const handleLayoutChange = (value: string) => {
    setFormData({
      ...formData,
      frontmatter: {
        ...formData.frontmatter,
        layout: value as any,
      },
    });
  };

  const handleAlignChange = (value: string) => {
    setFormData({
      ...formData,
      frontmatter: {
        ...formData.frontmatter,
        align: value as any,
      },
    });
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      frontmatter: {
        ...formData.frontmatter,
        bg: e.target.value,
      },
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      html: e.target.value,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      frontmatter: {
        ...formData.frontmatter,
        notes: e.target.value,
      },
    });
  };

  const insertMediaToContent = (url: string) => {
    const isVideo = url.includes("video") || url.startsWith("data:video");
    const tag = isVideo
      ? `<video src="${url}" controls style="max-width: 100%; height: auto;"></video>`
      : `<img src="${url}" alt="Inserted media" style="max-width: 100%; height: auto;" />`;
    console.log("ketakan", tag)

    const updatedFormData = {
      ...formData,
      html: formData.html + "\n" + tag,
    };

    setFormData(updatedFormData);

    // Auto-save after inserting media
    setTimeout(() => {
      updateSlide(index, updatedFormData);
      onUpdate(updatedFormData);

      // Switch to content tab and show success message
      setActiveTab("content");
      toast.success(isVideo ? "Video berhasil ditambahkan!" : "Gambar berhasil ditambahkan!");
    }, 100);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Slide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.frontmatter?.title || ""}
                onChange={handleTitleChange}
                placeholder="Slide title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Content (HTML)
              </label>
              <Textarea
                value={formData.html}
                onChange={handleContentChange}
                placeholder="Enter HTML content"
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Tags: &lt;h1&gt; &lt;h2&gt; &lt;p&gt; &lt;ul&gt; &lt;li&gt;
                &lt;img&gt; &lt;video&gt; &lt;strong&gt; &lt;em&gt;
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="media">
        <MediaManager onSelectMedia={insertMediaToContent} />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Slide Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Layout</label>
              <Select
                value={formData.frontmatter?.layout || "content"}
                onValueChange={handleLayoutChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="bullets">Bullets</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alignment</label>
              <Select
                value={formData.frontmatter?.align || "center"}
                onValueChange={handleAlignChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Background Color
              </label>
              <Input
                type="text"
                value={formData.frontmatter?.bg || ""}
                onChange={handleBgChange}
                placeholder="e.g., #ffffff, blue, rgb(255,255,255)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                CSS color value (hex, name, rgb, etc.)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Speaker Notes
              </label>
              <Textarea
                value={formData.frontmatter?.notes || ""}
                onChange={handleNotesChange}
                placeholder="Notes for presenter"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Slide
        </Button>
      </div>
    </Tabs>
  );
}
