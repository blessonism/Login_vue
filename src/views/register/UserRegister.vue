<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6">注册</h2>
      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="uname" class="block text-gray-700 mb-2">用户名</label>
          <input
            type="text"
            v-model="ruleForm.uname"
            id="uname"
            placeholder="请输入2-10位用户名"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <span v-if="errors.uname" class="text-red-500 text-sm mt-1">{{
            errors.uname
          }}</span>
        </div>
        <div>
          <label for="pass" class="block text-gray-700 mb-2">密码</label>
          <input
            type="password"
            v-model="ruleForm.pass"
            id="pass"
            placeholder="请输入5-16位密码"
            autocomplete="off"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <span v-if="errors.pass" class="text-red-500 text-sm mt-1">{{
            errors.pass
          }}</span>
        </div>
        <div>
          <label for="password" class="block text-gray-700 mb-2"
            >确认密码</label
          >
          <input
            type="password"
            v-model="ruleForm.password"
            id="password"
            placeholder="请再次输入密码"
            autocomplete="off"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <span v-if="errors.password" class="text-red-500 text-sm mt-1">{{
            errors.password
          }}</span>
        </div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            :class="{ 'opacity-50 cursor-not-allowed': loading }"
            :disabled="loading"
          >
            提交
          </button>
          <button
            type="button"
            @click="resetForm"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-gray-300"
          >
            重置
          </button>
          <button
            type="button"
            @click="goBack"
            class="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300"
          >
            返回
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      ruleForm: {
        uname: "",
        pass: "",
        password: "",
      },
      errors: {
        uname: null,
        pass: null,
        password: null,
      },
      loading: false,
    };
  },
  methods: {
    validate() {
      this.errors.uname = null;
      this.errors.pass = null;
      this.errors.password = null;

      if (
        !this.ruleForm.uname ||
        this.ruleForm.uname.length < 2 ||
        this.ruleForm.uname.length > 10
      ) {
        this.errors.uname = "用户名长度必须在2到10个字符之间";
      }
      if (
        !this.ruleForm.pass ||
        this.ruleForm.pass.length < 5 ||
        this.ruleForm.pass.length > 16
      ) {
        this.errors.pass = "密码长度必须在5到16个字符之间";
      }
      if (this.ruleForm.pass !== this.ruleForm.password) {
        this.errors.password = "两次输入密码不一致!";
      }

      return !this.errors.uname && !this.errors.pass && !this.errors.password;
    },
    submitForm() {
      if (this.validate()) {
        this.loading = true;
        axios
          .post("/api/user/register", {
            uname: this.ruleForm.uname,
            password: this.ruleForm.password,
          })
          .then((res) => {
            if (res.data.code === "0") {
              this.$message({
                message: res.data.msg,
                type: "success",
              });
              this.$router.push("/login");
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
            }
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    resetForm() {
      this.ruleForm.uname = "";
      this.ruleForm.pass = "";
      this.ruleForm.password = "";
      this.errors.uname = null;
      this.errors.pass = null;
      this.errors.password = null;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
/* 设置登录面板居中，宽度为400px */
.box-card {
  margin: auto auto;
  width: 400px;
}
/* 设置登录面板中的表单居中 */
.login-from {
  margin: auto auto;
}
</style>
