import compression from "vite-plugin-compression"; // 导入 Vite 的压缩插件

/**
 * 创建并返回一个根据环境变量配置的压缩插件数组。
 *
 * @param {Object} env - 包含构建环境变量的对象。
 * @returns {Array} - 一个包含压缩插件实例的数组。
 */
export default function createCompression(env) {
  // 从环境变量中获取是否启用压缩以及压缩类型（如 gzip, brotli）
  const { VITE_BUILD_COMPRESS } = env;

  // 初始化一个空数组用于存储要应用的压缩插件
  const plugin = [];

  // 如果启用了压缩（VITE_BUILD_COMPRESS 存在且不为空字符串）
  if (VITE_BUILD_COMPRESS) {
    // 将 VITE_BUILD_COMPRESS 环境变量按逗号分隔为一个压缩类型的列表
    const compressList = VITE_BUILD_COMPRESS.split(",");

    // 如果列表中包含 'gzip'，则添加 gzip 压缩插件
    if (compressList.includes("gzip")) {
      // 参考文档: http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      plugin.push(
        compression({
          ext: ".gz", // 指定压缩后的文件扩展名
          deleteOriginFile: false, // 是否删除原始文件，默认为 false
        })
      );
    }

    // 如果列表中包含 'brotli'，则添加 Brotli 压缩插件
    if (compressList.includes("brotli")) {
      plugin.push(
        compression({
          ext: ".br", // 指定压缩后的文件扩展名
          algorithm: "brotliCompress", // 指定使用的压缩算法
          deleteOriginFile: false, // 是否删除原始文件，默认为 false
        })
      );
    }
  }

  // 返回最终的插件数组
  return plugin;
}
