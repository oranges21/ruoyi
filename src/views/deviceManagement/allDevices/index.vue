<template>
  <div class="app-container">
    <div class="tongji">
      <div class="first"></div>
      <div class="second"></div>
      <div class="third"></div>
    </div>
    <el-card style="max-width: 480px">
      <p v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</p>
    </el-card>
  </div>
</template>

<script setup name="User"></script>
<style lang="scss">
.tongji {
  width: 100%;
  height: 138px;
  // border: 1px solid gray;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .first,
  .second,
  .third {
    width: 30%;
    height: 103px;
    border: 1px solid red;
  }
}
</style>
