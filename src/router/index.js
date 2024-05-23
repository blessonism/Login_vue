// 此文件专门负责项目的路由

import VueRouter from "vue-router";

// 引入组件
import Login from "../views/login/UserLogin";
import store from "../store"; // Vuex store
import Register from "../views/register/UserRegister";
import Home from "../views/home/HomeIndex.vue";
import UserPage from "../views/page/UserPage.vue";
import AdminPage from "../views/page/AdminPage.vue";
import UnauthorizedPage from "../views/page/UnauthorizedPage.vue";
import { Message } from "element-ui";

// 创建并暴露一个路由器
const router = new VueRouter({
  mode: "history", // 路由模式，该模式不会在地址中显示井号#
  routes: [
    {
      path: "/", // 路径
      redirect: "/login", // 重定向
    },
    {
      path: "/login", // 路径
      component: Login, // 跳转到的组件
    },
    {
      path: "/register", // 路径
      component: Register, // 跳转到的组件
    },
    {
      path: "/home", // 路径
      component: Home, // 跳转到的组件
    },
    {
      path: "/user", // 路径
      component: UserPage, // 跳转到的组件
      meta: { requiresAuth: true, role: "USER" },
    },
    {
      path: "/admin", // 路径
      component: AdminPage, // 跳转到的组件
      meta: { requiresAuth: true, role: "ADMIN" },
    },
    {
      path: "/unauthorized",
      component: UnauthorizedPage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem("userInfo");
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const role = to.meta.role;
  let user = store.state.user.userInfo;

  if (!user && isAuthenticated) {
    user = JSON.parse(sessionStorage.getItem("userInfo"));
    store.commit("setUser", user);
  }

  if (to.path === "/login" || to.path === "/register") {
    if (isAuthenticated) {
      if (user.role === "ADMIN") {
        next("/admin");
      } else if (user.role === "USER") {
        next("/user");
      } else {
        next();
      }
    } else {
      next();
    }
    return;
  }

  if (requiresAuth) {
    if (!isAuthenticated || !user) {
      next({ path: "/login" });
      Message({
        message: "请先登录！",
        type: "warning",
      });
    } else if (role && user.role !== role) {
      next("/unauthorized");
      Message({
        message: "没有权限访问该页面！",
        type: "error",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
