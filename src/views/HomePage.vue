<script setup>
import { onMounted, ref } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import RoomBubbleComponent from '@/components/RoomBubbleComponent.vue';
import CreateRoomDialogComponent from '@/components/CreateRoomDialogComponent.vue';
import { addRoom, getRoomList } from '@/api/room';
import { ElMessage } from 'element-plus';
// import { addRoom } from '@/api/room';
// import { ElMessage } from 'element-plus';

const showDialog = ref(false);
const roomList = ref([])

const fetchRoomList = async () => {
  const result = await getRoomList()

  if (result.data?.code === 200) {
    roomList.value = result.data?.data

  }
}

onMounted(() => {
  fetchRoomList()
})

const handleCreateRoom = () => {
  showDialog.value = true;
};

const handleConfirmCreate = async (roomData) => {
  console.log(roomData);
  const result = await addRoom({ 'roomName': roomData.name, 'roomPass': roomData.password, 'description': roomData.description })
  if (result.data?.code === 200) {
    ElMessage({ type: 'success', message: result.data?.message })
    // 刷新房间列表
    fetchRoomList()
  } else {
    ElMessage({ type: "error", message: result.data?.message })
  }
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
      <RoomBubbleComponent v-for="room in roomList" :key="room.id" :id="room.id" :name="room.roomName"
        :owner="room.ownerName" :description="room.description" :count="room.count" :locked="!room.isPublic" />
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
