import "server-only";

import path from "node:path";

// NOTE: import fs inside functions to minimize any top-level footprint
import { unified } from "unified";
import remarkParse from "remark-parse";
// import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
// import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import matter from "gray-matter";
import type { SlideData } from "@/lib/types";

type CompiledSlide = {
  html: string;
  meta: Record<string, any>;
  notes?: string;
};

const slidesDir = "content/slides";

// Build a sanitizer schema that allows common GFM and presentation tags safely
const schema: Parameters<typeof rehypeSanitize>[0] = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "td",
    "th",
    "blockquote",
    "del",
    "ins",
    "mark",
    "kbd",
    "sup",
    "sub",
    "details",
    "summary",
  ],
  attributes: {
    ...(defaultSchema.attributes || {}),
    a: [...(defaultSchema.attributes?.a || []), ["target"], ["rel"]],
    code: [...(defaultSchema.attributes?.code || []), ["className"]],
    span: [...(defaultSchema.attributes?.span || []), ["className"]],
    th: [...(defaultSchema.attributes?.th || []), ["colspan", "rowspan"]],
    td: [...(defaultSchema.attributes?.td || []), ["colspan", "rowspan"]],
    input: [
      ...(defaultSchema.attributes?.input || []),
      ["type"],
      ["checked"],
      ["disabled"],
    ],
    details: [...(defaultSchema.attributes?.details || []), ["open"]],
  },
};

async function compileMarkdown(md: string): Promise<CompiledSlide> {
  const { content, data, excerpt } = matter(md, {
    excerpt_separator: " notes ",
  });

  const file = await unified()
    .use(remarkParse)
    // Convert to HTML, allow raw HTML through to rehype
    .use(remarkRehype, { allowDangerousHtml: true })
    // Parse any raw HTML nodes produced by remark (before sanitize)
    // Sanitize with our extended schema
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(content);

  const html = String(file);
  // gray-matter excerpt captured before the separator if present
  const notes =
    excerpt?.toString()?.trim() ||
    (typeof data.notes === "string" ? data.notes : undefined);

  return { html, meta: data || {}, notes };
}

async function listSlideFiles(): Promise<string[]> {
  const { readdir } = await import("node:fs/promises");
  const files = await readdir(slidesDir);
  return files
    .filter((f) => f.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function readSlideFile(fileName: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const full = path.join(slidesDir, fileName);
  return await readFile(full, "utf8");
}

export async function getSlides(): Promise<SlideData[]> {
  const files = await listSlideFiles();
  const compiled = await Promise.all(
    files.map(async (f) => {
      const src = await readSlideFile(f);
      const { html, meta, notes } = await compileMarkdown(src);
      const title = typeof meta.title === "string" ? meta.title : "";
      return { id: f, title, html, notes };
    })
  );
  return compiled;
}

export async function getSlideByIndex(idx: number): Promise<SlideData | null> {
  const slides = await getSlides();
  if (idx < 1 || idx > slides.length) return null;
  return slides[idx - 1];
}
