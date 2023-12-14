<template>
  <div class="rightsBox">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }" class="bread"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 数据展示 -->
      <el-table :data="rightslist" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag :type="typeArr[scope.row.level - 0]">{{
              levelArr[scope.row.level - 0]
            }}</el-tag></template
          >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      rightslist: [],
      levelArr: ["一级", "二级", "三级"],
      typeArr: ["", "success", "warning"],
    };
  },
  methods: {
    //获取权限列表
    async getrights() {
      let res = await this.axios.get("rights/list");
      console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("获取数据失败");
      }
      this.rightslist = res.data;
    },
  },
  created() {
    this.getrights();
  },
  components: {},
};
</script>

<style lang="less">
.el-breadcrumb {
  margin: 5px;
  span {
    color: white !important;
  }
}
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 15px;
}
</style>
