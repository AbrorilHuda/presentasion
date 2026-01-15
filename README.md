# Slide Presentation

A modern, web-based slide presentation tool built with Next.js, React, and TypeScript. Create, manage, and present beautiful slides directly in your browser with features like presenter mode, speaker notes, and real-time editing.

![Slide Presentation](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

- **📝 Admin Dashboard** - Create and edit slides with a user-friendly interface
- **🎨 Rich Content Editor** - Support for HTML, images, videos, and custom styling
- **🎭 Presenter Mode** - Dual-screen support with speaker notes, timer, and next slide preview
- **⌨️ Keyboard Navigation** - Full keyboard control for seamless presentations
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices
- **🎬 GSAP Animations** - Smooth, direction-aware slide transitions
- **🖼️ Media Gallery** - Upload and manage images and videos with one-click insertion
- **🎯 Slide Settings** - Customize alignment, background, and layout per slide
- **💾 LocalStorage** - All data stored locally in your browser
- **🌙 Theme Support** - Light and dark mode support
- **📊 Progress Tracking** - Visual progress bar with slide minimap
- **🔔 Toast Notifications** - User-friendly feedback for all actions (save, delete, upload)
- **📄 Export to PDF** - One-click export with print-optimized layout
- **🏠 Modern Home Page** - Easy navigation to all app modes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abrorilhuda/presentasion.git
cd presentasion
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Build

```bash
npm run build
npm start
# or
bun run build
bun start
```

## 📖 Usage Guide

### Home Page

Navigate to `/` to see the main dashboard with quick access to:
- **Admin Dashboard** - Login and manage slides
- **Slide Viewer** - View your presentation
- **Presenter Mode** - Present with notes and controls
- **Documentation** - GitHub repository

### Admin Dashboard

1. **Login**: Navigate to `/admin/login` or click "Login to Admin" on home page
   - Default password: `admin123`

2. **Create Slides**:
   - Click "Add Slide" button
   - Edit slide content in the **Content** tab
   - Upload media in the **Media** tab
   - Configure settings in the **Settings** tab
   - Click "Save Changes" (you'll see a success toast notification!)

3. **Edit Slides**:
   - Select a slide from the list
   - Modify title, content, notes, alignment, and background
   - Click "Save Changes" to persist
   - Toast notification confirms successful save

4. **Media Management**:
   - Upload images and videos (supports PNG, JPG, GIF, MP4, WebM)
   - Click on media to insert into slide content
   - Automatically switches to Content tab after insertion
   - Delete unused media files
   - Toast notifications for upload success/failure

5. **Slide Settings**:
   - **Layout**: Title, Content, Bullets, or Image
   - **Alignment**: Left, Center, or Right
   - **Background Color**: Any CSS color value (hex, rgb, named colors)
   - **Speaker Notes**: Private notes for presenter mode

6. **Export to PDF**:
   - Click "Export PDF" button in dashboard header
   - Opens print-optimized view in new tab
   - Follow on-screen instructions to save as PDF
   - Landscape orientation with proper page breaks

### Slide Viewer (`/s/[index]`)

- Navigate through slides using arrow keys or on-screen controls
- URL updates automatically (e.g., `/s/1`, `/s/2`)
- Use browser back/forward buttons to navigate
- Toggle theme with the theme button

### Presenter Mode (`/presenter`)

Perfect for dual-screen presentations:

**Features:**
- **Current Slide**: Full view of active slide
- **Next Slide Preview**: See what's coming next
- **Speaker Notes**: Private notes for each slide
- **Timer**: Track presentation time
- **Slide Counter**: Current/Total slides

**Keyboard Shortcuts:**
- `Arrow Right` or `Space` - Next slide
- `Arrow Left` - Previous slide
- `T` - Start/Stop timer
- `N` - Toggle notes visibility

**Setup:**
1. Open `/presenter` on your laptop
2. Open `/s/1` on projector/external display
3. Navigate using keyboard shortcuts
4. Audience sees clean slides, you see notes and controls

## ⌨️ Keyboard Shortcuts

### Slide Viewer
- `Arrow Right` / `Space` - Next slide
- `Arrow Left` - Previous slide
- `Home` - First slide
- `End` - Last slide

### Presenter Mode
- `Arrow Right` / `Space` - Next slide
- `Arrow Left` - Previous slide
- `T` - Toggle timer (Start/Stop)
- `N` - Toggle speaker notes
- `R` - Reset timer (when stopped)

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Storage**: Browser LocalStorage

## 📁 Project Structure

```
slide-deck/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard
│   │   ├── dashboard/       # Slide management
│   │   └── login/           # Authentication
│   ├── presenter/           # Presenter mode
│   ├── s/[index]/          # Slide viewer (dynamic route)
│   ├── layout.tsx          # Root layout with metadata
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   │   ├── slide-editor.tsx
│   │   ├── slides-list.tsx
│   │   └── media-manager.tsx
│   ├── ui/                 # shadcn/ui components
│   ├── slide-renderer.tsx  # Main slide display
│   ├── controls.tsx        # Navigation controls
│   ├── progress.tsx        # Progress bar
│   └── deck-provider.tsx   # Slide state management
├── hooks/                   # Custom React hooks
│   ├── use-deck.ts         # Deck navigation
│   ├── use-keyboard-nav.ts # Keyboard shortcuts
│   └── use-gsap-enter-exit.ts # Animations
├── lib/                     # Utility libraries
│   ├── slide-storage.ts    # LocalStorage management
│   └── types.ts            # TypeScript types
├── styles/                  # Global styles
└── public/                  # Static assets
```

## 🎨 Customization

### Changing Admin Password

Edit `lib/slide-storage.ts`:
```typescript
const ADMIN_PASSWORD = "your-new-password";
```

### Styling

- Global styles: `styles/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Inline with Tailwind classes

### Adding Custom Layouts

Modify `components/slide-renderer.tsx` to add new layout types.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**abrordc** [AbrorIl huda](https://abrorilhuda.me)
- GitHub: [@abrorilhuda](https://github.com/abrorilhuda)
- Twitter: [@abror_dc](https://twitter.com/abror_dc)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [GSAP](https://greensock.com/)
- Icons by [Lucide](https://lucide.dev/)

---

Made with ❤️ by [abrordc](https://github.com/abrorilhuda)
