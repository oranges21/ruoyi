<template>
  <Drawer v-model:visible="drawerVisible"></Drawer>
  <!-- 导航栏容器 -->
  <div class="navbar">
    <!-- 汉堡菜单按钮，用于在移动端或侧边栏关闭时显示/隐藏侧边栏 -->
    <hamburger
      id="hamburger-container"
      :is-active="appStore.sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- 面包屑导航，当设置中未启用顶部导航时显示 -->
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="!settingsStore.topNav"
    />

    <!-- 顶部菜单，当设置中启用了顶部导航时显示 -->
    <top-nav
      id="topmenu-container"
      class="topmenu-container"
      v-if="settingsStore.topNav"
    />

    <!-- 右侧菜单容器 -->
    <div class="right-menu" id="yujing">
      <!-- 如果不是移动设备，则显示以下内容 -->
      <template v-if="appStore.device !== 'mobile'">
        <!-- 消息通知图标 -->
        <img
          :src="userStore.avatar"
          class="yujingclass"
          @click="
            () => {
              drawerVisible = !drawerVisible;
            }
          "
        />
        <div
          class="ellipsis"
          @click="
            () => {
              drawerVisible = !drawerVisible;
            }
          "
        >
          {{ longText }}
        </div>
        <el-tooltip content="消息通知" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect notification-icon">
            <el-badge :value="3" class="item" type="warning">
              <el-icon class="bold-icon"><Bell /></el-icon>
            </el-badge>
          </div>
        </el-tooltip>
      </template>

      <!-- 用户头像和下拉菜单 -->
      <div class="avatar-container">
        <el-dropdown
          @command="handleCommand"
          class="right-menu-item hover-effect"
          trigger="click"
        >
          <div class="avatar-wrapper">
            <!-- 显示用户的头像 -->
            <img :src="userStore.avatar" class="user-avatar" />

            <span class="admin-text">管理员</span>
            <!-- 下拉箭头 -->
            <!-- <el-icon><caret-bottom /></el-icon> -->
          </div>
          <!-- 下拉菜单内容 -->
          <template #dropdown>
            <el-dropdown-menu>
              <!-- 路由链接到个人中心页面 -->
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <!-- 设置布局选项 -->
              <el-dropdown-item
                command="setLayout"
                v-if="settingsStore.showSettings"
              >
                <span>布局设置</span>
              </el-dropdown-item>
              <!-- 退出登录 -->
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
// 引入各个组件
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";

// 引入pinia状态管理仓库
import useAppStore from "@/store/modules/app";
import useUserStore from "@/store/modules/user";
import useSettingsStore from "@/store/modules/settings";
import Drawer from "@/components/Drawer/index.vue";

// 获取状态管理仓库实例
const appStore = useAppStore();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const longText = ref(
  "预警信息：发现嫌疑人张三出现在XXX区域，请相关部门及时应对"
);
const drawerVisible = ref(false); // 定义初始布尔值
const yujing = ref(false); // 或者 false
function updateAlertVisibility() {
  const alertMessage = document.getElementById("yujing");
  if (alertMessage) {
    if (yujing.value) {
      // 如果 yujing 为 true，则添加 'blink' 类以启用闪烁效果
      alertMessage.classList.add("blink");
    } else {
      // 如果 yujing 不是 true，则移除 'blink' 类以禁用闪烁效果
      alertMessage.classList.remove("blink");
    }
  }
}

onMounted(() => {
  updateAlertVisibility();
});

// 定义方法来切换侧边栏
function toggleSideBar() {
  appStore.toggleSideBar();
}

// 定义方法处理下拉菜单命令
function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

// 退出登录逻辑
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = "/login";
      });
    })
    .catch(() => {});
}

// 触发父级组件的setLayout事件
const emits = defineEmits(["setLayout"]);
function setLayout() {
  emits("setLayout");
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .item {
    margin-top: 10px;
    margin-right: 30px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    margin-right: 9px;
    .yujingclass {
      width: 40px;
      height: 40px;
      margin-top: 5px;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: flex;
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      // padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: var(--navbar-text);
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      &.theme-switch-wrapper {
        display: flex;
        align-items: center;

        svg {
          transition: transform 0.3s;

          &:hover {
            transform: scale(1.15);
          }
        }
      }
      &.notification-icon {
        margin-left: 3px; // 可根据需要调整间距
        padding-bottom: 8px;
      }
      .bold-icon {
        svg {
          stroke-width: 25; // 设置描边宽度，具体值可以根据需要调整
          stroke: currentColor; // 使用当前文本颜色作为描边颜色
        }
      }
      .el-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%; // 确保图标高度与父级一致
        width: 24px; // 设置宽度，使图标居中
      }
    }

    .avatar-container {
      margin-right: 0px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // padding: 0 15px;
        height: 100%;
        cursor: pointer;
        padding-bottom: 7px;
        .admin-text {
          margin-left: 10px;
          font-size: 12px;
        }
        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .ellipsis {
    white-space: nowrap; /* 防止文本换行 */
    overflow: hidden; /* 隐藏溢出的内容 */
    text-overflow: ellipsis; /* 溢出部分用省略号表示 */
    width: 200px; /* 设置一个固定的宽度 */
    margin-right: 12px;
    font-size: 15px;
    color: #faad14;
    margin-left: 9px;
  }
}
/* 添加一个专门用于闪烁的类 */
.blink {
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
