import initElement from "./initElement";
import initPath from "./initPath";
import type { PathElementItem, RouterPathConfig } from "./type";



/** 核心初始化：合并路径配置与 MDX 元素，生成最终路由配置 */
export default async function initCore(): Promise<RouterPathConfig[]> {
  /** ====================  Step1:获取配置与元素  ==================== */
  const pathConfig = await initPath();
  const elementConfig = await initElement();

  /** ====================  Step2:合并生成路由树  ==================== */
  // 将 MDX 元素挂载到对应目录节点下，生成完整的路由树
  const res = mergeElementToChildren(pathConfig, elementConfig);

  /** ====================  Step3:清理内部字段  ==================== */
  // 去掉内部使用的 directoryPath 字段，得到最终的路由配置
  return stripDirectoryPath(res);
}


/**
 * 数据合成：将 MDX 元素挂载到路由路径树中
 * - filePath 为空的元素追加到根级
 * - filePath 不为空的元素通过目录路径匹配，挂载到对应节点下
 */
function mergeElementToChildren(
  pathConfig: RouterPathConfig[],
  elementConfig: PathElementItem[]
): RouterPathConfig[] {
  for (const item of elementConfig) {
    // filePath 为空（如 doc/ 目录下的根级 MDX），追加到根级路由
    if (item.filePath.length === 0) {
      pathConfig.push({
        path: buildElementRoutePath("", item.title),
        title: item.title,
        element: item.element,
        children: [],
      })
      continue
    }

    // 在路由树中查找与 filePath 匹配的目录节点
    const target = findNodeByPath(pathConfig, item.filePath)

    if (!target) {
      console.warn("没有找到对应目录：", item.filePath)
      continue
    }

    // 挂载为该目录节点的子路由
    target.children.push({
      path: buildElementRoutePath(target.path, item.title),
      title: item.title,
      element: item.element,
      children: [],
    })
  }

  return pathConfig
}

// 辅助函数：根据父路径和标题生成元素的路由路径
function buildElementRoutePath(parentPath = "", title: string) {
  const currentPath = title

  // 父路径为空，直接生成根级路径
  if (!parentPath) {
    return `/${currentPath}`
  }

  // 拼接父子路径
  return `${parentPath.replace(/\/$/, "")}/${currentPath}`
}

// 辅助函数：在路由树中通过目录路径（directoryPath）查找匹配的节点（DFS 深度优先搜索）
function findNodeByPath(tree: RouterPathConfig[], filePath: string[]) {
  function dfs(nodes: RouterPathConfig[]): RouterPathConfig | null {
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

// 辅助函数：判断两个目录路径是否完全相同（长度和每一段都要匹配）
function isSameDirectoryPath(source: string[] = [], target: string[]) {
  if (source.length !== target.length) {
    return false
  }

  return source.every((segment, index) => segment === target[index])
}

// 辅助函数：递归去除路由树中所有节点的 directoryPath 内部字段
function stripDirectoryPath(tree: RouterPathConfig[]): RouterPathConfig[] {
  return tree.map(({ directoryPath, children, ...rest }) => {
    void directoryPath

    return {
      ...rest,
      children: stripDirectoryPath(children ?? []),
    }
  })
}
