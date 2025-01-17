// 导入路由配置和相关库
import router from "./router";
import { ElMessage } from "element-plus"; // 用于显示消息提示框
import NProgress from "nprogress"; // 用于显示页面加载进度条
import "nprogress/nprogress.css"; // 引入进度条样式
import { getToken } from "@/utils/auth"; // 获取用户token的工具函数
import { isHttp, isPathMatch } from "@/utils/validate"; // 校验路径是否为HTTP链接或匹配模式
import { isRelogin } from "@/utils/request"; // 检查是否需要重新登录的工具函数
import useUserStore from "@/store/modules/user"; // 用户信息仓库
import useSettingsStore from "@/store/modules/settings"; // 设置信息仓库
import usePermissionStore from "@/store/modules/permission"; // 权限信息仓库

// 配置NProgress，关闭默认的旋转图标
NProgress.configure({ showSpinner: false });

// 定义免登录白名单路径
const whiteList = ["/login", "/register"];

// 判断给定路径是否在白名单中
const isWhiteList = (path) => {
  return whiteList.some((pattern) => isPathMatch(pattern, path));
};

// 全局前置守卫，在每次路由切换前执行
router.beforeEach((to, from, next) => {
  NProgress.start(); // 开始进度条
  next();
  // if (getToken()) {
  //   // 如果有token，表示用户已登录
  //   // 更新页面标题（如果存在meta.title）
  //   to.meta.title && useSettingsStore().setTitle(to.meta.title);

  //   /* 已登录状态下的路由处理 */
  //   if (to.path === "/login") {
  //     next({ path: "/" }); // 如果目标是登录页，则重定向到首页
  //     NProgress.done();
  //   } else if (isWhiteList(to.path)) {
  //     next(); // 如果访问的是白名单中的路径，直接放行
  //   } else {
  //     if (useUserStore().roles.length === 0) {
  //       // 如果用户角色列表为空，说明还未获取用户信息
  //       isRelogin.show = true; // 显示重新登录标志

  //       // 尝试获取用户信息
  //       useUserStore()
  //         .getInfo()
  //         .then(() => {
  //           isRelogin.show = false; // 获取成功后隐藏重新登录标志

  //           // 根据用户权限生成可访问的路由表
  //           usePermissionStore()
  //             .generateRoutes()
  //             .then((accessRoutes) => {
  //               // 动态添加可访问的路由
  //               accessRoutes.forEach((route) => {
  //                 if (!isHttp(route.path)) {
  //                   // 确保不是外部链接
  //                   // router.addRoute(route); // 动态添加路由
  //                 }
  //               });

  //               // 确保路由已经添加完毕后再进行跳转
  //               next({ ...to, replace: true });
  //             });
  //         })
  //         .catch((err) => {
  //           // 获取用户信息失败，注销用户并重定向到登录页
  //           useUserStore()
  //             .logOut()
  //             .then(() => {
  //               ElMessage.error(err); // 显示错误信息
  //               next({ path: "/" });
  //             });
  //         });
  //     } else {
  //       next(); // 用户信息已存在，直接放行
  //     }
  //   }
  // } else {
  //   // 如果没有token，表示用户未登录
  //   if (isWhiteList(to.path)) {
  //     // 如果访问的是白名单中的路径，直接放行
  //     next();
  //   } else {
  //     // 否则全部重定向到登录页，并携带当前访问路径作为redirect参数
  //     next(`/login?redirect=${to.fullPath}`);
  //     NProgress.done();
  //   }
  // }
});

// 全局后置守卫，在每次路由切换完成后执行
router.afterEach(() => {
  NProgress.done(); // 结束进度条
});
