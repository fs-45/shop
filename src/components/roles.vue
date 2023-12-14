<template>
  <div class="rolesBox">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据展示区 -->
    <el-card>
      <el-button type="primary" @click="adduserlogVisible = true">
        添加用户
      </el-button>
      <el-table :data="roleslist" border stripe>
        <!-- 展开列 -->
        <el-table-column width="50" type="expand">
          <!-- slot插槽拿取数值 -->
          <template slot-scope="scope">
            <!-- 栅格布局 -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'v-center']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRoleByid(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 == 0 ? '' : 'bdtop', 'v-center']"
                >
                  <el-col :span="10">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleByid(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="14">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRoleByid(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- pre排列 -->
            <pre>
              <!-- {{ scope.row }} -->
              
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="350" class-name="zc">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="getuser(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->

            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="删除后该角色无法恢复"
              @confirm="deleteuser(scope.row.id)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
                >删除</el-button
              >
            </el-popconfirm>

            <!-- 分配 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showRoles(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="adduserlogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          label-width="70px"
          :model="addForm"
          :rules="adduserRules"
          ref="adduserRef"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="adduserlogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addrole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色的对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="ediauserlogVisible"
        width="50%"
      >
        <el-form
          label-width="70px"
          ref="ediauserRef"
          v-model="ediaForm"
          :rules="ediauserRules"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="ediaForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="ediaForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ediauserlogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ediauser(ediaForm.roleId)"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 展示角色权限的对话框 -->
      <el-dialog
        :visible.sync="showRoleslogVisible"
        width="50%"
        @close="defaultkeys = []"
        title="分配权限"
      >
        <!-- 树型控件 -->
        <el-tree
          :props="treeprops"
          show-checkbox
          :data="rightslist"
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultkeys"
          ref="treeRef"
        >
        </el-tree>
        <pre></pre>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRoleslogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 分配角色的id
      allotid: 0,
      //用户权限列表
      roleslist: [],
      //控制添加对话框的显示
      adduserlogVisible: false,
      //控制编辑对话框的显示
      ediauserlogVisible: false,
      //控制展示角色对话框的显示
      showRoleslogVisible: false,
      //角色权限列表
      rightslist: [],
      //树型控件的属性绑定对象
      treeprops: {
        //展示绑定的属性
        label: "authName",
        // 嵌套使用的属性
        children: "children",
      },
      //默认选中的权限树id数组
      defaultkeys: [],
      //添加角色表单数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      //添加角色表单规则
      adduserRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "input",
          },
          {
            min: 0,
            max: 10,
          },
        ],
        roleDesc: [
          {
            message: "请输入角色介绍",
            trigger: "blur",
          },
        ],
      },
      //编辑角色获取数据
      ediaForm: {},
      //编辑角色表单规则
      ediauserRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "input",
          },
          {
            min: 0,
            max: 10,
          },
        ],
        roleDesc: [
          {
            message: "请输入角色介绍",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //获取roles数据列表
    async getroles() {
      let res = await this.axios.get("roles");
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      this.roleslist = res.data;
    },
    //添加角色中确认按钮点击事件
    async addrole() {
      let res = await this.axios.post("roles", this.addForm);
      if (res.meta.status != 201) {
        this.$message.error("添加角色失败");
      }
      this.getroles();
      this.$message.success("添加成功");
      this.adduserlogVisible = false;
    },
    //通过id获取对应角色
    async getuser(id) {
      this.ediauserlogVisible = true;
      console.log(id);
      let res = await this.axios.get("roles/" + id);
      if (res.meta.status != 200) {
        this.$message.error("获取角色失败");
      }
      this.ediaForm = res.data;
    },
    //确定edia角色的方法
    async ediauser(id) {
      this.ediauserlogVisible = false;
      let res = await this.axios.put("roles/" + id, this.ediaForm);
      if (res.meta.status != 200) {
        return this.$message.error("修改失败");
      }
      this.$message.success("修改成功");
      this.getroles();
      // console.log(res);
    },
    //确定删除角色的方法
    async deleteuser(id) {
      console.log(id);
      let res = await this.axios.delete("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getroles();
    },
    //添加对话框关闭时的重置
    addDialogClosed() {
      this.$refs.adduserRef.resetFields();
    },
    //删除权限
    async removeRoleByid(user, roleid) {
      let confirmResult = await this.$confirm(
        "此操作将删除该角色的对应权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((erro) => "");
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除操作");
      }
      let res = await this.axios.delete(`roles/${user.id}/rights/${roleid}`);
      if (res.meta.status != 200) {
        return this.$message.error("删除权限失败");
      }
      user.children = res.data;
    },
    //展示角色权限（分配模块）
    async showRoles(role) {
      //当前角色的id
      this.allotid = role.id;
      //以树状获取所有权限
      let res = await this.axios.get("rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error("获取角色失败");
      }
      this.rightslist = res.data;
      //递归获取三级节点
      this.getSelfkeys(role, this.defaultkeys);
      this.showRoleslogVisible = true;
    },
    //通过递归的形式获取角色所有的三级权限并赋值默认数组
    getSelfkeys(node, arr) {
      // 如果当前节点不包含children属性，则是三级权限
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getSelfkeys(item, arr));
    },
    //点击为角色分配权限
    async allotRights(user) {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      let idstr = keys.join(",");
      // console.log(idstr);
      let res = await this.axios.post(`roles/${this.allotid}/rights`, {
        rids: idstr,
      });
      if (res.meta.status != 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getroles();
      this.showRoleslogVisible = false;
    },
  },
  created() {
    this.getroles();
  },
  components: {},
};
</script>

<style lang="less" >
.el-breadcrumb {
  margin: 5px;
  span {
    color: white !important;
  }
}
.el-card {
  margin-top: 20px;
  .el-table {
    margin-top: 15px;
    .el-tag {
      margin: 15px;
      margin-left: 100px;
    }
  }
}
.zc {
  button {
    margin: 6px;
  }
}
.bdtop {
  border-top: solid 1px #eee;
}
.bdbottom {
  border-bottom: solid 1px #eee;
}
.v-center {
  display: flex;
  // flex-direction: column;
  // flex-wrap: nowrap;
  // justify-content: center;
  align-items: center;
}
</style>
