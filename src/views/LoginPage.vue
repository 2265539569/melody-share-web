<script setup>
import { ref } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { userLogin } from '@/api/user';
import router from '@/router';

// 定义响应式变量
const username = ref('');
const password = ref('');

// 登录处理函数
const handleLogin = async () => {
  const result = await userLogin({ 'username': username.value, 'password': password.value })
  if (result.data?.code === 200) {
    ElMessage({ type: 'success', message: result.data?.message })
    router.push("/")
  }
  ElMessage({ type: 'error', message: result.data?.code ? result.data?.message : '未知错误' })
};
</script>


<template>
  <div class="login-container">
    <div class="login-card">
      <h2>登录</h2>
      <div class="input-group">
        <label for="username">用户名</label>
        <el-input id="username" v-model="username" placeholder="请输入用户名" prefix-icon="el-icon-user"
          class="input-field" />
      </div>
      <div class="input-group">
        <label for="password">密码</label>
        <el-input id="password" v-model="password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"
          class="input-field" />
      </div>
      <el-button type="primary" @click="handleLogin">登录</el-button>
    </div>
  </div>
</template>


<style scoped>
.login-container {
  background-image: url('@/assets/background.jpg');
  /* 背景图片 */
  background-size: cover;
  /* 背景图片覆盖 */
  background-position: center;
  /* 背景图片居中 */
  height: 100vh;
  /* 高度为视口高度 */
  display: flex;
  /* 使用 flexbox 布局 */
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

.login-card {
  background-color: rgba(255, 255, 255, 0.85);
  /* 更加透明的白色背景 */
  border-radius: 20px;
  /* 圆角 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  /* 增加阴影效果 */
  padding: 30px;
  /* 内边距 */
  width: 400px;
  /* 增加卡片宽度 */
  text-align: center;
  /* 文本居中 */
}

.input-group {
  margin-bottom: 20px;
  /* 输入框组之间的间距 */
  text-align: left;
  /* 标签左对齐 */
}

.input-field {
  margin-top: 5px;
  /* 输入框与标签之间的间距 */
}
</style>
