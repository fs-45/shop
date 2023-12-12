<template>
  <div class="login">
    <el-form :model="userinfo" :rules="loginRules" ref="loginForm">
      <el-form-item prop="name">
        <el-input
          v-model="userinfo.name"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user-solid"
          @input="checkvalidate('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          v-model="userinfo.pwd"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          show-password
          @input="checkvalidate('loginForm')"
        ></el-input>
      </el-form-item>
      <el-form-item class="button">
        <el-button type="primary" :disabled="isDisabld" @click="submit"
          >登陆</el-button
        >
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 使用图形校验码 -->
    <Vcode :show="isShow" @success="success" @close="close" />
  </div>
</template>

<script>
//导入图形验证码组件
import Vcode from "vue-puzzle-vcode";

export default {
  props: {},
  data() {
    return {
      isShow: false,
      isDisabld: true,
      userinfo: {
        name: "admin",
        pwd: "123456",
      },
      loginRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    //对整个表单进行校验
    checkvalidate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //解除登录按钮的禁用
          this.isDisabld = false;
        } else {
          this.isDisabld = true;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submit() {
      this.isShow = true;
    },

    // 用户通过了验证
    async success(msg) {
      this.isShow = false; // 通过验证后，需要手动隐藏模态框
      //验证成功，准备登陆00

      //调用结构发送请求
      let res = await this.axios.post("/login", {
        username: this.userinfo.name,
        password: this.userinfo.pwd,
      });
      if (res.meta.status == 200) {
        //登陆成功储存token  缓存数据
        sessionStorage.setItem("token", res.data.token);

        this.$message({
          message: res.meta.msg,
          type: "success",
          duration: 1000,
          //提示框消失时的回调函数onClose
          onClose: () => {
            this.$router.push("/home").catch((erro) => "");
          },
        });
      } else {
        this.$message.error({
          message: res.meta.msg,
          duration: 1000,
        });
      }
    },
    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShow = false;
    },
  },
  mounted() {
    //初加载验证表单
    this.checkvalidate("loginForm");
  },
  components: {
    //注册组件
    Vcode,
  },
};
</script>

<style scoped lang="less">
.login {
  height: 100%;
  width: 100%;
  background: url("@/assets/bj.be0436d4.jpg") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 300px;
    background-color: white;
    border-radius: 10px;
    padding: 30px;

    .button {
      display: flex;
      // justify-content: space-between;
    }
  }
}
</style>
