<!-- HeaderComponent.vue -->
<script setup>
import { ref } from 'vue';
import { Pointer } from '@element-plus/icons-vue';

const $emit = defineEmits(['create-room', 'search-room', 'profile-click', 'settings-click', 'logout-click']);

const roomName = ref('');
const roomPass = ref('');
</script>

<template>
  <div class="header-container">
    <el-button type="primary" round @click="$emit('create-room')">创建房间</el-button>
    <div class="search-container">
      <el-input v-model="roomName" placeholder="房间名" class="search-input" />
      <el-input v-model="roomPass" placeholder="房间密码（可选）" class="search-input" />
      <el-button type="primary" :icon="Pointer" circle @click="$emit('search-room', { roomName, roomPass })" />
    </div>
    <AvatarComponent />
  </div>
</template>

<style scoped>
.header-container {
  height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.search-input {
  width: 200px;
}

.search-input .el-input__inner {
  border-radius: 20px;
  padding: 0 15px;
}
</style>
