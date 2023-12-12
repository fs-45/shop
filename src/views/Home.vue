
<template>
  <div class="homeBox">
    <el-container>
      <el-header>
        <div class="left">
          <img
            class="logo"
            src="@/assets/jingling_logo.0ada255b.png"
            alt=""
            @click="goHome"
          />
          <span>精灵购物平台管理系统</span>
        </div>
        <div class="right">
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定要退出登录吗？"
            @confirm="outLogin"
          >
            <i class="el-icon-switch-button" slot="reference"></i>
          </el-popconfirm>
        </div>
      </el-header>
      <el-container class="main">
        <el-aside :width="iscollapse ? '65px' : '200px'">
          <div class="changeCollapse" @click="changeCollapse">|||</div>
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#303641"
            text-color="#fff"
            active-text-color="#349EFF"
            unique-opened
            router
            :collapse="iscollapse"
            :collapse-transition="false"
            :default-active="activePath"
          >
            <el-submenu
              v-for="(item, index) in this.menus"
              :key="item.id"
              :index="item.path.toString()"
            >
              <template slot="title">
                <i :class="iconList[index]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                v-for="childitem in item.children"
                :key="childitem.id"
                :index="childitem.path.toString()"
                @click="saveNavState(childitem.path)"
              >
                <i class="el-icon-menu"></i>
                {{ childitem.authName }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      menus: [],
      iconList: [
        "el-icon-s-goods",
        "el-icon-s-help",
        "el-icon-s-cooperation",
        "el-icon-s-shop",
        "el-icon-s-claim",
      ],
      iscollapse: false,
      //被激活的链接地址
      activePath: "",
    };
  },
  methods: {
    goHome() {
      this.activePath = "";
      this.$router.push("/home").catch((erro) => "");
    },
    outLogin() {
      sessionStorage.removeItem("token");
      this.$router.push("/login").catch((erro) => "");
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
    },
    //侧边栏的方法
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    //折叠侧边栏
    changeCollapse() {
      this.iscollapse = !this.iscollapse;
    },
    //获取列表数据
    async getmenus() {
      let res = await this.axios.get("/menus");
      // console.log(res);
      if (res.meta.status == 200) {
        this.menus = res.data;
      }
    },
  },
  created() {
    this.activePath = sessionStorage.getItem("activePath");
  },

  mounted() {
    this.getmenus();
  },
  components: {},
};
</script>

<style scoped lang="less">
.homeBox {
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      background-color: #353b3e;
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        color: white;
        font-size: 22px;
        font-style: "宋体";
        letter-spacing: 4px;
        .logo {
          width: 50px;
          height: 50px;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        // color: white;
        font-size: 30px;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .main {
      height: calc(vh-60px);

      .el-aside {
        background-color: #303641;
        .changeCollapse {
          text-align: center;
          // width: 100%;
          color: white;
          font-size: 20px;
          letter-spacing: 4px;
          background-color: #475061;
          &:hover {
            cursor: pointer;
          }
        }
        .el-menu {
          border: none;
        }
      }
      .el-main {
        background: url("@/assets/bj.be0436d4.jpg");
      }
    }
  }
}
</style>
