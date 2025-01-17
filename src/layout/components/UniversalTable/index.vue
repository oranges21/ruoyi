<template>
  <el-scrollbar>
    <el-table :data="data" style="width: 100%; height: 280px">
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
        :min-width="column.width"
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
  </el-scrollbar>
</template>

<script setup>
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
// 方法定义
const handleIconClick = (row) => {
  console.log("Icon clicked", row);
};
</script>

<style scoped>
:deep(.el-table__body .el-table__row td:last-child) {
  /* font-size: 16px; 字体大小 */
  color: #66b1ff; /* 字体颜色 */
  cursor: pointer;
}
</style>
