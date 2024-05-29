<template>
  <div>
    <el-card class="box-card">
      <h2>用户列表</h2>
      <el-button type="primary" @click="navigateToAddUser">添加用户</el-button>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="uname" label="用户名"></el-table-column>
        <el-table-column prop="role" label="权限"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="navigateToEditUser(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteUser(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      this.$http
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
    deleteUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http
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
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "删除操作已取消",
          });
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
