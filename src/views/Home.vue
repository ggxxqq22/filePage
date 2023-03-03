<template>
  <div>
    <section class="title">
      <h2>计算社会科学中心数据共享平台</h2>
      <p>
        CSS数据共享平台依托云数据中心和基础网络设施，通过图形化的界面实现分布的、异构的、跨网络的各人员和部门之间的数据的交互共享，实现统一平台与各个方面的数据资源共享。按平台步骤发布的数据集可以选择集中到数据中心平台，也可以由数据拥有者自己保存，数据共享平台将统一标准向外提供数据的资源分布情况，使数据不再是私有的个人的，而是可复用的信息资源服务。
      </p>
      <p>
        用户可以在此平台发布自己拥有的数据集信息，也可以根据需求检索数据集，还可以发布数据集需求等，以此为基础实现数据的共享互通~
      </p>
    </section>
    <section class="router-container">
      <router-link to="/page"
      ><el-card :body-style="{ padding: '0px' }" shadow="always">
        <img src="@/assets/list.png" class="image" />
        <div style="padding: 14px 0; text-align: center">
          <span>数据集目录</span>
        </div>
      </el-card></router-link
      >
      <router-link to="/pub"
      ><el-card :body-style="{ padding: '0px' }" shadow="always">
        <img src="@/assets/pub.png" class="image" />
        <div style="padding: 14px 0; text-align: center">
          <span>发布数据集</span>
        </div>
      </el-card></router-link
      >
    </section>
  </div>
</template>

<script>
export default {
  name: "Home.vue"
};
</script>

<style scoped lang="less">

.title {
  margin: 60px auto;
  width: 1040px;
  height: 50%;
  h2 {
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 10px;
  }
  p {
    margin-top: 5px;
    //text-indent: 2em;
  }
}
::v-deep .el-card {
  width: 440px;
}
.router-container {
  width: 1040px;
  margin: 0 auto 100px;
  display: flex;
  justify-content: space-around;
}
.image {
  width: 100%;
  height: 240px;
  display: block;
}
</style>