<template>
  <div>
    <QueryForm
      :items="queryItems"
      :minWidth="minWidth"
      :isbutton="true"
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
    label: "操作信息",
    placeholder: "请输入",
    prop: "message",
    type: "text",
    span: 3,
  },
  {
    label: "用户名",
    prop: "message",
    placeholder: "请输入",
    type: "text",
    span: 3,
  },
  {
    label: "操作时间",
    prop: "message",
    type: "date",
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
