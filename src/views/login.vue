<template>
  <div class="login">
    <!-- 登录表单 -->
    <el-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">案件智能分析系统</h3>
      <!-- 登录页面标题 -->

      <!-- 用户名输入框 -->
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号"
        >
          <template #prefix>
            <!-- 自定义前缀图标 -->
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <!-- 自定义前缀图标 -->
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码输入框（仅当验证码功能开启时显示） -->
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <!-- 自定义前缀图标 -->
            <svg-icon
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
          <!-- 点击刷新验证码 -->
        </div>
      </el-form-item>

      <!-- 记住密码选项 -->
      <el-checkbox
        v-model="loginForm.rememberMe"
        style="margin: 0px 0px 25px 0px"
        >记住密码</el-checkbox
      >

      <!-- 登录按钮 -->
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <!-- 显示文本：未加载时 -->
          <span v-else>登 录 中...</span>
          <!-- 显示文本：加载中 -->
        </el-button>

        <!-- 注册链接（仅当注册功能开启时显示） -->
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'"
            >立即注册</router-link
          >
        </div>
      </el-form-item>
    </el-form>

    <!-- 底部版权信息 -->
    <div class="el-login-footer">
      <span>Copyright © 案件智能分析系统 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup>
import { getCodeImg } from "@/api/login"; // 导入获取验证码图片的API
import Cookies from "js-cookie"; // 导入管理Cookies的库
import { encrypt, decrypt } from "@/utils/jsencrypt"; // 导入加密解密工具
import useUserStore from "@/store/modules/user"; // 导入用户仓库

// 初始化用户仓库实例
const userStore = useUserStore();
const route = useRoute(); // 获取当前路由
const router = useRouter(); // 获取路由实例
const { proxy } = getCurrentInstance(); // 获取当前组件实例

// 定义响应式变量
const loginForm = ref({
  username: "admin", // 默认用户名
  password: "admin123", // 默认密码
  rememberMe: false, // 是否记住密码
  code: "", // 验证码
  uuid: "", // 验证码唯一标识符
});

// 定义表单验证规则
const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }],
};

const codeUrl = ref(""); // 验证码图片URL
const loading = ref(false); // 登录按钮加载状态
const captchaEnabled = ref(true); // 是否启用验证码功能
const register = ref(false); // 是否显示注册链接
const redirect = ref(undefined); // 登录后重定向路径

// 监听路由变化，更新重定向路径
watch(
  route,
  (newRoute) => {
    console.log("newRoute.query:", newRoute.query);
    redirect.value = newRoute.query && newRoute.query.redirect;
  },
  { immediate: true }
);

// 处理登录逻辑
function handleLogin() {
  proxy.$refs.loginRef.validate((valid) => {
    // 表单验证
    console.log("valid:", valid);
    if (valid) {
      loading.value = true; // 设置加载状态为true
      if (loginForm.value.rememberMe) {
        // 如果选择了记住密码
        Cookies.set("username", loginForm.value.username, { expires: 30 }); // 设置用户名cookie
        Cookies.set("password", encrypt(loginForm.value.password), {
          expires: 30,
        }); // 加密并设置密码cookie
        Cookies.set("rememberMe", loginForm.value.rememberMe, { expires: 30 }); // 设置记住密码状态cookie
      } else {
        Cookies.remove("username"); // 否则移除用户名cookie
        Cookies.remove("password"); // 移除密码cookie
        Cookies.remove("rememberMe"); // 移除记住密码状态cookie
      }
      // 调用用户仓库的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          // 获取当前路由的查询参数（query parameters），这些是在URL中以问号后面跟随的形式出现的键值对。
          const query = route.query;
          console.log("query:", query);

          // 使用 Object.keys() 获取所有查询参数的键名，并通过 reduce() 方法遍历这些键名。
          // reduce() 方法用于累积一个初始值（这里是空对象 {}），并返回累积的结果。
          // 目的是创建一个新的对象 otherQueryParams，它包含了除 'redirect' 外的所有查询参数。
          const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
            // 如果当前键名不是 'redirect'，则将该键及其对应的值添加到累积对象 acc 中。
            if (cur !== "redirect") {
              acc[cur] = query[cur]; // 将非 'redirect' 参数复制到新的对象中
            }
            return acc; // 返回累积的对象
          }, {});
          console.log("otherQueryParams:", otherQueryParams);
          // 根据重定向路径或默认路径进行跳转：
          // - 如果存在 redirect.value，则使用它的值作为目标路径；
          // - 否则，默认跳转到根路径 '/'。
          // 在跳转时，保留其他查询参数（即不包括 'redirect' 的那些）。
          router.push({
            path: redirect.value || "/", // 设置跳转的目标路径
            query: otherQueryParams, // 传递过滤后的查询参数
          });
        })
        .catch(() => {
          loading.value = false; // 设置加载状态为false
          if (captchaEnabled.value) {
            getCode(); // 重新获取验证码
          }
        });
    }
  });
}

// 获取验证码图片
function getCode() {
  getCodeImg().then((res) => {
    captchaEnabled.value =
      res.captchaEnabled === undefined ? true : res.captchaEnabled;
    if (captchaEnabled.value) {
      codeUrl.value = "data:image/gif;base64," + res.img; // 设置验证码图片URL
      loginForm.value.uuid = res.uuid; // 设置验证码唯一标识符
    }
  });
}

// 从Cookies读取保存的登录信息
function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
  };
}

// 页面加载时调用获取验证码和读取Cookies
getCode();
getCookie();
</script>

<style lang="scss" scoped>
/* 登录页面样式 */
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}
</style>
