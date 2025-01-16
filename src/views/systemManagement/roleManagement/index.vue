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
    label: "角色名称",
    prop: "name",
    type: "text",
    span: 3,
  },
  {
    label: "状态",
    prop: "states",
    placeholder: "请选择状态",
    type: "select",
    span: 9,
    options: [
      { label: "全部", value: "1" },
      { label: "停用", value: "2" },
      { label: "启用", value: "3" },
    ],
  },
  // 更多查询项...
];

const minWidth = "143px";
// 初始查询条件
const queryConditions = reactive({
  name: "",
  states: "",
});

// 处理搜索事件
const handleSearch = (conditions) => {
  console.log("执行查询:", conditions);
  // 这里可以调用API进行实际的查询操作
};
</script>
