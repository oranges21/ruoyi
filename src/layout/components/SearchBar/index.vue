<template>
  <!-- 使用 el-form 创建一个表单，并绑定相关属性 -->
  <!-- ref="queryFormRef"     绑定表单引用，方便操作DOM -->
  <!--  :inline="true"                              设置表单为行内样式  -->
  <!-- :model="formModel"                          绑定表单模型  -->
  <!-- class="query-form"                          添加自定义类名  -->
  <!-- @submit.prevent="handleSubmit"              提交表单时调用 handleSubmit 方法，并阻止默认行为  -->
  <div>
    <el-card>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="formModel"
        class="query-form"
        @submit.prevent="handleSubmit"
      >
        <!-- 使用 el-row 和 el-col 来创建响应式栅格布局 -->
        <el-row :gutter="0">
          <!-- 设置列之间的间距 -->
          <!-- 遍历 queryItems 数组，生成多个表单项 -->
          <!-- :key="index"                            确保每个元素有唯一的 key  -->
          <!--  :span="item.span || 6"                  每个表单项占据的栅格宽度，默认为6  -->
          <el-col
            v-for="(item, index) in items"
            :key="index"
            :span="item.span"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="6"
          >
            <el-form-item :label="item.label" :prop="item.prop">
              <!-- 动态渲染不同类型的表单元素 -->
              <!-- :is="getComponent(item)"            根据 item.type 动态选择组件  -->
              <!-- v-bind="getItemProps(item)"         绑定表单项的属性  -->
              <!-- v-model="formModel[item.prop]"      双向绑定表单项值到 formModel  -->
              <!-- @change="handleItemChange(item, $event)"  表单项变化时触发事件  -->
              <component
                :is="getComponent(item)"
                v-bind="getItemProps(item)"
                v-model="formModel[item.prop]"
                @change="handleItemChange(item, $event)"
                :style="{ minWidth: minWidth }"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </component>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :span="3">
            <el-form-item>
              <el-button type="primary" native-type="submit">搜索</el-button>
              <!-- 查询按钮 -->
              <el-button @click="handleReset">重置</el-button>
              <!-- 重置按钮 -->
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 操作按钮：查询和重置 -->
      </el-form>
      <el-button
        class="button"
        type="primary"
        native-type="submit"
        v-if="isbutton"
        >下载日志</el-button
      >
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { ElMessage } from "element-plus";
// 定义 props 接收父组件传递的数据
const props = defineProps({
  items: {
    type: Array, // items 是一个数组
    required: true, // 必须提供 items 属性
  },
  modelValue: {
    type: Object, // modelValue 是一个对象
    default: () => ({}), // 默认为空对象
  },
  minWidth: {
    type: String,
    default: "143px",
  },
  isbutton: {
    type: Boolean,
    default: false,
  },
});

// 定义 emits 发送事件给父组件
const emit = defineEmits(["update:modelValue", "search"]);

// 初始化表单模型，确保与父组件传递的 modelValue 同步
const formModel = reactive({ ...props.modelValue });

// 监听父组件传递的 modelValue 的变化，并同步更新内部状态
watch(
  () => props.modelValue,
  (newValue) => {
    Object.assign(formModel, newValue); // 使用 Object.assign 合并新旧值
  },
  { deep: true } // 深度监听，保证对象内部属性的变化也能被捕捉
);

// 获取对应的组件类型
const getComponent = (item) => {
  const types = {
    text: "el-input", // 文本输入框
    select: "el-select", // 下拉选择器
    date: "el-date-picker", // 日期选择器
    // 可以继续添加其他类型...
  };
  return types[item.type] || "el-input"; // 如果未指定类型，则默认为文本输入框
};
console.log("getComponent:", getComponent("text"));

// 获取项的属性，返回一个包含所有需要属性的对象
const getItemProps = (item) => {
  return {
    placeholder: item.placeholder || `请输入${item.label}`, // 设置占位符文本
    clearable: item.clearable !== false, // 是否允许清除内容
    ...(item.type === "select" // 如果是下拉选择器
      ? { filterable: item.filterable !== false } // 是否可过滤选项
      : {}),
    ...item.props, // 其他自定义属性
  };
};

// 处理表单项变化
const handleItemChange = (item, value) => {
  if (item.change) item.change(value); // 如果提供了 change 回调函数，则调用它
};

// 提交表单
const handleSubmit = () => {
  emit("update:modelValue", { ...formModel }); // 更新父组件的状态
  emit("search", { ...formModel }); // 触发搜索事件，传递当前表单数据
};

// 重置表单
const handleReset = () => {
  for (let key in formModel) {
    formModel[key] = ""; // 清空所有表单项
  }
  emit("update:modelValue", {}); // 通知父组件清空表单数据
  emit("search", {}); // 触发搜索事件，传递空对象表示重置
};
</script>

<style scoped lang="scss">
.el-card {
  margin: 15px;
  border-radius: 5px;
  padding: 0px;
  position: relative;
  .button {
    position: absolute;
    top: 23px;
    right: 16px;
  }
}

/* 使用媒体查询进一步优化样式 */
@media (max-width: 768px) {
  .query-form .el-col {
    margin-bottom: 15px; /* 在小屏幕上增加间距 */
  }
}
:deep(.el-card__body) {
  padding: 23px 20px 7px 20px !important;
}
</style>
