// import TabsView from "@/layouts/tabs/TabsView";
// import BlankView from "@/layouts/BlankView";
// import PageView from "@/layouts/PageView";

// 路由配置
const options = {
  routes: [
    {
      path: "/login",
      name: "登录页",
      component: () => import("@/pages/login")
    },
    {
      path: "*",
      name: "404",
      component: () => import("@/pages/exception/404")
    },
    {
      path: "/403",
      name: "403",
      component: () => import("@/pages/exception/403")
    }
    /* {
      path: "/",
      name: "首页",
      component: TabsView,
      redirect: "/login",
      children: [
        {
          path: "appletManagement",
          name: "小程序管理",
          meta: {
            icon: "compass",
          },
          component: PageView,
          children: [
            {
              path: "authorization",
              name: "授权管理",
              component: () => import("@/pages/applet/authorization"),
            },
            {
              path: "version",
              name: "版本控制",
              component: () => import("@/pages/applet/version"),
            },
          ],
        },
        {
          path: "exception",
          name: "异常页",
          meta: {
            icon: "warning",
          },
          component: BlankView,
          children: [
            {
              path: "404",
              name: "Exp404",
              component: () => import("@/pages/exception/404"),
            },
            {
              path: "403",
              name: "Exp403",
              component: () => import("@/pages/exception/403"),
            },
            {
              path: "500",
              name: "Exp500",
              component: () => import("@/pages/exception/500"),
            },
          ],
        },
      ],
    }, */
  ]
};

export default options;
