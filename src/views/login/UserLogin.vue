<template>
  <div>
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="70px"
        class="login-from"
      >
        <el-form-item label="用户名" prop="uname">
          <el-input
            v-model="ruleForm.uname"
            placeholder="请输入2-10位用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            :type="passwordType"
            v-model="ruleForm.password"
            placeholder="请输入5-16位密码"
            autocomplete="off"
          >
            <template slot="append">
              <el-button @click="togglePasswordVisibility" class="icon-style">
                <i :class="passwordIcon"></i>
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
          v-loading="loading"
          >登录</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <router-link to="/register">
          <el-button style="margin-left: 10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
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
      rules: {
        uname: [
          { required: true, message: "用户名不能为空！", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "用户名长度必须在2到10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" },
          {
            min: 5,
            max: 16,
            message: "密码长度必须在5到16个字符之间",
            trigger: "blur",
          },
        ],
      },
      loading: false, // 是否显示加载动画
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
      // 验证表单中的账号密码是否有效，因为在上面rules中定义为了必填 required: true
      this.$refs[formName].validate((valid) => {
        // 点击登录后，让登录按钮开始转圈圈（展示加载动画）
        this.loading = true;
        // 如果经过校验，账号密码都不为空，则发送请求到后端登录接口
        if (valid) {
          let _this = this;
          // 使用 axios 将登录信息发送到后端
          this.axios({
            url: "/api/user/login", // 请求地址
            method: "post", // 请求方法
            headers: {
              // 请求头
              "Content-Type": "application/json",
            },
            params: {
              // 请求参数
              uname: _this.ruleForm.uname,
              password: _this.ruleForm.password,
            },
          }).then((res) => {
            // 当收到后端的响应时执行该括号内的代码，res 为响应信息，也就是后端返回的信息
            if (res.data.code === "0") {
              // 当响应的编码为 0 时，说明登录成功
              // 将用户信息存储到sessionStorage中
              sessionStorage.setItem("userInfo", JSON.stringify(res.data.data));

              const role = res.data.data.role;
              console.log(`role: ${role}`);
              if (role === "admin") {
                this.$router.push("/admin");
              } else {
                this.$router.push("/user");
              }

              // 显示后端响应的成功信息
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              // 当响应的编码不为 0 时，说明登录失败
              // 显示后端响应的失败信息
              this.$message({
                message: res.data.msg,
                type: "warning",
              });
            }
            // 不管响应成功还是失败，收到后端响应的消息后就不再让登录按钮显示加载动画了
            _this.loading = false;
            console.log(res);
          });
        } else {
          // 如果账号或密码有一个没填，就直接提示必填，不向后端请求
          console.log("error submit!!");
          this.loading = false;
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.icon-style {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}
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
