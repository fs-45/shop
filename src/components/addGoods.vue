<template>
  <div class="addGoodsBox">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤展示 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="addFormRules"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          style="auto"
          v-model="activeIndex"
          :before-leave="beforeTableave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
                :clearable="true"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染参数 -->
            <el-form-item
              v-for="(item, i) in manyTabDate"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(item2, i2) in item.attr_vals"
                  :key="i2"
                  :label="item2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染属性 -->
            <el-form-item
              v-for="(item, i) in onlyTabDate"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://www.chenfuguo.cn:8899/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerobj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" style="margin-top: 15px" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览对话框 -->
      <el-dialog title="提示" :visible.sync="picDialogVisible" width="50%">
        <img :src="previewPath" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  props: {},
  data() {
    return {
      //同步监听步骤的第几步
      activeIndex: "0",
      //添加表单对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //商品所属的分类
        goods_cat: [],
        //图片的路径
        pics: [],
        //商品的详情描述
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      },
      //商品分类列表
      catelist: [],
      //对应商品分类的参数
      manyTabDate: [],
      //对应商品分类的属性
      onlyTabDate: [],
      //图片上传组件的请求头
      headerobj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //预览图片路径
      previewPath: "",
      //预览图片对话框的显示
      picDialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有商品分类
    async getCateList() {
      let res = await this.axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类失败");
      }

      this.catelist = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },
    //tabs切换时触发
    beforeTableave(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName);
      // return false;
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    //点击 tab选项
    async tabClicked() {
      // console.log(this.activeIndex);
      if (this.activeIndex == "1") {
        //获取商品分类参数
        let res = await this.axios.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: "many",
          },
        });
        if (res.meta.status !== 200) {
          this.$message.error("获取参数失败");
        }
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split("，") : [];
        });
        this.manyTabDate = res.data;
      } else if (this.activeIndex == "2") {
        //获取商品分类参数
        let res = await this.axios.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: "only",
          },
        });
        if (res.meta.status !== 200) {
          this.$message.error("获取参数失败");
        }
        // res.data.forEach((item) => {
        //   item.attr_vals = item.attr_vals ? item.attr_vals.split("，") : [];
        // });
        this.onlyTabDate = res.data;
      }
    },
    //图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.picDialogVisible = true;
    },
    //删除图片
    handleRemove(file) {
      let i = this.addForm.pics.findindex((x) => {
        x == file.response.data.tmp_path;
      });
      this.addForm.pics.splice(i, 1);
    },
    //监听图片上传成功的事件
    handleSuccess(response) {
      if (response.meta.status !== 200) {
        return this.$message.error("图片上传失败");
      }
      let picinfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picinfo);
    },
    //点击添加商品按钮
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("添加失败");
        }
        let form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        //处理动态参数
        this.manyTabDate.forEach((item) => {
          let newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(""),
          };
          this.addForm.attrs.push(newinfo);
        });
        //处理静态属性
        this.onlyTabDate.forEach((item) => {
          let newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newinfo);
        });
        form.attrs = this.addForm.attrs;
        let res = await this.axios.post("goods", form);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("创建商品失败,请检查商品名称是否为汉字");
        }
        thi.$message.success("创建成功");
        this.$router.push({ name: "goods" });
      });
    },
  },
  components: {},
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style  lang="less">
.addGoodsBox {
  .el-steps {
    margin: 15px auto;
  }
  .el-step_title {
    font-size: 40px !important;
  }
  .el-checkbox {
    margin: 0 !important;
    margin-right: 10px !important;
  }
  .ql-editor {
    height: 300px;
  }
}
</style>
