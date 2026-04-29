import type { ReactNode } from "react";

import initElement from "./initElement";
import initPath, { type RouterPathConfig } from "./initPath";

type RouteNode = {
  path: string
  title: string
  element?: ReactNode
  children: RouteNode[]
  directoryPath?: string[]
};

type ElementConfig = {
  filePath: string[]
  title: string
  element: ReactNode
};


/** 默认导出 */
export default async function initCore(): Promise<RouteNode[]> {
  const pathConfig = await initPath();
  const elementConfig = await initElement();
  console.log("pathConfig", pathConfig);
  console.log("elementConfig", elementConfig);
  const res = mergeElementToChildren(pathConfig, elementConfig);
  console.log(res);
  return stripDirectoryPath(res);
}


/** 数据合成 */
function mergeElementToChildren(
  pathConfig: RouterPathConfig[],
  elementConfig: ElementConfig[]
): RouteNode[] {
  const routeTree: RouteNode[] = pathConfig as RouteNode[];

  for (const item of elementConfig) {
    // filePath 为空，追加到根级
    if (item.filePath.length === 0) {
      routeTree.push({
        path: buildElementRoutePath("", item.title),
        title: item.title,
        element: item.element,
        children: [],
      })
      continue
    }

    const target = findNodeByPath(routeTree, item.filePath)

    if (!target) {
      console.warn("没有找到对应目录：", item.filePath)
      continue
    }

    target.children.push({
      path: buildElementRoutePath(target.path, item.title),
      title: item.title,
      element: item.element,
      children: [],
    })
  }

  return routeTree
}

function buildElementRoutePath(parentPath = "", title: string) {
  const currentPath = title

  if (!parentPath) {
    return `/${currentPath}`
  }

  return `${parentPath.replace(/\/$/, "")}/${currentPath}`
}

function findNodeByPath(tree: RouteNode[], filePath: string[]) {
  function dfs(nodes: RouteNode[]): RouteNode | null {
    for (const node of nodes) {
      if (isSameDirectoryPath(node.directoryPath, filePath)) {
        return node
      }

      const found = dfs(node.children ?? [])

      if (found) {
        return found
      }
    }

    return null
  }

  return dfs(tree)
}

function isSameDirectoryPath(source: string[] = [], target: string[]) {
  if (source.length !== target.length) {
    return false
  }

  return source.every((segment, index) => segment === target[index])
}

function stripDirectoryPath(tree: RouteNode[]): RouteNode[] {
  return tree.map(({ directoryPath, children, ...rest }) => {
    void directoryPath

    return {
      ...rest,
      children: stripDirectoryPath(children ?? []),
    }
  })
}
