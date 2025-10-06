import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Parent, Text, Node } from "mdast";
import type { Plugin } from "unified";

const customDirectivePlugin: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const parentMap = new Map<Node, Parent>();

    visit(tree, (node: Node, index, parent) => {
      if (parent) {
        parentMap.set(node, parent);
      }
    });

    visit(tree, "text", (node: Text) => {
      const regex = /::i\[([^\]]+)\]/;
      const match = node.value.match(regex);

      if (match) {
        const className = match[1];
        node.value = node.value.replace(regex, "").trim();

        let current = parentMap.get(node);
        let target = current;

        if (current?.type === "paragraph") {
          const grandParent = parentMap.get(current);
          if (grandParent?.type === "listItem") {
            target = grandParent;
          }
        }

        if (target) {
          // Pastikan struktur data benar
          if (!target.data) target.data = {};
          if (!target.data.hProperties) target.data.hProperties = {};

          target.data.hProperties.className = className;

          //   console.log(`✅ Applied class "${className}" to ${target.type}`);
          //   console.log(`   Data:`, JSON.stringify(target.data, null, 2));
        }
      }
    });
  };
};

const testMarkdown = `
- => Definisi & Konsep ::i[text-red]
- => Mengapa Tren ini Penting
`;

const processor = unified()
  .use(remarkParse)
  .use(customDirectivePlugin)
  .use(remarkRehype, {
    allowDangerousHtml: true, // Pastikan hProperties di-pass
  })
  .use(rehypeStringify, {
    allowDangerousHtml: true,
  });

const result = processor.processSync(testMarkdown);
console.log("\n=== OUTPUT HTML ===");
console.log(String(result));
