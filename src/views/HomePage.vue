<script setup>
import { onMounted, ref } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import RoomBubbleComponent from '@/components/RoomBubbleComponent.vue';
import CreateRoomDialogComponent from '@/components/CreateRoomDialogComponent.vue';
import { addRoom, getRoomList, joinRoom, searchRoom } from '@/api/room';
import { ElMessage } from 'element-plus';
import { userRoomInfo } from '@/api/user';
import router from '@/router';

const showDialog = ref(false);
const roomList = ref([])
const loading = ref(true)

const fetchUserRoomInfo = async () => {
  const result = await userRoomInfo()
  if (result.data?.code === 200) {
    router.push(`/room/${result.data?.data}`)
  }
}

const fetchRoomList = async () => {
  const result = await getRoomList()
  if (result.data?.code === 200) {
    loading.value = false
    roomList.value = result.data?.data
  }
}

onMounted(() => {
  fetchUserRoomInfo()
  fetchRoomList()
})

const handleCreateRoom = () => {
  showDialog.value = true;
};

const handleConfirmCreate = async (roomData) => {
  console.log(roomData);
  const result = await addRoom({ 'roomName': roomData.name, 'roomPassword': roomData.password, 'description': roomData.description })
  if (result.data?.code === 200) {
    ElMessage({ type: 'success', message: result.data?.message })
    // 刷新房间列表
    fetchRoomList()
  } else {
    ElMessage({ type: "error", message: result.data?.message })
  }
  showDialog.value = false;
};

const handleSearchRoom = async (searchData) => {
  if (!searchData.roomName) {
    ElMessage({ type: 'warning', message: '请输入房间名称' });
    return;
  }

  const result = await searchRoom(searchData.roomName);
  if (result.data?.code === 200) {
    roomList.value = result.data?.data;
    if (roomList.value.length === 0) {
      ElMessage({ type: 'info', message: '未找到匹配的房间' });
    }
  } else {
    ElMessage({ type: 'error', message: result.data?.message || '搜索失败' });
  }
};

// 加入房间的函数
const handleJoinRoom = async (roomId, roomPassword = '') => {
  const result = await joinRoom(roomId, roomPassword);

  if (result.data?.code === 200 || result.data?.code === 508) {
    ElMessage({ type: 'success', message: result.data?.message });
    router.push(`/room/${roomId}`);
  } else {
    ElMessage({ type: 'error', message: result.data?.message });
  }
};

</script>

<template>
  <div class="home-container" v-loading="loading">
    <HeaderComponent @create-room="handleCreateRoom" @search-room="handleSearchRoom" @reset-room="fetchRoomList" />
    <CreateRoomDialogComponent v-model:visible="showDialog" @confirm="handleConfirmCreate" />

    <div class="demo-container">
      <RoomBubbleComponent v-for="room in roomList" :key="room.id" :id="room.id" :name="room.roomName"
        :owner="room.ownerName" :description="room.description" :count="room.count" :locked="room.isPublic"
        @join-room="handleJoinRoom" />
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
