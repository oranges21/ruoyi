<template>
  <!-- 侧边栏Logo容器 -->
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <!-- Logo淡入淡出动画 -->
    <transition name="sidebarLogoFade">
      <!-- 根据侧边栏是否折叠来显示不同的内容 -->
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <!-- 如果折叠则只显示logo或标题 -->
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title">{{ title }}</h1> -->
        <h1 v-if="!logo" class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- 如果未折叠，则同时显示logo和标题 -->
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </transition>
  </div>
</template>

<script setup>
// 引入Logo图片资源
import logo from "@/assets/logo/logo.png";
// 引入设置状态管理仓库
import useSettingsStore from "@/store/modules/settings";
// 引入样式变量模块
import variables from "@/assets/styles/variables.module.scss";

// 定义组件接收的属性，这里需要一个布尔类型的collapse属性，用于判断侧边栏是否折叠
defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

// 获取应用标题，从环境变量中读取
// const title = import.meta.env.VITE_APP_TITLE;
const title = "案件智能分析系统";
// 获取设置状态管理仓库实例
const settingsStore = useSettingsStore();
// 计算属性：获取侧边栏主题
const sideTheme = computed(() => settingsStore.sideTheme);

// 计算属性：根据当前主题动态获取Logo背景颜色
const getLogoBackground = computed(() => {
  if (settingsStore.isDark) {
    return "#14a2e0"; // 暗黑模式下使用默认侧边栏背景色
  }
  // 光明模式下根据侧边栏主题选择背景色
  return sideTheme.value === "theme-dark"
    ? variables.menuBg
    : variables.menuLightBg;
});

// 计算属性：根据当前主题动态获取Logo文字颜色
const getLogoTextColor = computed(() => {
  if (settingsStore.isDark) {
    return "var(--sidebar-text)"; // 暗黑模式下使用默认侧边栏文字色
  }
  // 光明模式下根据侧边栏主题选择文字色
  return sideTheme.value === "theme-dark" ? "#fff" : variables.menuLightText;
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.module.scss"; // 导入全局样式变量

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s; // 设置Logo淡入淡出过渡效果
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0; // 初始和离开时透明度为0
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: v-bind(getLogoBackground); // 动态绑定背景颜色
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px; // 当不是折叠状态时，给logo右侧留出间距
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: v-bind(getLogoTextColor); // 动态绑定文字颜色
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px; // 折叠状态下移除logo右侧的间距
    }
  }
}
</style>
