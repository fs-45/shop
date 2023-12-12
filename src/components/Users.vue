<template>
  <div class="user-box">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item class="bread">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item class="breadtxt">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表视图 -->
    <el-card>
      <!-- 搜索框 -->

      <el-row :gutter="20">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            v-model="userinfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表展示区 -->
      <el-table :data="userlist" border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name" width="100">
        </el-table-column>
        <el-table-column label="状态" prop="mg_state" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="swichChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="open(scope.row.id)"
            ></el-button>
            <!-- 分配 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[2, 4, 5, 6]"
        :page-size="userinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 内容主体 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="ediaDialogClosed"
      >
        <el-form
          :model="ediaForm"
          :rules="ediaFormRules"
          ref="ediaFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="ediaForm.username" disabled></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ediaForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="ediaForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ediaUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    //自定义校验邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 邮箱的正则
      const regEmail =
        /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法手机号"));
    };
    return {
      //获取用户列表数据的参数对象
      userinfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示
      addDialogVisible: false,
      //控制修改用户对话框的显示
      editDialogVisible: false,
      //添加用户表单验证
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: ["input", "blur"],
          },
          { min: 3, max: 10, message: "在三位到十位之间" },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["input", "blur"],
          },
          { min: 6, max: 12, message: "在6位到12位之间" },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur"],
          },
          { validator: checkEmail, trigger: ["input", "blur"] },
        ],
        mobile: [
          { required: true, message: "请输入邮箱", trigger: ["input", "blur"] },
          { validator: checkMobile, trigger: ["input", "blur"] },
        ],
      },
      //修改用户时获取的用户信息
      ediaForm: {},
      //修改用户表单的验证规则
      ediaFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: ["blur"],
          },
          { validator: checkEmail, trigger: ["input", "blur"] },
        ],
        mobile: [
          { required: true, message: "请输入邮箱", trigger: ["input", "blur"] },
          { validator: checkMobile, trigger: ["input", "blur"] },
        ],
      },
    };
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      let res = await this.axios.get("/users", {
        params: this.userinfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return console.error("获取失败");
      } else {
        this.userlist = res.data.users;
        this.total = res.data.total;
      }
    },
    //分页功能
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.userinfo.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.userinfo.pagenum = val;
      this.getUserList();
    },
    //状态改变
    async swichChange(val) {
      // console.log(val);
      let res = await this.axios.put(`users/${val.id}/state/${val.mg_state}`);
      console.log(res);
      if (res.meta.status != 200) {
        val.mg_state = !val.mg_state;
        return this.$message.error("更新用户状态失败");
      } else {
        this.$message.success("更新用户状态成功");
      }
    },
    //关闭对话框时重置添加用户表单
    addDialogClosed() {
      // console.log(this.$refs.addFormRef);
      this.$refs.addFormRef.resetFields();
    },
    //修改用户对话框关闭时的重置
    ediaDialogClosed() {
      // console.log(this.$refs.ediaFormRef);
      this.$refs.ediaFormRef.resetFields();
    },
    //确定添加用户方法
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (valid) {
          let res = await this.axios.post("/users", this.addForm);
          if (res.meta.status != 201) {
            return this.$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功");
          //隐藏对话框
          this.addDialogVisible = false;
          this.getUserList();
        } else {
          return this.$message.error("格式不正确");
        }
      });
    },
    //确定修改用户方法
    ediaUser() {
      this.$refs.ediaFormRef.validate(async (valid) => {
        // console.log(valid);
        if (valid) {
          let res = await this.axios.put(`users/${this.ediaForm.id}`, {
            email: this.ediaForm.email,
            mobile: this.ediaForm.mobile,
          });
          // console.log(res);
          if (res.meta.status != 200) {
            return this.$message.error("用户信息修改失败");
          }
          this.$message.success("修改成功");
          this.getUserList();
          this.editDialogVisible = false;
        } else {
          return this.$message.error("格式不正确");
        }
      });
    },
    //展示编辑用户对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      let res = await this.axios.get(`users/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("获取信息失败");
      }
      this.ediaForm = res.data;
      // console.log(this.ediaForm);
    },
    // 删除按钮的点击事件
    async open(id) {
      console.log(id);
      let confirmResult = await this.$confirm(
        "此操作将永久删除该用户数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((erro) => "erro");
      //如果用户确认删除返回一个字符串confirm
      // console.log(confirmResult);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除操作");
      }
      let res = await this.axios.delete("users/" + id);
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.getUserList();
      this.$message.success(res.meta.msg);
    },
  },
  components: {},
  created() {
    this.getUserList();
  },
  mounted() {
    // console.log(this.$confirm);
  },
};
</script>
<style scoped lang="less">
.user-box {
  .el-breadcrumb {
    margin: 5px;
  }
}
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
