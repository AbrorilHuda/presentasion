const SLIDES_STORAGE_KEY = "slides_deck";
const MEDIA_STORAGE_KEY = "media_gallery";
const ADMIN_PASSWORD = "admin123";

export type MediaFile = {
  id: string;
  name: string;
  url: string;
  type: "image" | "video";
  uploadedAt: number;
};

export type StoredSlide = {
  frontmatter: {
    title?: string;
    notes?: string;
    bg?: string;
    align?: "center" | "left" | "right";
    layout?: "title" | "bullets" | "image" | "content";
  };
  html: string;
};

// Initialize default slides if none exist
function getDefaultSlides(): StoredSlide[] {
  return [
    {
      frontmatter: {
        title: "Welcome to Slide Presentation! 👋",
        layout: "title",
        align: "center"
      },
      html: "<h1>Welcome to Slide Presentation</h1><p>A modern web-based presentation tool</p><p class='text-muted-foreground'>Press <kbd>→</kbd> or <kbd>Space</kbd> to continue</p>",
    },
    {
      frontmatter: {
        title: "Getting Started",
        layout: "content",
        align: "left",
        notes: "Explain the three main modes of the application"
      },
      html: "<h2>Three Ways to Use This App</h2><ul><li><strong>Admin Dashboard</strong> - Create and edit slides</li><li><strong>Slide Viewer</strong> - Present to your audience</li><li><strong>Presenter Mode</strong> - Present with notes and timer</li></ul>",
    },
    {
      frontmatter: {
        title: "Admin Dashboard 🎨",
        layout: "content",
        align: "left",
        notes: "Show how to access and use the admin dashboard"
      },
      html: "<h2>Create Your Slides</h2><p>Go to <strong>/admin/login</strong> (password: <code>admin123</code>)</p><ul><li>Click <strong>Add Slide</strong> to create new slides</li><li>Edit content in the <strong>Content</strong> tab</li><li>Upload media in the <strong>Media</strong> tab</li><li>Configure settings in the <strong>Settings</strong> tab</li></ul><li>print to pdf <strong>slide</strong></li>",
    },
    {
      frontmatter: {
        title: "Keyboard Shortcuts ⌨️",
        layout: "content",
        align: "left",
        notes: "List all available keyboard shortcuts"
      },
      html: "<h2>Navigate Like a Pro</h2><p><strong>Slide Viewer:</strong></p><ul><li><kbd>→</kbd> or <kbd>Space</kbd> - Next slide</li><li><kbd>←</kbd> - Previous slide</li><li><kbd>Home</kbd> - First slide</li><li><kbd>End</kbd> - Last slide</li></ul><p><strong>Presenter Mode:</strong></p><ul><li><kbd>T</kbd> - Start/Stop timer</li><li><kbd>N</kbd> - Toggle notes</li></ul>",
    },
    {
      frontmatter: {
        title: "Presenter Mode 🎭",
        layout: "content",
        align: "left",
        notes: "This is an example of speaker notes! Only visible in presenter mode."
      },
      html: "<h2>Dual-Screen Presentation</h2><p>Open <strong>/presenter</strong> on your laptop to see:</p><ul><li>Current slide (full view)</li><li>Next slide preview</li><li>Speaker notes (like this one!)</li><li>Timer and slide counter</li></ul><p class='text-muted-foreground'>Perfect for professional presentations</p>",
    },
    {
      frontmatter: {
        title: "Ready to Start? 🚀",
        layout: "title",
        align: "center"
      },
      html: "<h1>You're All Set!</h1><p>Delete these tutorial slides and create your own</p><p class='text-muted-foreground'>Go to <strong>/admin/dashboard</strong> to begin</p>",
    },
  ];
}

export function getAllSlides(): StoredSlide[] {
  if (typeof window === "undefined") return getDefaultSlides();
  const stored = localStorage.getItem(SLIDES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : getDefaultSlides();
}

export function getMediaGallery(): MediaFile[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addSlide(slide: StoredSlide): StoredSlide[] {
  const slides = getAllSlides();
  slides.push(slide);
  localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
  return slides;
}

export function updateSlide(index: number, slide: StoredSlide): StoredSlide[] {
  const slides = getAllSlides();
  slides[index] = slide;
  localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
  return slides;
}

export function deleteSlide(index: number): StoredSlide[] {
  const slides = getAllSlides();
  slides.splice(index, 1);
  localStorage.setItem(SLIDES_STORAGE_KEY, JSON.stringify(slides));
  return slides;
}

export function addMediaFile(file: File): MediaFile {
  const reader = new FileReader();
  const mediaFile: MediaFile | null = null;

  return new Promise((resolve) => {
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const media: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        url,
        type: file.type.startsWith("video") ? "video" : "image",
        uploadedAt: Date.now(),
      };
      const gallery = getMediaGallery();
      gallery.push(media);
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(gallery));
      resolve(media);
    };
    reader.readAsDataURL(file);
  }) as any;
}

export function deleteMediaFile(id: string): MediaFile[] {
  const gallery = getMediaGallery();
  const filtered = gallery.filter((m) => m.id !== id);
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
