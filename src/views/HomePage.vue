<script setup>
import { ref } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import RoomBubbleComponent from '@/components/RoomBubbleComponent.vue';
import CreateRoomDialogComponent from '@/components/CreateRoomDialogComponent.vue';

const showDialog = ref(false);

const handleCreateRoom = () => {
  showDialog.value = true;
};

const handleConfirmCreate = (roomData) => {
  console.log('创建房间数据:', roomData);
  // 这里添加实际创建房间的API调用
  showDialog.value = false;
};

const handleSearchRoom = (searchData) => {
  console.log('搜索房间:', searchData);
  // 这里添加搜索房间的逻辑
};

const handleProfileClick = () => {
  console.log('点击了个人资料');
  // 跳转到个人资料页

};

const handleSettingsClick = () => {
  console.log('点击了设置');
  // 跳转到设置页
};

const handleLogoutClick = () => {
  console.log('点击了退出');
  // 处理退出登录逻辑
};



</script>

<template>
  <div class="home-container">
    <HeaderComponent @create-room="handleCreateRoom" @search-room="handleSearchRoom" @profile-click="handleProfileClick"
      @settings-click="handleSettingsClick" @logout-click="handleLogoutClick" />
    <CreateRoomDialogComponent v-model:visible="showDialog" @confirm="handleConfirmCreate" />

    <div class="demo-container">
      <!-- 普通房间 -->
      <RoomBubbleComponent id="1" name="开发讨论室" description="这里是前端开发人员交流技术的空间" :count="5" />

      <!-- 锁定房间 -->
      <RoomBubbleComponent id="2" name="私密会议室" description="需要密码才能进入的私密空间" :locked="true" :count="2" />

    </div>
  </div>
</template>

<style scoped>
.home-container {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
}
</style>
