<template>
  <div>
    <QueryForm
      :items="queryItems"
      :minWidth="minWidth"
      v-model="queryConditions"
      @search="handleSearch"
    />
    <el-card class="table-contanier">
      <div class="button-contanier">
        <el-button type="primary" @click="handleAdd">新建</el-button>
        <el-button @click="handleDelet">批量删除</el-button>
      </div>

      <UniversalTable
        class="table"
        :columns="tableColumns"
        :data="paginatedData"
        :show-checkbox="true"
      >
        <template #action="{ row }">
          <!-- 自定义操作栏 -->
          <el-dropdown v-if="row.actions && row.actions.length > 4">
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
              :span="12"
              >{{ action }}</el-col
            >
          </el-row>
        </template>
      </UniversalTable>
      <pagination
        :total="totalItems"
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        @pagination="fetchData"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import UniversalTable from "@/layout/components/UniversalTable/index.vue";
import QueryForm from "@/layout/components/SearchBar";
import Pagination from "@/layout/components/Pagination";
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
const rawTableData = [
  {
    id: "1",
    rolename: "test",
    describle: "测试账号",
    usernumber: "test@qq.com",
    adddate: "2025-01-01",
    useing: "是",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配菜单", "分配资源", "编辑", "删除"],
  },
];
const minWidth = "143px";
// 初始查询条件
const queryConditions = reactive({
  name: "",
  states: "",
});
const tableColumns = [
  { prop: "id", label: "编号", width: "80" },
  { prop: "rolename", label: "角色名称", width: "110" },
  { prop: "describle", label: "描述", width: "150" },
  { prop: "usernumber", label: "用户数", width: "80" },
  { prop: "adddate", label: "添加时间", width: "120" },
  { prop: "useing", label: "是否启用", width: "110" },
  // { prop: "iconClass", label: "图标", isIcon: true }, // 假设这是icon列
  // ...其他列配置
];
// 计算属性：分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return rawTableData.slice(start, end);
});
const totalItems = ref(rawTableData.length); // 总条目数
// 分页相关的响应式数据
const currentPage = ref(1);
const pageSize = ref(10);
// 获取数据的方法（模拟数据请求）
const fetchData = ({ currentPage, pageSize }) => {
  // 在这里可以进行实际的数据获取逻辑，例如从服务器拉取分页数据
  console.log(`Fetching page ${currentPage} with size ${pageSize}`);
  // 更新当前页面和每页大小
  currentPage.value = currentPage;
  pageSize.value = pageSize;
};
// 处理搜索事件
const handleSearch = (conditions) => {
  console.log("执行查询:", conditions);
  // 这里可以调用API进行实际的查询操作
};
</script>
