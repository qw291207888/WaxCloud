<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
  // .el-container {
  //   height: 100vh;
  // }

  // .el-main {
  //   flex: 1;
  //   overflow: hidden;
  // }

  .el-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 60px;
  }

  .el-main {
    margin-top: 60px;
    overflow-y: auto; 
  }
</style>