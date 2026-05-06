import { evaluate } from "@mdx-js/mdx";
import remarkDirective from "remark-directive";
import * as runtime from "react/jsx-runtime";
import remarkDirectiveNote from "../utils/remark-directive-note";
import { createElement } from "react";
import CodeEditor from "../components/CodeEditor";
import type { PathElementItem } from "./type";


/** 
 * 组件渲染
 * @description 读取public目录下的mdx文件，进行MDX解析，生成React组件
 */
export default async function initElement() {
    // 使用Vite的glob功能读取public目录下的所有mdx文件
    const publicElementList = import.meta.glob("/public/**/*.mdx");

    // 读取每个mdx文件的内容，进行MDX解析，生成React组件，并将其与文件路径和标题一起存储在一个数组中
    const handelElementList: PathElementItem[] = await Promise.all(
        Object.entries(publicElementList).map(async ([path]) => {
            // 去掉/public前缀，获取实际的文件路径
            const publicPath = path.replace(/^\/public/, "");
            // fetch读取mdx文件
            const response = await fetch(publicPath);
            // 获取文件内容
            const text = await response.text();
            // MDX解析，生成React组件
            const result = await evaluate(text, {
                ...runtime,
                remarkPlugins: [remarkDirective, remarkDirectiveNote],
            });

            // 返回文件路径、组件和标题
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

    // 根据文件路径长度进行排序，确保父级路径在子级路径之前
    const sortElementList = handelElementList.sort((a, b) => {
        return a.filePath.length - b.filePath.length;
    });
    
    return sortElementList
}