import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
/** 引入MDX 插件 */
import mdx from "@mdx-js/rollup";
/** 引入自定义MD语法依赖 */
import remarkDirective from "remark-directive";
/** 自定义MD语法处理函数 */
import remarkDirectiveNote from "./src/utils/remark-directive-note";
/** 代码块美化 */
// import rehypePrettyCode from "rehype-pretty-code";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mdx({
      remarkPlugins: [remarkDirective, remarkDirectiveNote],
      // rehypePlugins: [
      //   [
      //     rehypePrettyCode,
      //     {
      //       theme: "one-dark-pro",
      //     },
      //   ],
      // ],
    }),
  ],
});
