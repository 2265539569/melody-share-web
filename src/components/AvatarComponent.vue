<!-- AvatarComponent.vue -->
<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/index'

const router = useRouter()
const userStore = useUserStore()

defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      username: '游客',
      avatar: ''
    })
  }
})

const menuItems = [
{label: '注册', action: handleRegister},
{label: '登录', action: handleLogin}
]

const loginedMenuItems = [
  { label: '个人资料', action: handleProfile },
  { label: '设置', action: handleSettings },
  { label: '退出登录', action: handleLogout }
]

function handleRegister(){
  router.push('/register')
  ElMessage.info('正在跳转注册页')
}

function handleLogin(){
  router.push("/login")
  ElMessage.info('正在跳转登录页')
}

function handleProfile() {
  router.push('/profile')
  ElMessage.info('正在跳转个人资料')
}

function handleSettings() {
  router.push('/settings')
  ElMessage.info('正在打开设置')
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    router.push('/login')
    ElMessage.success('退出成功')
  } catch {
    ElMessage.info('已取消退出')
  }
}
</script>

<template>
  <div class="avatar-container">
    <el-dropdown>
      <div class="user-info" >
        <el-avatar :size="45" :icon="UserFilled" :src="userInfo.avatar || undefined" class="user-avatar" />
        <div class="username">
          {{ userInfo.username }}
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="(item, index) in menuItems" :key="index" @click="item.action()">
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.avatar-container {
  position: relative;
  z-index: 10;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-avatar {
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}
</style>
