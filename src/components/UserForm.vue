<template>
  <div>
    <el-card class="box-card">
      <h2>{{ isEdit ? "编辑" : "添加" }} 用户</h2>
      <el-form :model="user" ref="userForm" label-width="100px">
        <el-form-item label="用户名" style="width: 330px">
          <el-input v-model="user.uname"></el-input>
        </el-form-item>
        <el-form-item label="权限" style="width: 330px">
          <el-select v-model="user.role" placeholder="请选择权限">
            <el-option label="管理员" value="ADMIN"></el-option>
            <el-option label="用户" value="USER"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="密码" v-if="!isEdit"> -->
        <el-form-item label="密码" style="width: 330px">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveUser">保存</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        id: null,
        name: "",
        role: "",
        password: "",
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
      this.axios({
        url: `/api/users/${id}`,
        method: "get",
      })
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          this.$message.error("获取用户信息失败");
          console.error(error);
        });

      //   this.$http.get(`/api/users/${id}`).then((response) => {
      //     this.user = response.data;
      //   });
    },
    saveUser() {
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

      this.axios(requestConfig)
        .then(() => {
          this.$message.success("保存成功");
          this.$router.push("/admin/users");
        })
        .catch((error) => {
          this.$message.error("保存失败");
          console.error(error);
        });

      //   const request = this.isEdit
      //     ? this.$http.put(`/api/users/${this.user.id}`, this.user)
      //     : this.$http.post("/api/users", this.user);

      //   request.then(() => {
      //     this.$router.push("/admin/users");
      //   });
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
