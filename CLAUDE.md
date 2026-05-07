# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 用户画像

**用户是 React 初学者**，这是学习完 React 之后的第一个练习项目。需要大量引导和解释，回答时请注意：

- 解释 "为什么" 而不只是 "怎么做"
- 涉及 React 概念时，用简单易懂的方式说明
- 提供方案时，说明每个步骤的作用和原理
- 避免一次给出过多复杂内容，按模块逐步推进
- 除非用户明确需要,否则不能更改任何代码
- 每轮对话结束,在doc\00.行动记录.md插入上次行动结果和本次行动目标

## 项目概述

**项目名称**：HTML Explorer
**项目定位**：面向 HTML 零基础新人的中文交互式教学文档网站
**技术栈**：React 19 + TypeScript + Vite 8 + Ant Design 6 + React Router 7

### 核心功能（规划中）

1. **文档区** — 系统讲解 HTML 基础元素，文档类网站风格
2. **内嵌演示区** — 穿插在文档中的可运行代码示例
3. **交互实验区** — 代码编辑器 + 实时预览，类似简易版 CodePen

### 差异化

「学 → 看 → 练」闭环：文档学习 + 实例演示 + 动手实践整合在同一页面内。

## 约束

1. **除非用户明确要求，否则不得修改任何代码**，仅做分析、建议和引导
2. 不考虑移动端适配
3. 纯前端项目，无后端
4. 先出一版基础版本

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # TypeScript 检查 + Vite 生产构建
npm run lint      # ESLint 检查
npm run preview   # 预览生产构建
```

## 架构：文件系统路由

项目的核心机制是**基于 `public/doc/` 目录结构自动生成路由**。不需要手动注册路由，只需在对应目录放置 `config.json` 和 `.mdx` 文件。

### 数据流

```
public/doc/ 目录结构
        ↓
initPath()  ──扫描 config.json──→  目录树（路径 + 层级关系）
initElement() ──扫描 .mdx──→     MDX React 元素
        ↓
initCore() ──mergeElementToChildren()──→  最终路由树 RouterPathConfig[]
        ↓
router/index.tsx  ──createBrowserRouter──→  React Router 路由
```

### 三个阶段详解

**`initPath()`** — 读取所有 `config.json`，构建目录树。`config.json` 定义路由的 `name` 和 `path`。`clean()` 中的 `joinRoutePath()` 负责父子路径拼接（会去掉子路径的前导 `/`）。

**`initElement()`** — 使用 `import.meta.glob` 读取所有 `.mdx` 文件，通过 `@mdx-js/mdx` 的 `evaluate()` 动态解析为 React 元素。注入了 `CodeEditor` 组件供 MDX 中使用。

**`initCore()`** — 将上述两步结果合并。通过 `directoryPath` 字段匹配，将 MDX 元素挂载到对应的目录节点下。最后用 `stripDirectoryPath()` 清除内部辅助字段。

### 目录约定

- `config.json` 定义目录节点（路由分组，无页面内容），必须包含 `name` 和 `path`
- `.mdx` 文件定义叶子页面（有实际渲染内容），`path` 由 `buildElementRoutePath()` 自动生成
- 目录层级通过文件夹嵌套体现，`filePath` 从路径中提取（去掉 `/public/doc/` 前缀和文件名）

### 路由与菜单的关系

- `routerConfig` 同时作为 React Router 的 `children` 和左侧菜单的数据源
- 菜单 key 直接取自 `RouterPathConfig.path`，与路由路径一致
- 路径包含中文时需注意 URL 编码：`location.pathname` 返回编码后的值，需 `decodeURIComponent()` 后才能与菜单 key 匹配

### MDX 配置（vite.config.ts）

- `remark-directive` + 自定义 `remarkDirectiveNote`：支持 `:::note` 等指令语法
- `rehype-pretty-code`：代码块语法高亮，主题 `one-dark-pro`

## 项目结构概览

```
src/
├── core/           # 文件系统路由核心逻辑（init.ts → initPath.ts + initElement.ts）
├── layout/         # 布局组件（header + left菜单 + right + Outlet内容区）
├── router/         # React Router 入口，调用 initCore() 生成路由
├── pages/          # 页面组件（如首页）
├── components/     # 公共组件（CodeEditor）
├── utils/          # 工具函数（remark 插件等）
└── style/          # 全局样式
```

## TypeScript 配置

- 使用项目引用模式：`tsconfig.json` → `tsconfig.app.json`（src）+ `tsconfig.node.json`（vite.config.ts）
- `verbatimModuleSyntax`：类型导入必须使用 `import type`
- `strict: true` + `noUnusedLocals` + `noUnusedParameters`
