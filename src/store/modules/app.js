import Cookies from "js-cookie"; // 导入 js-cookie 库来处理浏览器中的 Cookie 操作

// 使用 Pinia 的 defineStore 方法创建一个名为 'app' 的 store
const useAppStore = defineStore(
  "app", // Store 的唯一标识符
  {
    // 定义初始状态（state）
    state: () => ({
      sidebar: {
        opened: Cookies.get("sidebarStatus")
          ? !!+Cookies.get("sidebarStatus")
          : true, // 从 Cookie 中读取侧边栏是否打开的状态，默认为true（打开）
        withoutAnimation: false, // 是否禁用动画效果，默认为false（不禁用）
        hide: false, // 侧边栏是否隐藏，默认为false（不隐藏）
      },
      device: "desktop", // 当前设备类型，默认为'desktop'（桌面端）
      size: Cookies.get("size") || "default", // 从 Cookie 中读取应用尺寸，默认为'default'
    }),

    // 定义动作（actions），用来触发状态的变化
    actions: {
      // 切换侧边栏的打开/关闭状态
      toggleSideBar(withoutAnimation) {
        if (this.sidebar.hide) {
          // 如果侧边栏被隐藏，则直接返回false，不做任何操作
          return false;
        }
        this.sidebar.opened = !this.sidebar.opened; // 反转侧边栏的打开状态
        this.sidebar.withoutAnimation = withoutAnimation; // 设置是否禁用动画

        // 根据新的打开状态更新 Cookie
        if (this.sidebar.opened) {
          Cookies.set("sidebarStatus", 1); // 如果打开，则在 Cookie 中设置为1
        } else {
          Cookies.set("sidebarStatus", 0); // 如果关闭，则在 Cookie 中设置为0
        }
      },

      // 关闭侧边栏
      closeSideBar({ withoutAnimation }) {
        Cookies.set("sidebarStatus", 0); // 在 Cookie 中设置为关闭状态
        this.sidebar.opened = false; // 设置侧边栏为关闭状态
        this.sidebar.withoutAnimation = withoutAnimation; // 设置是否禁用动画
      },

      // 切换设备类型
      toggleDevice(device) {
        this.device = device; // 更新当前设备类型
      },

      // 设置应用尺寸
      setSize(size) {
        this.size = size; // 更新应用尺寸
        Cookies.set("size", size); // 将新尺寸保存到 Cookie 中
      },

      // 切换侧边栏隐藏状态
      toggleSideBarHide(status) {
        this.sidebar.hide = status; // 更新侧边栏隐藏状态
      },
    },
  }
);

export default useAppStore; // 导出这个 store，以便可以在其他地方使用
