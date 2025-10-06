export type SlideFrontmatter = {
  title?: string
  notes?: string
  bg?: string
  align?: "center" | "left" | "right"
  layout?: "title" | "bullets" | "image" | "content"
}

export type SlideData = {
  frontmatter: SlideFrontmatter
  html: string // sanitized HTML
}
