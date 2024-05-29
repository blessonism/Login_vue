<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6">
        {{ isEdit ? "编辑" : "添加" }} 用户
      </h2>
      <form @submit.prevent="saveUser" class="space-y-6">
        <div>
          <label for="uname" class="block text-gray-700 mb-2">用户名</label>
          <input
            type="text"
            v-model="user.uname"
            id="uname"
            placeholder="请输入用户名"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
          <span v-if="errors.uname" class="text-red-500 text-sm mt-1">{{
            errors.uname
          }}</span>
        </div>
        <div>
          <label for="role" class="block text-gray-700 mb-2">权限</label>
          <select
            v-model="user.role"
            id="role"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="ADMIN">管理员</option>
            <option value="USER">用户</option>
          </select>
          <span v-if="errors.role" class="text-red-500 text-sm mt-1">{{
            errors.role
          }}</span>
        </div>
        <div v-if="!isEdit">
          <label for="password" class="block text-gray-700 mb-2">密码</label>
          <input
            type="password"
            v-model="user.password"
            id="password"
            placeholder="请输入密码"
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
          >
            保存
          </button>
          <button
            type="button"
            @click="goBack"
            class="ml-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-gray-300"
          >
            取消
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
      user: {
        id: null,
        uname: "",
        role: "",
        password: "",
      },
      errors: {
        uname: null,
        role: null,
        password: null,
      },
      isEdit: false,
    };
  },
  created() {
    if (this.$route.params.id) {
      this.isEdit = true;
      this.fetchUser(this.$route.params.id);
    }
  },
  methods: {
    fetchUser(id) {
      axios
        .get(`/api/users/${id}`)
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          this.$message.error("获取用户信息失败");
          console.error(error);
        });
    },
    validate() {
      this.errors.uname = null;
      this.errors.role = null;
      this.errors.password = null;

      if (!this.user.uname) {
        this.errors.uname = "用户名不能为空";
      }
      if (!this.user.role) {
        this.errors.role = "请选择权限";
      }
      if (!this.isEdit && !this.user.password) {
        this.errors.password = "密码不能为空";
      }

      return !this.errors.uname && !this.errors.role && !this.errors.password;
    },
    saveUser() {
      if (this.validate()) {
        const requestConfig = this.isEdit
          ? {
              url: `/api/users/${this.user.id}`,
              method: "put",
              data: this.user,
              headers: {
                "Content-Type": "application/json",
              },
            }
          : {
              url: "/api/users",
              method: "post",
              data: this.user,
              headers: {
                "Content-Type": "application/json",
              },
            };

        axios(requestConfig)
          .then(() => {
            this.$message.success("保存成功");
            this.$router.push("/admin/users");
          })
          .catch((error) => {
            this.$message.error("保存失败");
            console.error(error);
          });
      }
    },
    goBack() {
      this.$router.push("/admin/users");
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: auto auto;
  width: 400px;
}
</style>
