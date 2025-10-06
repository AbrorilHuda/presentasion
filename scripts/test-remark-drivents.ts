import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Parent, Text, Node } from "mdast";
import type { Plugin } from "unified";

const customDirectivePlugin: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const nodesToProcess: Array<{
      textNode: Text;
      parent: Parent;
      className: string;
    }> = [];

    // Collect semua directive dulu
    visit(
      tree,
      "text",
      (node: Text, index: number | null, parent: Parent | null) => {
        const regex = /::i\[([^\]]+)\]/;
        const match = node.value.match(regex);

        if (match && parent) {
          const className = match[1];
          nodesToProcess.push({ textNode: node, parent, className });
        }
      }
    );

    // Process dan apply className
    nodesToProcess.forEach(({ textNode, parent, className }) => {
      // Hapus directive dari text
      textNode.value = textNode.value.replace(/::i\[([^\]]+)\]/g, "").trim();

      // Cari target element (listItem jika ada, atau parent langsung)
      let target: Parent = parent;

      // Traverse tree untuk cari listItem parent
      visit(tree, (node: Node, index, nodeParent) => {
        if (node === parent && nodeParent && nodeParent.type === "listItem") {
          target = nodeParent as Parent;
        }
      });

      // Apply className
      const data = target.data || (target.data = {});
      const hProperties = data.hProperties || (data.hProperties = {});
      hProperties.className = className;

      console.log(`✅ Applied class "${className}" to ${target.type}`);
    });
  };
};

// Test
const testMarkdown = `
# Heading ::i[title-red]

- List item ::i[text-blue]
- Another item ::i[text-green]

Regular paragraph ::i[text-yellow]
`;

const processor = unified()
  .use(remarkParse)
  .use(customDirectivePlugin)
  .use(remarkRehype)
  .use(rehypeStringify);

const result = processor.processSync(testMarkdown);
console.log("\n=== OUTPUT HTML ===");
console.log(String(result));
