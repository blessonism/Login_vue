<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
      <h2 class="text-2xl font-bold mb-6">用户列表</h2>
      <button
        @click="navigateToAddUser"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 mb-4"
      >
        添加用户
      </button>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              用户名
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              权限
            </th>
            <th
              scope="col"
              class="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.uname }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="navigateToEditUser(user.id)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                编辑
              </button>
              <button
                @click="confirmDeleteUser(user.id)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 删除确认对话框 -->
      <transition name="dialog-fade">
        <div
          v-if="isDeleteDialogOpen"
          class="fixed z-10 inset-0 overflow-y-auto"
        >
          <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          >
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
              >&#8203;</span
            >
            <div
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <svg
                      class="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7H7m6 0V4m0 3v3m-6 3h6m6 0h-6m0 0v3m0-3v-3m0 0V4m0 3h6m0 0H7"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      删除用户
                    </h3>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        此操作将永久删除该用户, 是否继续?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
              >
                <button
                  @click="deleteUser(deleteUserId)"
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  确定
                </button>
                <button
                  @click="isDeleteDialogOpen = false"
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      isDeleteDialogOpen: false,
      deleteUserId: null,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios
        .get("/api/users")
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          this.$message.error("获取用户列表失败");
          console.error(error);
        });
    },
    navigateToAddUser() {
      this.$router.push("user/new");
    },
    navigateToEditUser(id) {
      this.$router.push(`user/edit/${id}`);
    },
    confirmDeleteUser(id) {
      this.deleteUserId = id;
      this.isDeleteDialogOpen = true;
    },
    deleteUser(id) {
      axios
        .delete(`/api/users/${id}`)
        .then(() => {
          this.fetchUsers();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((error) => {
          this.$message.error("删除失败");
          console.error(error);
        })
        .finally(() => {
          this.isDeleteDialogOpen = false;
          this.deleteUserId = null;
        });
    },
  },
};
</script>

<style scoped>
.box-card {
  margin: auto auto;
  width: 800px;
}
</style>
