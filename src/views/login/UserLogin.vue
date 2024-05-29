<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6">登录</h2>
      <form
        ref="ruleForm"
        @submit.prevent="submitForm('ruleForm')"
        class="space-y-6"
      >
        <div class="mb-4">
          <label for="uname" class="block text-gray-700 mb-2">用户名</label>
          <input
            type="text"
            v-model="ruleForm.uname"
            id="uname"
            placeholder="请输入2-10位用户名"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <span v-if="errors.uname" class="text-red-500 text-sm mt-1">
            {{ errors.uname }}
          </span>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700 mb-2">密码</label>
          <div class="relative">
            <input
              :type="passwordType"
              v-model="ruleForm.password"
              id="password"
              placeholder="请输入5-16位密码"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              <i :class="passwordIcon"></i>
            </button>
          </div>
          <span v-if="errors.password" class="text-red-500 text-sm mt-1">
            {{ errors.password }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
            :disabled="loading"
          >
            登录
          </button>
          <button
            type="button"
            @click="resetForm('ruleForm')"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-gray-300"
          >
            重置
          </button>
          <router-link to="/register">
            <button
              type="button"
              class="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300"
            >
              注册
            </button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        uname: "",
        password: "",
      },
      errors: {
        uname: null,
        password: null,
      },
      loading: false,
      passwordType: "password",
      passwordIcon: "el-icon-view",
    };
  },
  methods: {
    togglePasswordVisibility() {
      if (this.passwordType === "password") {
        this.passwordType = "text";
        this.passwordIcon = "el-icon-minus";
      } else {
        this.passwordType = "password";
        this.passwordIcon = "el-icon-view";
      }
    },
    submitForm(formName) {
      this.loading = true;
      this.errors.uname = null;
      this.errors.password = null;
      if (
        !this.ruleForm.uname ||
        this.ruleForm.uname.length < 2 ||
        this.ruleForm.uname.length > 10
      ) {
        this.errors.uname = "用户名长度必须在2到10个字符之间";
      }
      if (
        !this.ruleForm.password ||
        this.ruleForm.password.length < 5 ||
        this.ruleForm.password.length > 16
      ) {
        this.errors.password = "密码长度必须在5到16个字符之间";
      }
      if (this.errors.uname || this.errors.password) {
        this.loading = false;
        return;
      }
      this.axios({
        url: "/api/user/login",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          uname: this.ruleForm.uname,
          password: this.ruleForm.password,
        },
      }).then((res) => {
        if (res.data.code === "0") {
          sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));
          const role = res.data.data.role;
          if (role === "ADMIN") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/user");
          }
          this.$message({
            message: res.data.msg,
            type: "success",
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
        this.loading = false;
      });
    },
    resetForm(formName) {
      this.ruleForm.uname = "";
      this.ruleForm.password = "";
      this.errors.uname = null;
      this.errors.password = null;
    },
  },
};
</script>

<style scoped>
.icon-style {
  padding: 0;
  background: none;
  border: none;
}
</style>
