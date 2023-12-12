<template>
  <div>
    <img src="@/assets/jinglingBg2.08e04217.png" alt="" />
    <h3>欢迎来到<span>精灵购物</span>平台管理系统</h3>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="less">
img {
  width: 500px;
  position: absolute;
  left: 50%;
  top: 10%;
  transform: translateX(-43%);
}
h3 {
  display: block;
  font-size: 45px;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  margin-top: 300px;
  letter-spacing: 10px;
  color: #fff;
  span {
    color: rgb(6, 248, 252);
    font-size: 70px;
    font-family: 娃娃体;
  }
  text-align: center;
}
</style>
