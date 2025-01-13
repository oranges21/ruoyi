<template>
  <el-drawer
    v-model="props.visible"
    :direction="direction"
    @close="handleClose"
  >
    <template #header>
      <h4>set title by slot</h4>
    </template>
    <template #default> </template>
    <template #footer> </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import type { DrawerProps } from "element-plus";
import { ref, watch, defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["update:visible"]);
// 创建一个计算属性来同步父组件的 visible 状态
// const localVisible = computed({
//   get: () => props.visible,
//   set: (value) => emit("update:visible", value),
// });
const direction = ref<DrawerProps["direction"]>("rtl");

// 监听 close 事件
function handleClose() {
  emit("update:visible", false);
}

watch(
  () => props.visible,
  (newVal) => {
    console.log("Drawer visibility changed:", newVal);
    // 根据新的布尔值执行相应操作
  }
);
</script>
