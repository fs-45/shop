<template>
  <div class="paramsBox">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据视图区域 -->
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <el-row class="catopt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCatKeys"
            :options="cat_list"
            :props="{
              expandTrigger: 'hover',
              children: 'children',
              value: 'cat_id',
              label: 'cat_name',
            }"
            clearable
            @change="handleChange"
          ></el-cascader> </el-col
      ></el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 动态参数面板  -->
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedCatKeys.length == 0 ? true : false"
            style="margin-bottom: 15px"
            @click="addParamsDislogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabCate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin: 10px"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="show_Params(scope.row)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除吗？"
                  @confirm="deleteParams(scope.row)"
                >
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    slot="reference"
                    >删除</el-button
                  >
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 静态属性面板 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="selectedCatKeys.length == 0 ? true : false"
            @click="addParamsDislogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabCate" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin: 10px"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="show_Params(scope.row)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-popconfirm
                  confirm-button-text="好的"
                  cancel-button-text="不用了"
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除吗？"
                  @confirm="deleteParams(scope.row)"
                >
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    slot="reference"
                    >删除</el-button
                  >
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数的对话框 -->
      <el-dialog
        :title="addParamsText"
        :visible.sync="addParamsDislogVisible"
        width="50%"
        @close="addParamsClosed"
      >
        <el-form
          ref="addParamsRef"
          :rules="addParamsRules"
          :model="addParamsForm"
        >
          <el-form-item
            :label="addParamsName"
            label-width="70px"
            prop="attr_name"
          >
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsDislogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数的对话框 -->
      <el-dialog
        :title="editParamsText"
        :visible.sync="editParamsDislogVisible"
        width="50%"
      >
        <el-form
          ref="addParamsRef"
          :rules="editParamsRules"
          :model="editParamsForm"
        >
          <el-form-item
            :label="editParamsName"
            label-width="70px"
            prop="attr_name"
          >
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDislogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
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
      //分类列表
      cat_list: [],
      //级联选择器选择内容的prop中的value
      selectedCatKeys: [],
      //被激活的页签
      activeName: "many",
      //动态参数
      manyTabCate: [],
      //静态属性
      onlyTabCate: [],
      //控制添加参数的对话框显示
      addParamsDislogVisible: false,
      //添加表单对象
      addParamsForm: { attr_name: "" },
      //添加表单规则
      addParamsRules: {
        attr_name: {
          required: true,
          message: "请输入名称",
          trigger: "bulr",
        },
      },
      //控制修改参数的对话框显示
      editParamsDislogVisible: false,
      //修改表单对象
      editParamsForm: { attr_name: "" },
      //修改表单规则
      editParamsRules: {
        attr_name: {
          required: true,
          message: "请输入名称",
          trigger: "bulr",
        },
      },
      //修改时拿到的当前参数信息
      paramsInfo: {},
    };
  },
  methods: {
    //改变inputVisible
    showInput(row) {
      row.inputVisible = true;
      //文本框自动获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //文本框失去焦点发送添加请求
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      let res = await this.axios.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join("，"),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("添加失败");
      }
      this.$message.success("操作成功");
    },
    //tag的操作保存
    async saveTag(row) {
      let res = await this.axios.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join("，"),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("添加失败");
      }
      this.$message.success("操作成功");
    },
    //删除tag
    handleClose(row, i) {
      row.attr_vals.splice(i, 1);
      this.saveTag(row);
    },
    //获取所有参数
    async getgoods_params() {
      let res = await this.axios.get("categories");
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      this.cat_list = res.data;
    },
    //级联选择器中的项发生改变
    handleChange() {
      if (this.selectedCatKeys.length !== 3) {
        this.selectedCatKeys = [];
        (this.manyTabCate = []), (this.onlyTabCate = []);
        return;
      }
      this.getTabCate();
    },
    //tab页签点击事件
    handleTabClick() {
      this.getTabCate();
    },
    //获取页签内部数据
    async getTabCate() {
      //根据所选分类id和面板获取对应的数据
      let res = await this.axios.get(`categories/${this.catId}/attributes`, {
        params: {
          sel: this.activeName,
        },
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数失败");
      }
      // console.log(res);
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split("，") : [];
        //控制文本框的显示
        item.inputVisible = false;
        //文本框中输入的值
        item.inputValue = "";
      });
      if (this.activeName == "many") {
        this.manyTabCate = res.data;
      } else {
        this.onlyTabCate = res.data;
      }
    },
    //点击按钮添加参数
    addParams() {
      //预校验表单
      this.$refs.addParamsRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        let res = await this.axios.post(`categories/${this.catId}/attributes`, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName,
        });
        if (res.meta.status !== 201) {
          return this.$message.error("创建失败");
        }
        this.$message.success("添加成功");
        this.getTabCate();
        this.addParamsDislogVisible = false;
      });
    },
    //重置添加表单
    addParamsClosed() {
      this.$refs.addParamsRef.resetFields();
    },
    //展示要修改的参数信息
    show_Params(params) {
      this.paramsInfo = params;
      // console.log(this.paramsInfo);
      this.editParamsDislogVisible = true;
      this.editParamsForm.attr_name = params.attr_name;
    },
    //点击确定修改参数
    async editParams() {
      let res = await this.axios.put(
        `categories/${this.catId}/attributes/${this.paramsInfo.attr_id}`,
        { attr_name: this.editParamsForm.attr_name, attr_sel: this.activeName }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
      this.getTabCate();
      this.editParamsDislogVisible = false;
    },
    //点击确定删除参数
    async deleteParams(params) {
      let res = await this.axios.delete(
        `categories/${this.catId}/attributes/${params.attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除操作异常");
      }
      this.$message.success("删除成功");
      this.getTabCate();
    },
  },
  created() {
    this.getgoods_params();
  },
  computed: {
    //监听点击到的分类id
    catId() {
      if (this.selectedCatKeys.length == 3) {
        return this.selectedCatKeys[2];
      }
      return null;
    },
    //监听点击添加的文本内容
    addParamsText() {
      if (this.activeName == "many") {
        return "添加动态参数";
      } else {
        return "添加静态属性";
      }
    },
    //添加对话框中input文字
    addParamsName() {
      if (this.activeName == "many") {
        return "参数名称";
      } else {
        return "属性名称";
      }
    },
    //监听点击编辑的文本内容
    editParamsText() {
      if (this.activeName == "many") {
        return "修改动态参数";
      } else {
        return "修改静态属性";
      }
    },
    //添加对话框中input文字
    editParamsName() {
      if (this.activeName == "many") {
        return "参数名称";
      } else {
        return "属性名称";
      }
    },
  },
  components: {},
};
</script>

<style  lang="less">
.paramsBox {
  .el-breadcrumb {
    margin: 5px;
    span {
      color: white !important;
    }
  }
  .el-card {
    margin-top: 20px;
  }
  .catopt {
    margin: 15px 0;
  }
  .input-new-tag {
    width: 120px;
  }
}
</style>
