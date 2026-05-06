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


/** Remark自定义渲染 */
export default function remarkDirectiveNote() {
  // Tree:Markdown转换为树结构
  return (tree: VisitTree) => {
    // 递归遍历整个树
    visit(tree, (node) => {
      const directiveNode = node as DirectiveNode;

      console.log(directiveNode);
      // 排除多行容器
      if (directiveNode.type !== "containerDirective") return;


      // 自定义Code处理
      if (directiveNode.name === "code") {
        // 创建data属性存放渲染节点
        const data = directiveNode.data || (directiveNode.data = {});
        // 决定渲染组件
        data.hName = "CodeEditor";
        // 决定传参
        data.hProperties = {
          html: directiveNode.attributes?.html || "",
          css: directiveNode.attributes?.css || "",
          js: directiveNode.attributes?.js || "",
        };
      }
    });
  };
}
