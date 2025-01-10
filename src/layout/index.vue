<template>
  <!-- 根元素，带有动态类名和样式绑定 -->
  <div
    :class="classObj"
    class="app-wrapper"
    :style="{ '--current-color': theme }"
    id="app-wrapper"
  >
    <!-- 移动设备上显示遮罩层，当点击时关闭侧边栏 -->
    <!-- 如果为true则会有一个遮罩层且无法扩张侧边栏 -->
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 侧边栏容器，如果设置了隐藏则不渲染 -->
    <!-- 设置为false则不渲染侧边栏，只有空白位置占着空间并且可以收缩 -->
    <sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <!-- 主内容区域，根据是否需要标签视图和侧边栏是否隐藏添加相应类名 -->
    <div
      :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }"
      class="main-container"
    >
      <!-- 固定头部，包含导航栏和标签视图（如果有） -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar @setLayout="setLayout" />
        <!-- <tags-view v-if="needTagsView" /> -->
      </div>
      <!-- 应用主内容区域 -->
      <app-main />
      <!-- 设置面板 -->
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
// 导入响应式窗口尺寸钩子函数
import { useWindowSize } from "@vueuse/core";
// 导入组件
import Sidebar from "./components/Sidebar/index.vue";
import { AppMain, Navbar, Settings, TagsView } from "./components";
// 导入默认设置
import defaultSettings from "@/settings";

// 获取 Pinia store 的模块实例
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";

// 创建对 settings store 的引用
const settingsStore = useSettingsStore();
// 使用计算属性来获取主题颜色和其他设置项
const theme = computed(() => settingsStore.theme);
console.log("theme:", theme);
const sideTheme = computed(() => settingsStore.sideTheme);
// 从 app store 获取侧边栏状态和设备类型
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
// 从 settings store 获取其他界面配置选项
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);

// 计算根元素的类名
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === "mobile",
}));
console.log("classObj:", classObj);
// 监听窗口尺寸变化
const { width, height } = useWindowSize();
const WIDTH = 992; // Bootstrap 响应式设计断点

// 当设备类型改变时，如果是移动设备且侧边栏打开，则关闭侧边栏
watch(
  () => device.value,
  () => {
    if (device.value === "mobile" && sidebar.value.opened) {
      useAppStore().closeSideBar({ withoutAnimation: false });
    }
  }
);

// 监听窗口宽度变化，以确定是移动还是桌面模式
watchEffect(() => {
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice("mobile");
    useAppStore().closeSideBar({ withoutAnimation: true });
  } else {
    useAppStore().toggleDevice("desktop");
  }
});

// 点击遮罩层时关闭侧边栏
function handleClickOutside() {
  useAppStore().closeSideBar({ withoutAnimation: false });
}

// 设置面板引用
const settingRef = ref(null);
// 打开设置面板的方法
function setLayout() {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {
  // 清除浮动，确保父元素能够正确包裹子元素
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  // 如果是在移动设备上并且侧边栏已打开，则将根元素定位为固定
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

// 遮罩层样式，用于覆盖页面并允许点击事件传递到下方元素
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

// 固定头部样式，当启用时会固定在页面顶部
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

// 如果侧边栏被隐藏，调整固定头部的宽度
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

// 如果侧边栏被隐藏，使固定头部宽度为100%
.sidebarHide .fixed-header {
  width: 100%;
}

// 在移动设备上，固定头部宽度总是100%
.mobile .fixed-header {
  width: 100%;
}
#app-wrapper {
  background-color: var(--menu-active-text, #f4f7ff);
}
</style>
