<template>
  <div>
    <el-table :data="data" style="width: 100%">
      <!-- 多选框 -->
      <el-table-column
        v-if="showCheckbox"
        type="selection"
        width="55"
      ></el-table-column>

      <!-- 动态列 -->
      <el-table-column
        v-for="(column, index) in columns"
        :key="index"
        :label="column.label"
        :width="column.width"
        align="center"
      >
        <template #default="scope">
          <!-- 如果是icon列 -->
          <el-button
            v-if="column.isIcon"
            link
            type="primary"
            :icon="scope.row[column.prop]"
            @click="handleIconClick(scope.row)"
          ></el-button>
          <!-- 否则显示普通文本 -->
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>

      <!-- 操作栏 -->
      <el-table-column label="操作" fixed="right" width="180" align="center">
        <template #default="scope">
          <slot name="action" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 30, 40]"
    /> -->
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// import {
//   ElTable,
//   ElTableColumn,
//   ElPagination,
//   ElDropdown,
//   ElDropdownMenu,
//   ElDropdownItem,
// } from "element-plus";

const props = defineProps({
  // 表格列配置
  columns: Array,
  // 是否显示多选框
  showCheckbox: Boolean,
  // 数据源
  data: Array,
  // 总数
  // total: Number,
});

// 定义响应式数据
// const currentPage = ref(1);
// const pageSize = ref(10);

// 计算属性：分页后的数据
// const paginatedData = computed(() => {
//   const start = (currentPage.value - 1) * pageSize.value;
//   const end = start + pageSize.value;
//   return props.data.slice(start, end);
// });

// 方法定义
const handleIconClick = (row) => {
  console.log("Icon clicked", row);
};

// const handleSizeChange = (size) => {
//   pageSize.value = size;
//   currentPage.value = 1; // 切换每页数量时重置到第一页
// };

// const handleCurrentChange = (page) => {
//   currentPage.value = page;
// };
</script>
