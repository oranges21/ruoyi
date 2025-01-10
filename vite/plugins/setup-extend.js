import setupExtend from "unplugin-vue-setup-extend-plus/vite"; // 从 unplugin-vue-setup-extend-plus 包中导入 Vite 插件

/**
 * 创建并返回一个配置好的 Vue Setup Extend 插件实例。
 *
 * @returns {Object} - 配置好的插件实例。
 */
export default function createSetupExtend() {
  return setupExtend({}); // 调用 setupExtend 函数，并传入一个空对象作为配置项，创建插件实例
}
