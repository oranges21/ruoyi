<template>
  <div>
    <QueryForm
      :items="queryItems"
      :minWidth="minWidth"
      :isbutton="false"
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
          <el-dropdown v-if="row.actions && row.actions.length > 3">
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
  { prop: "id", label: "编号", width: "80" },
  { prop: "account", label: "账号", width: "110" },
  { prop: "name", label: "姓名", width: "110" },
  { prop: "email", label: "邮箱", width: "120" },
  { prop: "adddate", label: "添加时间", width: "120" },
  { prop: "logoutdata", label: "最后登录", width: "120" },
  { prop: "useing", label: "是否启用", width: "110" },
  // { prop: "iconClass", label: "图标", isIcon: true }, // 假设这是icon列
  // ...其他列配置
];

const rawTableData = [
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
  {
    id: "1",
    account: "test",
    name: "测试账号",
    email: "test@qq.com",
    adddate: "2025-01-01",
    logoutdata: "2025-01-01",
    useing: "是",
    // date: "2025-01-01",
    // iconClass: "Edit", // 假设这是成功状态的图标
    actions: ["分配角色", "编辑", "删除"],
  },
];

const totalItems = ref(rawTableData.length); // 总条目数

//新增事件
const handleAdd = () => {};
//批量删除事件
const handleDelet = () => {};
// 分页相关的响应式数据
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性：分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return rawTableData.slice(start, end);
});

// 获取数据的方法（模拟数据请求）
const fetchData = ({ currentPage, pageSize }) => {
  // 在这里可以进行实际的数据获取逻辑，例如从服务器拉取分页数据
  console.log(`Fetching page ${currentPage} with size ${pageSize}`);
  // 更新当前页面和每页大小
  currentPage.value = currentPage;
  pageSize.value = pageSize;
};

// 监听总条目数变化时重新获取数据
watch(
  () => totalItems.value,
  () => {
    fetchData({ currentPage: currentPage.value, pageSize: pageSize.value });
  }
);
</script>

<style lang="scss" scoped></style>
