// 导入默认的应用设置配置
import defaultSettings from "@/settings";
// 导入 VueUse 提供的响应式暗黑模式切换工具
import { useDark, useToggle } from "@vueuse/core";
// 导入动态网页标题更新工具函数
import { useDynamicTitle } from "@/utils/dynamicTitle";

// 创建一个响应式的布尔值来追踪当前是否为暗黑模式
const isDark = useDark();
// 创建一个函数来切换暗黑模式状态
const toggleDark = useToggle(isDark);

// 从默认设置中解构出与布局相关的属性
const {
  sideTheme,
  showSettings,
  topNav,
  tagsView,
  fixedHeader,
  sidebarLogo,
  dynamicTitle,
} = defaultSettings;

// 尝试从 localStorage 中获取之前保存的布局设置，如果不存在则返回空字符串
const storageSetting = JSON.parse(localStorage.getItem("layout-setting")) || "";

// 使用 Pinia 的 defineStore 方法创建一个名为 'settings' 的 store
const useSettingsStore = defineStore(
  "settings", // Store 的唯一标识符
  {
    // 定义初始状态（state）
    state: () => ({
      title: "", // 网页标题，默认为空
      theme: storageSetting.theme || "#409EFF", // 主题颜色，默认为'#409EFF'，如果有存储则使用存储的颜色
      sideTheme: storageSetting.sideTheme || sideTheme, // 侧边栏主题，默认为defaultSettings中的sideTheme
      showSettings: showSettings, // 是否显示设置面板，默认为defaultSettings中的showSettings
      topNav:
        storageSetting.topNav === undefined ? topNav : storageSetting.topNav, // 是否顶部导航，默认为defaultSettings中的topNav，如果有存储则使用存储的值
      tagsView:
        storageSetting.tagsView === undefined
          ? tagsView
          : storageSetting.tagsView, // 是否启用标签视图，默认为defaultSettings中的tagsView，如果有存储则使用存储的值
      fixedHeader:
        storageSetting.fixedHeader === undefined
          ? fixedHeader
          : storageSetting.fixedHeader, // 是否固定头部，默认为defaultSettings中的fixedHeader，如果有存储则使用存储的值
      sidebarLogo:
        storageSetting.sidebarLogo === undefined
          ? sidebarLogo
          : storageSetting.sidebarLogo, // 是否显示侧边栏logo，默认为defaultSettings中的sidebarLogo，如果有存储则使用存储的值
      dynamicTitle:
        storageSetting.dynamicTitle === undefined
          ? dynamicTitle
          : storageSetting.dynamicTitle, // 是否启用动态网页标题，默认为defaultSettings中的dynamicTitle，如果有存储则使用存储的值
      isDark: isDark.value, // 当前是否为暗黑模式，默认根据isDark的值
    }),

    // 定义动作（actions），用来触发状态的变化
    actions: {
      // 修改布局设置
      changeSetting(data) {
        const { key, value } = data; // 解构传入的对象，获取key和value
        if (this.hasOwnProperty(key)) {
          // 检查store中是否存在该key
          this[key] = value; // 更新store中对应的值
        }
      },

      // 设置网页标题
      setTitle(title) {
        this.title = title; // 更新store中的title属性
        useDynamicTitle(); // 调用动态网页标题更新工具函数
      },

      // 切换暗黑模式
      toggleTheme() {
        this.isDark = !this.isDark; // 反转当前的isDark状态
        toggleDark(); // 调用VueUse提供的toggleDark函数切换暗黑模式
      },
    },
  }
);

export default useSettingsStore; // 导出这个 store，以便可以在其他地方使用
