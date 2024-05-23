import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit("setUser", user);
      sessionStorage.setItem("userInfo", JSON.stringify(user)); // 同步到 sessionStorage
    },
    logout({ commit }) {
      commit("clearUser");
      sessionStorage.removeItem("userInfo"); // 清除 sessionStorage
    },
    initializeStore({ commit }) {
      const userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        commit("setUser", JSON.parse(userInfo));
      }
    },
  },
});
