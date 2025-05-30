<!-- AvatarComponent.vue -->
<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Cookies from 'js-cookie'
import { getUserInfo, userLogout } from '@/api/user'
import { onMounted, ref } from 'vue'

const router = useRouter()
const userInfo = ref({})
const menuItems = ref([]) // 初始化为空数组

// 统一更新菜单状态
const updateMenu = () => {
  const token = Cookies.get('ms-token')
  if (token) {
    menuItems.value = [
      { label: '个人资料', action: handleProfile },
      { label: '设置', action: handleSettings },
      { label: '退出登录', action: handleLogout }
    ]
  } else {
    menuItems.value = [
      { label: '注册', action: handleRegister },
      { label: '登录', action: handleLogin }
    ]
  }
}

// 获取用户信息
const fetchUserInfo = async () => {
  const { data } = await getUserInfo()
  if (data?.code === 200) {
    userInfo.value = data.data
    return
  }
  // token失效时清空状态
  Cookies.remove('ms-token')
  updateMenu()
}

// 初始化
onMounted(async () => {
  updateMenu() // 先根据token更新菜单
  if (Cookies.get('ms-token')) {
    await fetchUserInfo() // 有token时才获取用户信息
  }
})

// 事件处理函数
function handleRegister() {
  router.push('/register')
}

function handleLogin() {
  router.push('/login')
}

function handleProfile() {
  router.push('/profile')
}

function handleSettings() {
  router.push('/settings')
}

async function handleLogout() {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await userLogout()
    Cookies.remove('ms-token')
    userInfo.value = {} // 清空用户信息
    updateMenu() // 更新菜单状态
    // router.push('/login')
    ElMessage.success('退出成功')
  })
}
</script>

<template>
  <div class="avatar-container">
    <el-dropdown>
      <div class="user-info">
        <el-avatar :size="45" :icon="UserFilled" :src="userInfo.avatar || undefined" class="user-avatar" />
        <div class="username">
          {{ userInfo.nickname }}
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
:focus-visible {
  outline: none;
}

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
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}
</style>
