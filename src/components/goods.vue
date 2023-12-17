<template>
  <div class="goodslistBox">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据展示区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="goodInfo.query"
            clearable
            @clear="getGoodsList"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button
          ></el-input>
        </el-col>
        <el-col :span="6" style="margin-left: 15px">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="showGoods(scope.row)"
            ></el-button>

            <el-popconfirm
              confirm-button-text="是的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除该商品吗？"
              @confirm="deleteGoods(scope.row)"
            >
              <el-button
                icon="el-icon-delete"
                type="danger"
                size="mini"
                slot="reference"
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[4, 6, 8, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 修改商品对话框 -->
      <el-dialog title="编辑" :visible.sync="editDiglogVisible" width="50%">
        <el-form :model="editGoods" ref="editGoodsRef" :rules="editGoodsRules">
          <el-form-item label="商品名称" label-width="100px" prop="goods_name">
            <el-input v-model="editGoods.goods_name"></el-input>
          </el-form-item>
          <el-form-item
            label="商品价格(元)"
            label-width="100px"
            prop="goods_price"
          >
            <el-input v-model="editGoods.goods_price"></el-input>
          </el-form-item>
          <el-form-item
            label="商品重量"
            label-width="100px"
            prop="goods_weight"
          >
            <el-input v-model="editGoods.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px" prop="add_time">
            <el-input v-model="editGoods.add_time"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDiglogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGood">确 定</el-button>
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
      //搜索框value
      searchGoods: "",
      //商品列表
      goodslist: [],
      total: 0,
      //请求信息
      goodInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //修改商品对话框的显示
      editDiglogVisible: false,
      //获取当前修改的信息
      editGoods: {},
      //修改商品的表单信息
      editGoodsRules: {
        goods_name: {
          required: true,
          message: "请输入名称",
          trigger: "blur",
        },
        goods_price: {
          required: true,
          message: "请输入价格",
          trigger: "blur",
        },
        goods_weight: {
          required: true,
          message: "请输入重量",
          trigger: "blur",
        },
        add_time: {
          required: true,
          message: "请输入时间",
          trigger: "blur",
        },
      },
    };
  },

  methods: {
    //分页功能
    handleSizeChange(val) {
      this.goodInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.goodInfo.pagenum = val;
      this.getGoodsList();
    },
    //获取数据列表
    async getGoodsList() {
      let res = await this.axios.get(`goods`, {
        params: this.goodInfo,
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return;
      }
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },
    //展示要修改的商品信息
    showGoods(goods) {
      this.editDiglogVisible = true;
      this.editGoods = goods;
      console.log(goods);
    },
    //点击确认修改商品信息
    async editGood() {
      console.log(1);
      let res = await this.axios.put(`goods/${this.editGoods.goods_id}`, {
        goods_name: this.editGoods.goods_name,
        goods_price: this.editGoods.goods_price,
        goods_weight: this.editGoods.goods_weight,
        goods_number: this.editGoods.goods_number,
      });
      console.log(res);
      this.editDiglogVisible = false;
    },
    //点击确认删除商品
    async deleteGoods(goods) {
      let res = await this.axios.delete("goods/" + goods.goods_id);
      if (res.meta.status !== 200) {
        return;
      }
      this.getGoodsList();
    },
    //跳转增加商品页面
    goAddGoods() {
      this.$router.push({ name: "addGoods" });
    },
  },

  created() {
    this.getGoodsList();
  },
  components: {},
};
</script>

<style scoped lang="less">
.goodslistBox {
  .el-breadcrumb {
    margin: 5px;
    span {
      color: white !important;
    }
  }
  .el-card {
    margin-top: 20px;
  }
}
</style>
