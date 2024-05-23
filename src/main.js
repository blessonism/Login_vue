import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueRouter from "vue-router";
import router from "./router";
import axios from "axios";
import store from "./store"; // 引入 Vuex
import VueAxios from "vue-axios";
import "@fortawesome/fontawesome-free/css/all.css";

// 关闭 Vue 的生产提示
Vue.config.productionTip = false;

// 使用插件
Vue.use(ElementUI); // element ui 插件
Vue.use(VueRouter); // 路由插件
Vue.use(VueAxios, axios); // 使用 axios 插件
// 初始化 store 状态
store.dispatch("initializeStore");

// Axios 请求拦截器
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch("logout");
      router.push("/login");
      Message({
        message: "请先登录！",
        type: "warning",
      });
    }
    return Promise.reject(error);
  }
);

// 创建 Vue 实例对象
new Vue({
  render: (h) => h(App), // render 函数将帮助解析模板，传入的参数 h 为一个函数，该函数可用来解析 App 这个组件
  router,
  store, // 使用 Vuex
}).$mount("#app"); // 将 App.vue 组件挂载到 index.html 中的 id 为 app 的 div 标签上
