<template>
  <el-container class="app-container">
    <el-header class="header" height="64px">
      <img src="@/assets/zjucss.png" id="main-logo" @click="goHome"/>
      <div id="title">CSS数据共享平台</div>
      <!--      <router-link :to="{ path : '/dataset' }">-->
      <!--        <div id="tips">数据集目录系统</div>-->
      <!--      </router-link>-->
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {};
  },
  methods: {
    goHome() {
      this.$router.push('/home')
    }
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: content-box;
  a {
    text-decoration: none;
  }
}
.app-container {
  width: 100%;
}
.el-header {
  background-color: #FFF;
  color: #333;
  line-height: 64px;
  display: flex;
  align-items: center;
  color: #7F879E;
  border: 1px solid #F3F3F3;
  box-shadow: 0px 0px 5px #999;
}
#main-logo {
  margin-left: 36px;
  width: 137px;
  height: 28px;
  cursor: pointer;
}
#tips {
  width: 140px;
  color: #67c441;
}
#title {
  font-size: 16px;
  margin-left: 50px;
  flex: 1;
  letter-spacing: 2px;
}
.el-main {
  background-color: #fdfdfd;
  min-height: calc(100vh - 64px);
  color: #333;
  padding: 0 0!important;
}
</style>
