import { visit } from "unist-util-visit";

type VisitTree = Parameters<typeof visit>[0];
type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string>;
  data?: {
    hName?: string;
    hProperties?: Record<string, unknown>;
  };
};

export default function remarkDirectiveNote() {
  return (tree: VisitTree) => {
    visit(tree, (node) => {
      const directiveNode = node as DirectiveNode;

      if (directiveNode.type !== "containerDirective") return;

      if (directiveNode.name === "note") {
        const data = directiveNode.data || (directiveNode.data = {});
        data.hName = "div";
        data.hProperties = {
          className: ["note"],
          title: directiveNode.attributes?.title || "",
        };
      }

      if (directiveNode.name === "code") {
        const data = directiveNode.data || (directiveNode.data = {});
        data.hName = "CodeEditor";
        data.hProperties = {
          html: directiveNode.attributes?.html || "",
          css: directiveNode.attributes?.css || "",
          js: directiveNode.attributes?.js || "",
        };
      }
    });
  };
}
