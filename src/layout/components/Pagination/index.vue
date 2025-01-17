<template>
  <!-- 分页组件模板 -->
  <!-- @size-change="handleSizeChange"                     监听每页显示条目数变化事件 
    @current-change="handleCurrentChange"               监听当前页码变化事件 
    :current-page="currentPage"                         绑定当前页码 
    :page-size="pageSize"                               绑定每页显示条目数 
    :total="total"                                      绑定总条目数 
    layout="total, sizes, prev, pager, next, jumper"    定义分页组件布局 
    :page-sizes="[10, 20, 30, 40]"                      定义可选的每页条目数选项 
    v-bind="$attrs"                                     继承父组件传递的所有其他属性  -->
  <div class="pagination-contanier">
    <el-pagination
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, sizes, jumper"
      :page-sizes="[5, 10, 20, 30, 40]"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// 定义父组件传递的属性
const props = defineProps({
  total: {
    type: Number,
    required: true, // 总条目数是必需的
  },
  currentPage: {
    type: Number,
    default: 1, // 默认当前页码为第一页
  },
  pageSize: {
    type: Number,
    default: 10, // 默认每页显示10条记录
  },
});

// 定义子组件可以触发的事件
const emit = defineEmits([
  "update:currentPage", // 当前页码更新事件
  "update:pageSize", // 每页条目数更新事件
  "pagination", // 分页信息变更事件（包含当前页码和每页条目数）
]);

// 处理每页条目数变化
const handleSizeChange = (size) => {
  // 触发更新每页条目数的事件，并传递新的条目数
  emit("update:pageSize", size);
  // 触发分页信息变更事件，通知父组件当前页码和新的条目数
  emit("pagination", { currentPage: props.currentPage, pageSize: size });
};

// 处理当前页码变化
const handleCurrentChange = (page) => {
  // 触发更新当前页码的事件，并传递新的页码
  emit("update:currentPage", page);
  // 触发分页信息变更事件，通知父组件新的页码和当前的条目数
  emit("pagination", { currentPage: page, pageSize: props.pageSize });
};
</script>

<!-- 样式部分可以根据需要添加 -->
<style scoped>
.pagination-contanier {
  margin: 19px 0 0 0;
}
</style>
