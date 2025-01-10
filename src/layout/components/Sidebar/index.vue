<template>
  <!-- 侧边栏容器，根据是否显示Logo添加 'has-logo' 类 -->
  <div :class="{ 'has-logo': showLogo }" class="sidebar-container">
    <!-- Logo组件，在showLogo为true时渲染，并传递isCollapse属性控制其折叠状态 -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 使用Element Plus的滚动条组件包裹菜单内容，确保内容可滚动 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- Element Plus的菜单组件，配置了多种样式和行为属性 -->
      <!-- 默认激活菜单项，基于路由或meta信息:default-active="activeMenu" -->
      <!-- 控制菜单是否折叠:collapse="isCollapse" -->
      <!-- 动态绑定菜单背景颜色:background-color="getMenuBackground" -->
      <!-- 动态绑定菜单文字颜色:text-color="getMenuTextColor" -->
      <!-- 只保持一个子菜单展开:unique-opened="true" -->
      <!-- 激活菜单项的文字颜色:active-text-color="theme" -->
      <!-- 禁用折叠动画:collapse-transition="false" -->
      <!-- 设置菜单为垂直模式mode="vertical" -->
      <!-- 根据当前主题应用额外的CSS类:class="sideTheme" -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="getMenuBackground"
        :text-color="getMenuTextColor"
        :unique-opened="true"
        :active-text-color="getMenuActiveTextColor"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
// 引入必要的组件和模块
import Logo from "./Logo"; // Logo组件
import SidebarItem from "./SidebarItem"; // 菜单项组件
import variables from "@/assets/styles/variables.module.scss"; // 样式变量模块

// 引入状态管理仓库
import useAppStore from "@/store/modules/app"; // 应用状态管理
import useSettingsStore from "@/store/modules/settings"; // 设置状态管理
import usePermissionStore from "@/store/modules/permission"; // 权限状态管理
import router, { constantRoutes, dynamicRoutes } from "@/router";

// 获取当前路由信息
const route = useRoute();

// 初始化状态管理仓库实例
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();

// 计算属性：获取侧边栏路由列表
// const sidebarRouters = computed(() => permissionStore.sidebarRouters);
const sidebarRouters = constantRoutes;
console.log("sidebarRouters:", sidebarRouters);
// console.log("sidebarRouters1:", sidebarRouters1);

// 计算属性：判断是否显示Logo
const showLogo = computed(() => settingsStore.sidebarLogo);

// 计算属性：获取当前侧边栏的主题
const sideTheme = computed(() => settingsStore.sideTheme);

// 计算属性：获取当前主题色（用于激活菜单项的颜色）
const theme = computed(() => settingsStore.theme);

// 计算属性：判断侧边栏是否折叠
const isCollapse = computed(() => !appStore.sidebar.opened);

// 计算属性：动态计算菜单背景颜色
const getMenuBackground = computed(() => {
  console.log("主题模式：", sideTheme.value);
  console.log("isDark:", settingsStore.isDark);
  if (settingsStore.isDark) {
    // 如果是暗黑模式
    return "#14a2e0"; // 使用默认侧边栏背景色
  }
  // 否则根据侧边栏主题选择背景色
  return sideTheme.value === "theme-dark"
    ? variables.menuBg
    : variables.menuLightBg;
});
const getMenuActiveTextColor = computed(() => {
  if (settingsStore.isDark) {
    // 如果是暗黑模式
    return "#14a2e0"; // 使用默认侧边栏背景色
  }
  // 否则根据侧边栏主题选择背景色
  return sideTheme.value === "theme-dark" ? "#14a2e0" : variables.menuLightBg;
});

// 计算属性：动态计算菜单文字颜色
const getMenuTextColor = computed(() => {
  if (settingsStore.isDark) {
    // 如果是暗黑模式
    return "var(--sidebar-text)"; // 使用默认侧边栏文字色
  }
  // 否则根据侧边栏主题选择文字色
  return sideTheme.value === "theme-dark"
    ? variables.menuText
    : variables.menuLightText;
});

// 计算属性：确定当前激活的菜单项
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu; // 如果有指定的活跃菜单，则使用它
  }
  return path; // 否则使用当前路径作为活跃菜单
});
</script>

<style lang="scss" scoped>
/* 样式部分 */
.sidebar-container {
  background-color: v-bind(getMenuBackground); /* 绑定菜单背景颜色 */

  .scrollbar-wrapper {
    background-color: v-bind(
      getMenuBackground
    ); /* 滚动条内部容器背景颜色与菜单一致 */
  }

  .el-menu {
    border: none; /* 移除默认边框 */
    height: 100%;
    width: 100% !important; /* 确保菜单占满整个侧边栏 */

    .el-menu-item,
    .el-sub-menu__title {
      &:hover {
        background-color: var(
          --menu-hover,
          rgba(0, 0, 0, 0.06)
        ) !important; /* 鼠标悬停时的背景颜色 */
      }
    }

    .el-menu-item {
      color: v-bind(getMenuTextColor); /* 动态绑定菜单项文字颜色 */

      &.is-active {
        color: var(--menu-active-text, #409eff); /* 激活菜单项的文字颜色 */
        background-color: var(
          --menu-hover,
          rgba(0, 0, 0, 0.06)
        ) !important; /* 激活菜单项的背景颜色 */
      }
    }

    .el-sub-menu__title {
      // 注意：这里直接设置了白色，如果需要根据主题变化，请使用v-bind或计算属性
      color: white; /* 子菜单标题文字颜色 */
    }
  }
}
</style>
