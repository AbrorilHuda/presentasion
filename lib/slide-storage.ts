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
      html: "# Welcome to Slide Presentation\n\nA modern web-based presentation tool\n\n*Press → or Space to continue*",
    },
    {
      frontmatter: {
        title: "Getting Started",
        layout: "content",
        align: "left",
        notes: "Explain the three main modes of the application"
      },
      html: "## Three Ways to Use This App\n\n- **Admin Dashboard** - Create and edit slides\n- **Slide Viewer** - Present to your audience\n- **Presenter Mode** - Present with notes and timer",
    },
    {
      frontmatter: {
        title: "Admin Dashboard 🎨",
        layout: "content",
        align: "left",
        notes: "Show how to access and use the admin dashboard"
      },
      html: "## Create Your Slides\n\nGo to **/admin/login** (password: `admin123`)\n\n- Click **Add Slide** to create new slides\n- Edit content in the **Content** tab using **Markdown**\n- Upload media in the **Media** tab\n- Configure settings in the **Settings** tab\n- Print to PDF using **Export PDF** button",
    },
    {
      frontmatter: {
        title: "Markdown Support ✨",
        layout: "content",
        align: "left",
        notes: "Show markdown features and syntax highlighting"
      },
      html: "## Write Content in Markdown\n\n**Text Formatting:**\n- **Bold** with `**text**`\n- *Italic* with `*text*`\n- `Inline code` with backticks\n\n**Code Blocks with Syntax Highlighting:**\n\n```javascript\nfunction hello() {\n  console.log('Hello World!');\n}\n```\n\n**Lists, Tables, and More!**",
    },
    {
      frontmatter: {
        title: "Image support",
        layout: "image",
        align: "center",
        notes: "Show image support"
      },
      html: "## Image support\n\n![Image](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kaW5nfGVufDB8fDB8fHww)",
    },
    {
      frontmatter: {
        title: "Keyboard Shortcuts ⌨️",
        layout: "content",
        align: "left",
        notes: "List all available keyboard shortcuts"
      },
      html: "## Navigate Like a Pro\n\n**Slide Viewer:**\n- `→` or `Space` - Next slide\n- `←` - Previous slide\n- `Home` - First slide\n- `End` - Last slide\n\n**Presenter Mode:**\n- `T` - Start/Stop timer\n- `N` - Toggle notes",
    },
    {
      frontmatter: {
        title: "Presenter Mode 🎭",
        layout: "content",
        align: "left",
        notes: "This is an example of speaker notes! Only visible in presenter mode."
      },
      html: "## Dual-Screen Presentation\n\nOpen **/presenter** on your laptop to see:\n\n- Current slide (full view)\n- Next slide preview\n- Speaker notes (like this one!)\n- Timer and slide counter\n\n*Perfect for professional presentations*",
    },
    {
      frontmatter: {
        title: "Ready to Start? 🚀",
        layout: "title",
        align: "center"
      },
      html: "# You're All Set!\n\nDelete these tutorial slides and create your own\n\n*Go to **/admin/dashboard** to begin*",
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
