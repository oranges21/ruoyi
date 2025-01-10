// 导入 vue-router 的函数来创建基于 HTML5 history 模式的路由实例
import { createWebHistory, createRouter } from "vue-router";

// 导入 Layout 组件，这个组件通常用于包裹页面布局，提供统一的页面框架
import Layout from "@/layout";

/**
 * 注意：以下是一些路由配置项的解释：
 *
 * hidden: true                     // 如果设置为 true，则该路由不会出现在侧边栏中（例如 401 页面、登录页面等）。
 * alwaysShow: true                 // 当一个路由下面有多个 children 路由时，自动变成嵌套模式。如果只想显示根路由，可以设置 alwaysShow: true。
 * redirect: noRedirect             // 设置为 noRedirect 时，面包屑导航中的该路由将不可点击。
 * name:'router-name'               // 设定路由的名字，这是必要的，否则使用 <keep-alive> 时会出现问题。
 * query: '{"id": 1, "name": "ry"}' // 定义访问此路由时默认携带的查询参数。
 * roles: ['admin', 'common']       // 访问路由所需的角色权限。
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由所需的菜单权限。
 * meta : {
 *   noCache: true                  // 如果设置为 true，则该路由不会被 <keep-alive> 缓存，默认是 false。
 *   title: 'title'                 // 设置该路由在侧边栏和面包屑中展示的名字。
 *   icon: 'svg-name'               // 设置该路由的图标，对应路径 src/assets/icons/svg。
 *   breadcrumb: false              // 如果设置为 false，则该路由不会出现在面包屑导航中。
 *   activeMenu: '/system/user'     // 当设置了此属性，相对应的侧边栏项会被高亮显示。
 * }
 */

// 定义公共路由（constantRoutes），这些路由对所有用户可见或用于特定用途（如重定向、错误页面等）
export const constantRoutes = [
  // 重定向路由，允许从任意路径重定向到指定路径
  // {
  //   path: "/redirect",
  //   component: Layout,
  //   hidden: true, // 不在侧边栏显示
  //   children: [
  //     {
  //       path: "/redirect/:path(.*)", // 动态匹配任意路径
  //       component: () => import("@/views/redirect/index.vue"), // 动态导入组件
  //     },
  //   ],
  // },
  // 登录页面路由，不在侧边栏显示
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  // 注册页面路由，不在侧边栏显示
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true,
  },
  // 404 错误页面路由，匹配所有未定义的路径，不在侧边栏显示
  {
    path: "/:pathMatch(.*)*", // 匹配所有路径
    component: () => import("@/views/error/404"),
    hidden: true,
  },
  // 401 错误页面路由，不在侧边栏显示
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true,
  },
  // 首页路由，作为根路由，重定向到 /index
  {
    path: "",
    component: Layout,
    redirect: "/device-management/alldevices",
  },
  // 设备管理
  {
    path: "/device-management",
    component: Layout,
    meta: {
      title: "设备管理",
      icon: "search",
      alwaysShow: true,
    }, // 设置标题和图标
    children: [
      //所有设备
      {
        path: "alldevices",
        component: () => import("@/views/deviceManagement/allDevices/index"),
        name: "alldevices",
        meta: { title: "全部设备", icon: "user" }, // 设置标题和图标
      },
      {
        path: "devicegroups",
        component: () => import("@/views/deviceManagement/deviceGroups/index"),
        name: "devicegroups",
        meta: { title: "设备分组", icon: "user" }, // 设置标题和图标
      },
      {
        path: "devicemap",
        component: () => import("@/views/deviceManagement/deviceMap/index"),
        name: "devicemap",
        meta: { title: "设备地图", icon: "user" }, // 设置标题和图标
      },
      {
        path: "platformconfig",
        component: () =>
          import("@/views/deviceManagement/platformConfig/index"),
        name: "platformconfig",
        meta: { title: "平台配置", icon: "user" }, // 设置标题和图标
      },
    ],
    name: "DeviceManagement",
    redirect: "noRedirect",
  },
  // // 实时检索
  // {
  //   path: "/real-time-search",
  //   component: Layout,
  //   meta: {
  //     title: "实时检索",
  //     icon: "search",
  //     alwaysShow: true,
  //   }, // 设置标题和图标
  //   children: [
  //     {
  //       path: "profile",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //     {
  //       path: "profile1",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile1",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //   ],
  //   name: "RealTimeSearch",
  //   redirect: "noRedirect",
  // },
  // // 案件中心
  // {
  //   path: "/case-center",
  //   component: Layout,
  //   meta: {
  //     title: "案件中心",
  //     icon: "user",
  //     alwaysShow: true,
  //   }, // 设置标题和图标
  //   children: [
  //     {
  //       path: "profile",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //     {
  //       path: "profile1",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile1",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //   ],
  //   name: "CaseCenter",
  //   redirect: "noRedirect",
  // },
  // // 样本微调
  // {
  //   path: "/sample-adjustment",
  //   component: Layout,
  //   meta: {
  //     title: "样本微调",
  //     icon: "user",
  //     alwaysShow: true,
  //   }, // 设置标题和图标
  //   children: [
  //     {
  //       path: "profile",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //     {
  //       path: "profile1",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile1",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //   ],
  //   name: "SampleAdjustment",
  //   redirect: "noRedirect",
  // },
  // // 动态聚档
  // {
  //   path: "/dynamic-case-files",
  //   component: Layout,
  //   meta: {
  //     title: "动态案档",
  //     icon: "user",
  //     alwaysShow: true,
  //   }, // 设置标题和图标
  //   children: [
  //     {
  //       path: "profile",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //     {
  //       path: "profile1",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile1",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //   ],
  //   name: "DynamicCaseFiles",
  //   redirect: "noRedirect",
  // },
  // // 预警中心
  // {
  //   path: "/warning-center",
  //   component: Layout,
  //   meta: {
  //     title: "预警中心",
  //     icon: "user",
  //     alwaysShow: true,
  //   }, // 设置标题和图标
  //   children: [
  //     {
  //       path: "profile",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //     {
  //       path: "profile1",
  //       component: () => import("@/views/system/user/profile/index"),
  //       name: "Profile1",
  //       meta: { title: "个人中心", icon: "user" }, // 设置标题和图标
  //     },
  //   ],
  //   name: "WarningCenter",
  //   redirect: "noRedirect",
  // },
];

// 动态路由（dynamicRoutes），根据用户的权限动态加载不同的路由
export const dynamicRoutes = [
  // 分配角色给用户的路由，需要具有 system:user:edit 权限
  {
    path: "/system/user-auth",
    component: Layout,
    hidden: true,
    permissions: ["system:user:edit"],
    children: [
      {
        path: "role/:userId(\\d+)", // 使用正则表达式匹配 userId 参数
        component: () => import("@/views/system/user/authRole"),
        name: "AuthRole",
        meta: { title: "分配角色", activeMenu: "/system/user" }, // 设置标题和激活的侧边栏项
      },
    ],
  },
  // 分配用户给角色的路由，需要具有 system:role:edit 权限
  {
    path: "/system/role-auth",
    component: Layout,
    hidden: true,
    permissions: ["system:role:edit"],
    children: [
      {
        path: "user/:roleId(\\d+)",
        component: () => import("@/views/system/role/authUser"),
        name: "AuthUser",
        meta: { title: "分配用户", activeMenu: "/system/role" },
      },
    ],
  },
  // 查看字典数据的路由，需要具有 system:dict:list 权限
  {
    path: "/system/dict-data",
    component: Layout,
    hidden: true,
    permissions: ["system:dict:list"],
    children: [
      {
        path: "index/:dictId(\\d+)",
        component: () => import("@/views/system/dict/data"),
        name: "Data",
        meta: { title: "字典数据", activeMenu: "/system/dict" },
      },
    ],
  },
  // 查看调度日志的路由，需要具有 monitor:job:list 权限
  {
    path: "/monitor/job-log",
    component: Layout,
    hidden: true,
    permissions: ["monitor:job:list"],
    children: [
      {
        path: "index/:jobId(\\d+)",
        component: () => import("@/views/monitor/job/log"),
        name: "JobLog",
        meta: { title: "调度日志", activeMenu: "/monitor/job" },
      },
    ],
  },
  // 修改生成配置的路由，需要具有 tool:gen:edit 权限
  {
    path: "/tool/gen-edit",
    component: Layout,
    hidden: true,
    permissions: ["tool:gen:edit"],
    children: [
      {
        path: "index/:tableId(\\d+)",
        component: () => import("@/views/tool/gen/editTable"),
        name: "GenEdit",
        meta: { title: "修改生成配置", activeMenu: "/tool/gen" },
      },
    ],
  },
];

// 创建路由器实例，管理应用的所有路由
const router = createRouter({
  history: createWebHistory(), // 使用HTML5 History模式，使得URL更整洁
  routes: constantRoutes, // 添加公共路由到路由表中
  scrollBehavior(to, from, savedPosition) {
    // 定义滚动行为，当用户跳转页面时如何处理滚动位置
    if (savedPosition) {
      return savedPosition; // 如果存在保存的位置，则返回该位置
    }
    return { top: 0 }; // 否则滚动到页面顶部
  },
});

// 导出路由器实例，以便可以在其他地方导入并使用它
export default router;
