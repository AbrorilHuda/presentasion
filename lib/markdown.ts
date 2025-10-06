import "server-only";
import path from "node:path";
import fs from "node:fs/promises";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import type { SlideData, SlideFrontmatter } from "./types";
import { z } from "zod";
import { customDirectivePlugin } from "./handletextdrivent";

const SlidesFM = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  bg: z.string().optional(),
  align: z.enum(["center", "left", "right"]).optional(),
  layout: z.enum(["title", "bullets", "image", "content"]).optional(),
});

function allowedSchema() {
  const schema = structuredClone(defaultSchema);

  // Allow class and style minimally for alignment and width constraints
  schema.tagNames = Array.from(
    new Set([
      ...(schema.tagNames || []),
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "hr",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
    ])
  );

  schema.attributes = {
    ...schema.attributes,
    div: [...(schema.attributes?.div || []), ["className"], ["style"]],
    span: [...(schema.attributes?.span || []), ["className"], ["style"]],
    p: [...(schema.attributes?.p || []), ["className"]],
    img: [
      ...(schema.attributes?.img || []),
      ["className"],
      ["style"],
      ["width"],
      ["height"],
      ["loading"],
      ["alt"],
      ["src"],
    ],
    code: [...(schema.attributes?.code || []), ["className"]],
    pre: [...(schema.attributes?.pre || []), ["className"]],
    a: [...(schema.attributes?.a || []), ["target"], ["rel"]], // keep existing href from default
    ul: [...(schema.attributes?.ul || []), ["className"]],
    ol: [...(schema.attributes?.ol || []), ["className"]],
    li: [...(schema.attributes?.li || []), ["className"]],
    h1: [...(schema.attributes?.h1 || []), ["className"]],
    h2: [...(schema.attributes?.h2 || []), ["className"]],
    h3: [...(schema.attributes?.h3 || []), ["className"]],
    h4: [...(schema.attributes?.h4 || []), ["className"]],
    h5: [...(schema.attributes?.h5 || []), ["className"]],
    h6: [...(schema.attributes?.h6 || []), ["className"]],
    table: [...(schema.attributes?.table || []), ["className"], ["style"]],
    thead: [...(schema.attributes?.thead || []), ["className"]],
    tbody: [...(schema.attributes?.tbody || []), ["className"]],
    tr: [...(schema.attributes?.tr || []), ["className"]],
    th: [
      ...(schema.attributes?.th || []),
      ["className"],
      ["colSpan"],
      ["rowSpan"],
      ["style"],
    ],
    td: [
      ...(schema.attributes?.td || []),
      ["className"],
      ["colSpan"],
      ["rowSpan"],
      ["style"],
    ],
    blockquote: [
      ...(schema.attributes?.blockquote || []),
      ["className"],
      ["style"],
    ],
  };
  return schema;
}

export async function getSlides(): Promise<SlideData[]> {
  const dir = path.join(process.cwd(), "content", "slides");
  const files = await fs.readdir(dir);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  mdFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // 01-.., 02-..

  const processor = unified()
    .use(remarkParse)
    .use(customDirectivePlugin)
    .use(remarkRehype)
    .use(rehypeSanitize, allowedSchema())
    .use(rehypeStringify);

  const slides: SlideData[] = [];
  for (const file of mdFiles) {
    const full = path.join(dir, file);
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = matter(raw);
    // console.log("Frontmatter data content:", content);
    const fm = SlidesFM.parse(data) as SlideFrontmatter;
    const vfile = await processor.process(content);
    slides.push({
      frontmatter: fm,
      html: String(vfile),
    });
  }
  return slides;
}
