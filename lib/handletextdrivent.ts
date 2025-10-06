import { visit } from "unist-util-visit";
import type { Root, Parent, Node } from "mdast";
import type { Plugin } from "unified";

// Type untuk text directive node
interface TextDirectiveNode extends Node {
  type: "textDirective";
  name: string;
  attributes?: Record<string, string>;
  children: Array<{ type: string; value: string }>;
}

// Plugin function dengan type
export const handleTextDirectives: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const nodesToRemove: Array<{ parent: Parent; index: number }> = [];

    visit(tree, (node: Node, index: number | null, parent: Parent | null) => {
      if (
        node.type === "textDirective" &&
        (node as TextDirectiveNode).name === "i"
      ) {
        const directiveNode = node as TextDirectiveNode;
        const className = directiveNode.children[0]?.value || "";

        if (parent && index !== null) {
          const data = parent.data || (parent.data = {});
          const hProperties = data.hProperties || (data.hProperties = {});

          // Tambahkan className ke parent
          hProperties.className = className;

          // Tandai untuk dihapus
          nodesToRemove.push({ parent, index });
        }
      }
    });

    // Hapus dari belakang agar index tidak berubah
    nodesToRemove.reverse().forEach(({ parent, index }) => {
      parent.children.splice(index, 1);
    });
  };
};

export const debugTree: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      console.log("Node type:", node.type, node);
    });
  };
};

export const customDirectivePlugin: Plugin<[], Root> = () => {
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
