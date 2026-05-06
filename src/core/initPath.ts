import type { PathConfigItem, PathConfig, RouterPathConfig } from "./type";

/** 构建树过程中的临时类型，仅内部使用 */
interface RouterPathTempConfig extends RouterPathConfig {
  _key: string;
  children: RouterPathTempConfig[];
}

export default async function initPath() {
    // 使用Vite的glob功能读取public目录下的所有json文件
    const publicConfigList = import.meta.glob("/public/**/*.json");

    // 读取每个配置文件的内容，并将其转换成统一的格式，包含文件路径和配置项
    const handelConfigList: PathConfigItem[] = await Promise.all(
        Object.entries(publicConfigList).map(async ([path, config]) => {
            const res = (await config()) as PathConfig;
            return {
                filePath: path.split("/").slice(3).slice(0, -1),
                config: {
                    name: res.name,
                    path: res.path,
                },
            };
        }),
    );

    // 根据文件路径长度进行排序，确保父级路径在子级路径之前
    const sortedConfigList: PathConfigItem[] = handelConfigList.sort((a, b) => {
        return a.filePath.length - b.filePath.length;
    });

    // 调用方法,将扁平数据转换成树状结构
    return buildTree(sortedConfigList);
}

// 辅助函数：构建路径树形结构
function buildTree(pathConfig: PathConfigItem[]): RouterPathConfig[] {
    // 使用一个临时对象来构建树形结构，最后再转换成需要的格式
    const root: RouterPathTempConfig[] = [];

    // 遍历每个路径配置项，根据文件路径构建树形结构
    for (const item of pathConfig) {
        // 获取文件路径和配置项
        const { filePath, config } = item;

        // 从根节点开始构建树形结构
        let currentLevel: RouterPathTempConfig[] = root;

        // 根据文件路径的每个部分逐层构建树形结构
        filePath.forEach((segment, index) => {
            let node: RouterPathTempConfig | undefined = currentLevel.find((n) => n._key === segment);

            if (!node) {
                node = {
                    _key: segment, // 内部标识
                    path: index === filePath.length - 1 ? config.path : "",
                    title: index === filePath.length - 1 ? config.name : segment,
                    children: [],
                    directoryPath: filePath.slice(0, index + 1),
                };
                currentLevel.push(node);
            }

            // 如果是最后一层，补充真实数据
            if (index === filePath.length - 1) {
                node.path = config.path;
                node.title = config.name;
                node.directoryPath = filePath.slice(0, index + 1);
            }

            currentLevel = node.children;
        });
    }


    // 辅助函数:路径拼接
    function joinRoutePath(parentPath: string, currentPath: string): string {
        if (!currentPath) {
            return parentPath;
        }
        if (!parentPath) {
            return currentPath;
        }
        return `${parentPath.replace(/\/$/, "")}/${currentPath.replace(/^\//, "")}`;
    }

    // 辅助函数:去掉临时字段"_key"
    function clean(nodes: RouterPathTempConfig[], parentPath = ""): RouterPathConfig[] {
        return nodes.map((node) => ({
            path: joinRoutePath(parentPath, node.path),
            title: node.title,
            children: clean(node.children, joinRoutePath(parentPath, node.path)),
            directoryPath: node.directoryPath,
        }));
    }

    return clean(root);
}
