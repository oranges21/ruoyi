// 导入必要的API函数，用于处理登录、登出和获取用户信息。
import { login, logout, getInfo } from "@/api/login";

// 导入与Token相关的工具函数，用于设置、获取和移除Token。
import { getToken, setToken, removeToken } from "@/utils/auth";

// 导入验证工具函数，用于检查URL是否为HTTP链接或字符串是否为空。
import { isHttp, isEmpty } from "@/utils/validate";

// 导入默认头像图片路径。
import defAva from "@/assets/images/profile.jpg";

// 使用defineStore定义一个名为'user'的Pinia store。
const useUserStore = defineStore("user", {
  // 定义store的状态(state)。
  state: () => ({
    token: getToken(), // 用户的认证Token，从本地存储中初始化。
    id: "", // 用户ID。
    name: "", // 用户名。
    avatar: "", // 用户头像链接。
    roles: [], // 用户的角色列表。
    permissions: [], // 用户的权限列表。
  }),

  // 定义store的动作(actions)，这些动作可以包含异步操作。
  actions: {
    // 登录动作。
    login(userInfo) {
      const username = userInfo.username.trim(); // 移除用户名前后空白。
      const password = userInfo.password; // 获取密码。
      const code = userInfo.code; // 获取验证码。
      const uuid = userInfo.uuid; // 获取UUID。

      // 返回一个Promise对象，以便调用者可以处理异步结果。
      return new Promise((resolve, reject) => {
        // 调用API进行登录，并传递用户名、密码、验证码和UUID。
        login(username, password, code, uuid)
          .then((res) => {
            setToken(res.token); // 设置Token到本地存储。
            this.token = res.token; // 更新store中的token状态。
            resolve(); // 解决Promise，表示登录成功。
          })
          .catch((error) => {
            reject(error); // 拒绝Promise，表示登录失败，并传递错误信息。
          });
      });
    },

    // 获取用户信息动作。
    getInfo() {
      return new Promise((resolve, reject) => {
        // 调用API获取用户信息。
        getInfo()
          .then((res) => {
            const user = res.user; // 获取响应中的用户信息。
            let avatar = user.avatar || ""; // 初始化头像链接。

            // 如果头像链接不是HTTP链接，则根据实际情况拼接完整路径。
            if (!isHttp(avatar)) {
              avatar = isEmpty(avatar)
                ? defAva
                : import.meta.env.VITE_APP_BASE_API + avatar;
            }

            // 验证返回的roles是否是一个非空数组，如果是则更新store中的roles和permissions。
            if (res.roles && res.roles.length > 0) {
              this.roles = res.roles;
              this.permissions = res.permissions;
            } else {
              // 如果没有返回任何角色，默认给用户分配一个ROLE_DEFAULT角色。
              this.roles = ["ROLE_DEFAULT"];
            }

            // 更新store中的用户信息。
            this.id = user.userId;
            this.name = user.userName;
            this.avatar = avatar;

            resolve(res); // 解决Promise，表示获取信息成功。
          })
          .catch((error) => {
            reject(error); // 拒绝Promise，表示获取信息失败，并传递错误信息。
          });
      });
    },

    // 退出系统动作。
    logOut() {
      return new Promise((resolve, reject) => {
        // 调用API进行登出，并传递当前的token。
        logout(this.token)
          .then(() => {
            // 清空store中的用户信息和Token。
            this.token = "";
            this.roles = [];
            this.permissions = [];
            removeToken();

            resolve(); // 解决Promise，表示登出成功。
          })
          .catch((error) => {
            reject(error); // 拒绝Promise，表示登出失败，并传递错误信息。
          });
      });
    },
  },
});

export default useUserStore; // 导出useUserStore供其他地方使用。
