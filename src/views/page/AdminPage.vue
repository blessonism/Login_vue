<!-- frontend/src/views/AdminPage.vue -->
<template>
  <div>
    <h1>Admin Page</h1>
    <p>Welcome, Admin!</p>
    <el-button @click="logout"> 登出 </el-button>
    <el-button @click="enterUser"> 进入user页面 </el-button>
    <el-button @click="enterUserControl"> 进入用户管理页面 </el-button>
  </div>
</template>

<script>
export default {
  name: "AdminPage",
  methods: {
    logout() {
      // 移除本地用户登录信息
      sessionStorage.removeItem("userInfo");
      // 跳转页面到登录页
      this.$router.push("/login");
    },

    enterUser() {
      this.$router.push("/user");
    },

    enterUserControl() {
      this.$router.push("/admin/users");
    },
  },
  mounted() {
    if (sessionStorage.getItem("userInfo")) {
      // 将用户信息存储到sessionStorage中
      this.user = JSON.parse(sessionStorage.getItem("userInfo"));
    }
  },
};
</script>
