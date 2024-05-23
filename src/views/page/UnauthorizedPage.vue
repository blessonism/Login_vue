<template>
  <div>
    <h2>没有权限访问该页面！</h2>
    <el-button @click="logout"> 登出 </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      // 调用 Vuex 的 logout action 清除用户信息
      this.$store.dispatch("logout").then(() => {
        // 跳转页面到登录页
        this.$router.push("/login");
      });
    },
  },
};
</script>
