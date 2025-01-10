import { createSvgIconsPlugin } from "vite-plugin-svg-icons"; // 导入 Vite 插件用于处理 SVG 图标
import path from "path"; // 导入 Node.js 的 path 模块，用于处理和转换文件路径

// 创建并返回一个配置好的 SVG 图标插件实例
export default function createSvgIcon(isBuild) {
  return createSvgIconsPlugin({
    // 配置项：指定包含 SVG 图标的目录
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
    // 配置项：定义 <symbol> 标签的 ID 格式。[dir] 和 [name] 是占位符，分别代表图标所在的文件夹名和文件名（不包括扩展名）。
    symbolId: "icon-[dir]-[name]",
    // 配置项：如果 isBuild 为 true，则启用 svgoOptions 来优化 SVG 文件；否则，不启用。
    svgoOptions: isBuild
      ? {
          plugins: [
            { removeTitle: true }, // 移除 <title> 标签以减少文件大小
            { convertColors: { shorthex: false } }, // 禁用颜色的简短十六进制格式转换
            { convertPathData: false }, // 禁用路径数据转换
          ],
        }
      : false,
  });
}
