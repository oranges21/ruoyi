<template>
  <div>
    <QueryForm
      :items="queryItems"
      :minWidth="minWidth"
      :isbutton="false"
      v-model="queryConditions"
      @search="handleSearch"
    />
    <el-card>
      <UniversalTable
        :columns="tableColumns"
        :data="tableData"
        :total="totalItems"
        :show-checkbox="true"
      >
        <template #action="{ row }">
          <!-- 自定义操作栏 -->
          <el-dropdown v-if="row.actions && row.actions.length > 2">
            <span class="el-dropdown-link"
              >更多<i class="el-icon-arrow-down el-icon--right"></i
            ></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(action, index) in row.actions"
                  :key="index"
                  >{{ action }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-row v-else>
            <el-col
              v-for="(action, index) in row.actions"
              :key="index"
              :span="24 / row.actions.length"
              >{{ action }}</el-col
            >
          </el-row>
        </template>
      </UniversalTable>
    </el-card>
  </div>
</template>

<script setup>
import UniversalTable from "@/layout/components/UniversalTable/index.vue";
import QueryForm from "@/layout/components/SearchBar";

const minWidth = "143px";
// 查询条件配置
const queryItems = [
  {
    label: "账号名称",
    placeholder: "请输入",
    prop: "name",
    type: "text",
    span: 3,
  },
  // 更多查询项...
];
// 初始查询条件
const queryConditions = reactive({
  name: "",
});
// 处理搜索事件
const handleSearch = (conditions) => {
  console.log("执行查询:", conditions);
  // 这里可以调用API进行实际的查询操作
};
const tableColumns = [
  { prop: "date", label: "日期", width: "150" },
  { prop: "name", label: "姓名", width: "120" },
  { prop: "iconClass", label: "图标", isIcon: true }, // 假设这是icon列
  // ...其他列配置
];

const tableData = [
  {
    date: "2025-01-01",
    name: "张三",
    iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["编辑", "删除"],
  },
  {
    date: "2025-01-02",
    name: "李四",
    iconClass: "Edit", // 假设这是警告状态的图标
    actions: ["编辑"],
  },
  {
    date: "2025-01-03",
    name: "王五",
    iconClass: "Edit", // 假设这是错误状态的图标
    actions: [],
  },
  {
    date: "2025-01-04",
    name: "赵六",
    iconClass: "Edit", // 假设这是信息状态的图标
    actions: ["查看详情", "编辑", "删除"],
  },
  {
    date: "2025-01-05",
    name: "孙七",
    iconClass: "Edit", // 假设这是确认状态的图标
    actions: ["编辑", "删除"],
  },
];

const totalItems = 100; // 总条目数
</script>

<style lang="scss" scoped>
.el-card {
  margin: 15px;
  border-radius: 5px;
}
</style>
