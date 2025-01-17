<template>
  <div>
    <QueryForm
      :items="queryItems"
      :minWidth="minWidth"
      v-model="queryConditions"
      @search="handleSearch"
    />
  </div>
</template>

<script setup>
import QueryForm from "@/layout/components/SearchBar";
import { reactive } from "vue";

// 查询条件配置
const queryItems = [
  {
    label: "设备名称",
    prop: "name",
    type: "text",
    span: 3,
  },
  // 更多查询项...
];

const minWidth = "143px";
// 初始查询条件
const queryConditions = reactive({
  name: "",
});

// 处理搜索事件
const handleSearch = (conditions) => {
  console.log("执行查询:", conditions);
  // 这里可以调用API进行实际的查询操作
};
</script>
