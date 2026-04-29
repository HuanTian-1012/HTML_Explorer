/** 配置文件格式 */
export interface PathConfig {
    name: string; // 路由名称
    path: string; // 路由路径，例如 "/index"
}

/** 配置文件处理格式 */
export interface PathConfigItem {
    filePath: string[]; // 文件路径分段数组，例如 ["src", "views", "Index.tsx"]
    config: {
        name: string; // 路由名称
        path: string; // 路由路径，例如 "/index"
    };
}

/** 路由路径配置格式 */
export interface RouterPathConfig {
    path: string; // 路由路径
    title: string; // 路由名称
    children: RouterPathConfig[];
    directoryPath?: string[]; // 内部使用的目录链路
}

/** 路由路径临时配置格式 */
export interface RouterPathTempConfig extends RouterPathConfig {
    _key: string; // 内部标识
    children: RouterPathTempConfig[];
}

export default async function initPath() {
    /** ====================  Step1:获取文件列表  ==================== */
    const publicConfigList = import.meta.glob("/public/**/*.json");

    /** ====================  Step2:读取列表配置  ==================== */
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

    /** ====================  Step3:排序配置列表  ==================== */
    // 根据文件路径长度进行排序，确保父级路径在子级路径之前
    const sortedConfigList: PathConfigItem[] = handelConfigList.sort((a, b) => {
        return a.filePath.length - b.filePath.length;
    });

    /** ====================  Step4:生成路由配置  ==================== */
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

    function joinRoutePath(parentPath: string, currentPath: string): string {
        if (!currentPath) {
            return parentPath;
        }

        if (!parentPath) {
            return currentPath;
        }

        return `${parentPath.replace(/\/$/, "")}/${currentPath.replace(/^\//, "")}`;
    }

    // 去掉内部字段
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
