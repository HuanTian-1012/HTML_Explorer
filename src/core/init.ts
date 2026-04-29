import type { ReactNode } from "react";

interface PathConfig {
  path: string;
  title: string;
  element?: ReactNode;
  children: PathConfig[];
}

interface JsonConfig {
  name: string;
  path: string;
}

interface PathConfigItem {
  filePath: string[];
  config: JsonConfig;
}

interface InternalPathNode {
  _key: string;
  path: string;
  title: string;
  children: InternalPathNode[];
}

interface InitCoreResult {
  pathConfig: PathConfig[];
  router: ReturnType<typeof initRouter>;
}

/** 初始化配置文件 */
async function initPath(): Promise<PathConfig[]> {
  /** ====================  Step1:获取文件列表  ==================== */
  const publicConfigList = import.meta.glob("/public/**/*.json");
  console.log(publicConfigList);

  /** ====================  Step2:读取列表配置  ==================== */
  const handelConfigList: PathConfigItem[] = await Promise.all(
    Object.entries(publicConfigList).map(async ([path, config]) => {
      const res = (await config()) as JsonConfig;

      return {
        filePath: path.split("/").slice(3).slice(0, -1),
        config: {
          name: res.name,
          path: res.path,
        },
      };
    }),
  );

  /** ====================  Step3:排序配置列表  ==================== */
  // 根据文件路径长度进行排序，确保父级路径在子级路径之前
  const sortedConfigList = handelConfigList.sort((a, b) => {
    return a.filePath.length - b.filePath.length;
  });

  /** ====================  Step4:生成路由配置  ==================== */
  return buildTree(sortedConfigList);
}
/** 初始化路由 */
function initRouter(): null {
  return null;
}

/** 默认导出 */
export default async function initCore(): Promise<InitCoreResult> {
  const a = await initPath();
  console.log(a);
  const b = initRouter();
  return a
}


// 辅助函数：构建路径树形结构
function buildTree(pathConfig: PathConfigItem[]): PathConfig[] {
  // 使用一个临时对象来构建树形结构，最后再转换成需要的格式
  const root: InternalPathNode[] = [];

  // 遍历每个路径配置项，根据文件路径构建树形结构
  for (const item of pathConfig) {
    // 获取文件路径和配置项
    const { filePath, config } = item;
    
    // 从根节点开始构建树形结构
    let currentLevel: InternalPathNode[] = root;

    // 根据文件路径的每个部分逐层构建树形结构
    filePath.forEach((segment, index) => {
      let node = currentLevel.find((n) => n._key === segment);

      if (!node) {
        node = {
          _key: segment, // 内部标识
          path: index === filePath.length - 1 ? config.path : "",
          title: index === filePath.length - 1 ? config.name : segment,
          children: []
        };
        currentLevel.push(node);
      }

      // 如果是最后一层，补充真实数据
      if (index === filePath.length - 1) {
        node.path = config.path;
        node.title = config.name;
      }

      currentLevel = node.children;
    });
  }

  // 去掉内部字段
  function clean(nodes: InternalPathNode[]): PathConfig[] {
    return nodes.map((node) => ({
      path: node.path,
      title: node.title,
      children: clean(node.children),
    }));
  }

  return clean(root);
}
