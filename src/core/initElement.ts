import { evaluate } from "@mdx-js/mdx";
import remarkDirective from "remark-directive";
import * as runtime from "react/jsx-runtime";
import remarkDirectiveNote from "../utils/remark-directive-note";
import { createElement } from "react";
import CodeEditor from "../components/CodeEditor";

/** 配置文件处理格式 */
export interface PathElementItem {
    filePath: string[]; // 文件路径分段数组，例如 ["src", "views", "Index.tsx"]
    title: string;
    element: React.ReactNode;
}

export default async function initElement() {
    const publicElementList = import.meta.glob("/public/**/*.mdx");
    const handelElementList: PathElementItem[] = await Promise.all(
        Object.entries(publicElementList).map(async ([path]) => {
            const publicPath = path.replace(/^\/public/, "");
            const response = await fetch(publicPath);
            const text = await response.text();
            const result = await evaluate(text, {
                ...runtime,
                remarkPlugins: [remarkDirective, remarkDirectiveNote],
            });
            return {
                filePath: path.split("/").slice(3).slice(0, -1),
                element: createElement(result.default, {
                    components: {
                        CodeEditor,
                    },
                }),
                title: path.split("/").at(-1)!.split(".")![0],
            };
        }),
    );
    const sortElementList = handelElementList.sort((a, b) => {
        return a.filePath.length - b.filePath.length;
    });
    return sortElementList
}