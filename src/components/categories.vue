<template>
  <div class="categoodsBox">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据视图区域 -->
    <el-card>
      <!-- 添加功能 -->
      <el-button type="primary" @click="getParentCatlist">添加分类</el-button>
      <!-- 表格展示区域 -->
      <tree-table
        style="margin-top: 15px"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        :show-row-hover="false"
        border
      >
        <!-- 是否生效模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color: green"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序类别模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 数据操作模板 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showOrder(scope.row)"
            >编辑</el-button
          >

          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="删除该分类后仅可手动再次添加"
            @confirm="deleteOrder(scope.row)"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 6, 8, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 15px"
      >
      </el-pagination>
      <!-- 修改类型的对话框 -->
      <el-dialog title="修改分类" :visible.sync="ediaDiglogVisible" width="50%">
        <el-form :model="order_Form" :rules="orderRules" ref="order_FormRef">
          <el-form-item label="类别名称" prop="cat_name" label-width="90px">
            <el-input v-model="order_Form.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ediaDiglogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ediaOrder">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDiglogVisible"
        width="50%"
        @close="resetAddDiglog"
      >
        <el-form :model="addForm" :rules="addRules" ref="addFormRef">
          <el-form-item label="类别名称" prop="cat_name" label-width="90px">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" label-width="90px">
            <el-cascader
              v-model="parentArr"
              :options="parentcatlist"
              :props="{
                expandTrigger: 'hover',
                children: 'children',
                label: 'cat_name',
                value: 'cat_id',
                checkStrictly: 'true',
              }"
              @change="parentCatchange"
              style="width: 100%"
              :clearable="true"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDiglogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrder">确 定</el-button>
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
      // 父级分类数据列表
      parentcatlist: [],
      //选中的父级分类id数组
      parentArr: [],
      //商品数据列表
      catelist: [],
      //请求参数
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      //列表指定的列定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          //当前列的自定义模板名称
          template: "isok",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //修改分类对话框的显示
      ediaDiglogVisible: false,
      //修改类别名称对象
      order_Form: {},
      // 修改类名规则
      orderRules: {
        cat_name: {
          required: true,
          message: "请输入类别名称",
          trigger: "blur",
        },
      },
      //添加分类对话框的显示
      addDiglogVisible: false,
      //添加分类对象
      addForm: {
        cat_name: "",
        //父级分类的id
        cat_pid: 0,
        //默认添加一级分类
        cat_level: 0,
      },
      //添加分类对象表单规则
      addRules: {
        cat_name: {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      },
    };
  },
  methods: {
    //获取数据列表
    async getcatelist() {
      let res = await this.axios.get("categories", { params: this.querInfo });
      if (res.meta.status != 200) {
        return this.$message.error("获取商品数据失败");
      }
      this.total = res.data.total;
      this.catelist = res.data.result;
      // console.log(this.catelist);
    },
    //分页功能
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.querInfo.pagesize = val;
      this.getcatelist();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.querInfo.pagenum = val;
      this.getcatelist();
    },
    //展示当前类别的信息
    showOrder(order) {
      this.ediaDiglogVisible = true;
      this.order_Form = order;
      // console.log(order);
      // console.log(this.order_Form.cat_name);
    },
    // 点击确认修改类别信息
    async ediaOrder() {
      let res = await this.axios.put("categories/" + this.order_Form.cat_id, {
        cat_name: this.order_Form.cat_name,
      });
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("更改失败");
      }
      this.$message.success("更改类别名称成功");
      this.getcatelist();
      this.ediaDiglogVisible = false;
    },
    //删除分类
    async deleteOrder(order) {
      let res = await this.axios.delete("categories/" + order.cat_id);
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message("异常情况，删除失败");
      }
      this.getcatelist();
      this.$message.success("删除成功");
    },
    //获取父级分类列表
    async getParentCatlist() {
      let res = await this.axios.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status != 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentcatlist = res.data;
      this.addDiglogVisible = true;
      console.log(this.parentcatlist);
    },
    //选择项变化时触发&赋值添加请求的参数
    parentCatchange() {
      this.addForm.cat_level =
        this.parentArr.length == 0 ? 0 : this.parentArr.length == 1 ? 1 : 2;
      if (this.parentArr.length != 0) {
        this.addForm.cat_pid = this.parentArr[this.parentArr.length - 1];
      }
      // console.log(this.parentArr, this.addForm.cat_pid, this.addForm.cat_level);
    },
    //点击确定添加分类
    async addOrder() {
      let res = await this.axios.post("categories", this.addForm);
      // console.log(res);
      if (res.meta.status != 201) {
        return this.$message.error("添加分类失败");
      }
      this.getcatelist();
      this.addDiglogVisible = false;
      this.$message.success("添加分类成功");
      this.$refs.addFormRef.resetFields();
      this.parentArr = [];
      this.addForm.cat_level = 0;
      this.addForm.cat_pid = 0;
    },
    //关闭添加对话框的重置
    resetAddDiglog() {
      this.$refs.addFormRef.resetFields();
      this.parentArr = [];
    },
  },
  created() {
    this.getcatelist();
  },
  components: {},
};
</script>

<style  lang="less">
.el-breadcrumb {
  margin: 5px;
  span {
    color: white !important;
  }
}
.el-card {
  margin-top: 20px;
}
</style>
