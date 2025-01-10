// 导入认证插件、路由配置以及相关组件和API
import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";

// 使用 import.meta.glob 动态导入所有位于 views 目录下的 .vue 文件模块
const modules = import.meta.glob("./../../views/**/*.vue");

// 定义权限仓库（store），用于管理与权限相关的状态
const usePermissionStore = defineStore("permission", {
  state: () => ({
    routes: [], // 当前用户的可访问路由
    addRoutes: [], // 动态添加的路由
    defaultRoutes: [], // 默认路由
    topbarRouters: [], // 顶部栏路由
    sidebarRouters: [], // 侧边栏路由
  }),
  actions: {
    // 设置当前用户的可访问路由
    setRoutes(routes) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes); // 合并静态路由和动态路由
    },
    // 设置默认路由
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    // 设置顶部栏路由
    setTopbarRoutes(routes) {
      this.topbarRouters = routes;
    },
    // 设置侧边栏路由
    setSidebarRouters(routes) {
      this.sidebarRouters = routes;
    },
    // 根据用户角色生成可访问的路由
    generateRoutes(roles) {
      return new Promise((resolve) => {
        // 向后端请求路由数据，并处理响应的数据
        getRouters().then((res) => {
          console.log("Routers:", res);
          const sdata = JSON.parse(JSON.stringify(res.data)); // 深拷贝后台返回的路由数据，用于侧边栏
          const rdata = JSON.parse(JSON.stringify(res.data)); // 深拷贝后台返回的路由数据，用于重写后的路由
          const defaultData = JSON.parse(JSON.stringify(res.data)); // 深拷贝后台返回的路由数据，用于默认路由
          console.log("sdata:", sdata);

          // 过滤异步路由，分别生成侧边栏路由、重写后的路由和默认路由
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          const defaultRoutes = filterAsyncRouter(defaultData);

          // 过滤动态路由，验证用户权限
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);

          // 动态添加过滤后的路由到路由器实例中
          asyncRoutes.forEach((route) => {
            // router.addRoute(route);
          });
          console.log("asyncRoutes:", asyncRoutes);

          // 更新仓库中的路由信息
          this.setRoutes(rewriteRoutes);
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
          this.setDefaultRoutes(sidebarRoutes);
          this.setTopbarRoutes(defaultRoutes);

          resolve(rewriteRoutes); // 解析Promise，返回重写后的路由
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children); // 如果是嵌套路由，则递归过滤子路由
    }

    // 特殊处理某些特定组件（Layout、ParentView、InnerLink）
    if (route.component) {
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component); // 动态加载其他组件
      }
    }

    // 如果存在子路由，递归过滤；否则删除 children 和 redirect 属性
    if (route.children != null && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }

    return true; // 返回true表示保留该路由项
  });
}

// 过滤子路由，构建正确的路径
function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView" && !lastRouter) {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el));
        return;
      }
    }
    children = children.concat(el);
  });
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = [];
  // 遍历 routes 数组中的每一个 route 对象
  routes.forEach((route) => {
    // 检查 route 对象中是否有 permissions 属性（即定义了具体权限）
    if (route.permissions) {
      // 如果存在 permissions 属性，并且 auth.hasPermiOr(route.permissions) 返回 true，
      // 表示当前用户拥有至少一个在 route.permissions 列表中的权限
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route); // 将此 route 添加到结果数组 res 中
      }
    }
    // 如果没有 permissions 属性，则检查是否存在 roles 属性（即定义了角色权限）
    else if (route.roles) {
      // 如果存在 roles 属性，并且 auth.hasRoleOr(route.roles) 返回 true，
      // 表示当前用户的角色列表中包含至少一个在 route.roles 列表中的角色
      if (auth.hasRoleOr(route.roles)) {
        res.push(route); // 将此 route 添加到结果数组 res 中
      }
    }
    // 注意：如果 route 既没有 permissions 也没有 roles 属性，则会被忽略，不添加到 res 中
  });
  return res;
}

// 动态加载视图组件
export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path](); // 返回一个动态导入函数
    }
  }
  return res;
};

// 导出权限仓库，以便在其他地方使用
export default usePermissionStore;
