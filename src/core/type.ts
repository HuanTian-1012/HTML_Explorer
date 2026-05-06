import type { ReactNode } from "react";

/** config.json 的原始格式 */
export interface PathConfig {
  /** 路由名称 */
  name: string;
  /** 路由路径 */
  path: string;
}

/** 读取 config.json 后的中间格式 */
export interface PathConfigItem {
  /** 文件路径分段数组 */
  filePath: string[];
  /** config.json 的原始配置 */
  config: PathConfig;
}

/** MDX 元素配置 */
export interface PathElementItem {
  /** 路径数组 */
  filePath: string[];
  /** 标题 */
  title: string;
  /** 渲染后元素 */
  element: ReactNode;
}

/** 路由树节点 */
export interface RouterPathConfig {
  /** 路由路径 */
  path: string;
  /** 路由名称 */
  title: string;
  /** 可选的 React 元素，由 initCore() 合并时注入 */
  element?: ReactNode;
  /** 子路由节点 */
  children: RouterPathConfig[];
  /** 内部辅助字段，合并完成后清除 */
  directoryPath?: string[];
}
