<script setup>
import { onMounted, ref } from 'vue'
import {
  ElButton,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElInput,
  ElMessage,
  ElIcon,
  ElSlider
} from 'element-plus'
import AvatarComponent from '@/components/AvatarComponent.vue'
import { getRoomInfo, quitRoom } from '@/api/room'
import router from '@/router'
import { ArrowDown, Top } from '@element-plus/icons-vue'
import Cookies from 'js-cookie'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomInfo = ref()
const inputMessage = ref('')
const chatMessages = ref([])
const roomUsers = ref(['用户1', '用户2'])
const songs = ref([
  {
    id: 1,
    liked: 10,
    song_name: '歌曲1',
    singer: '歌手1',
    song_album: '专辑1',
    song_duration: '3:30',
    by_user_name: '用户1',
    by_user_time: '2023-10-01'
  },
  {
    id: 2,
    liked: 5,
    song_name: '歌曲2',
    singer: '歌手2',
    song_album: '专辑2',
    song_duration: '4:00',
    by_user_name: '用户2',
    by_user_time: '2023-10-02'
  }
])
const currentSong = ref({ song_name: '歌曲1', singer: '歌手1', lyrics: '这是歌词...' })
const progress = ref(0)

let ws = null // WebSocket 实例

const chatMessagesRef = ref(null)

const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}


const exitRoom = async () => {
  const result = await quitRoom()
  if (result.data?.code === 200) {
    ElMessage({ type: 'success', message: result.data?.message })
    router.push('/')
  } else {
    ElMessage({ type: 'error', message: result.data?.message })
  }
}

const sendMessage = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    ElMessage.error('WebSocket 未连接，无法发送消息')
    return
  }
  if (!inputMessage.value.trim()) {
    ElMessage.warning('请输入消息内容')
    return
  }
  // 发送消息给服务器
  ws.send(JSON.stringify({ roomId: route.params.id, content: inputMessage.value.trim() }))

  inputMessage.value = ''
}

const changeSong = () => {
  console.log('切歌')
}
const requestSong = () => {
  console.log('点歌')
}
const fetchRoomInfo = async () => {
  const result = await getRoomInfo()
  if (result.data?.code === 200) {
    roomInfo.value = result.data?.data
  }
}

const handleClickLike = (song) => {
  song.liked++
  ElMessage({ type: 'success', message: `你给《${song.song_name}》点了赞！` })
}

const playPause = () => {
  console.log('播放/暂停')
}

const initWebSocket = () => {
  const token = Cookies.get('ms-token')
  if (!token) {
    chatMessages.value.push({
      id: Date.now(),
      sendBy: '系统',
      sendTime: new Date().toLocaleTimeString().slice(0, 5),
      message: '未检测到登录令牌，无法连接聊天服务器'
    })
    return
  }

  ws = new WebSocket(`ws://localhost:8081/chat?satoken=${token}&roomId=${route.params.id}`) // 注意路径参数形式

  ws.onopen = () => {
    chatMessages.value.push({
      id: Date.now(),
      sendBy: '系统',
      sendTime: new Date().toLocaleTimeString().slice(0, 5),
      message: '连接已建立'
    })
  }

  ws.onmessage = (event) => {
    console.log(event.data);

    // 假设服务器发来的消息是 JSON 格式，包含 sendBy 和 message
    const serverMessage = JSON.parse(event.data);

    // 判断消息发送者，如果是自己发送的消息，前端不再重复添加 "服务器" 消息
    if (serverMessage.sendBy !== '我') {
      chatMessages.value.push({
        id: Date.now(),
        sendBy: serverMessage.sendBy,
        sendTime: new Date().toLocaleTimeString().slice(0, 5),
        message: serverMessage.message
      });
    }
    scrollToBottom()
  }


  ws.onerror = () => {
    chatMessages.value.push({
      id: Date.now(),
      sendBy: '系统',
      sendTime: new Date().toLocaleTimeString().slice(0, 5),
      message: 'WebSocket 连接错误，请检查服务器状态'
    })
  }

  ws.onclose = () => {
    chatMessages.value.push({
      id: Date.now(),
      sendBy: '系统',
      sendTime: new Date().toLocaleTimeString().slice(0, 5),
      message: '连接已关闭'
    })
  }
}

onMounted(() => {
  fetchRoomInfo()
  initWebSocket()
})
</script>

<template>
  <div class="room-container">
    <!-- Header -->
    <div class="room-header">
      <div class="header-left">
        <h2>{{ roomInfo?.roomName }} - {{ roomInfo?.ownerName }}</h2>
        <p>{{ roomInfo?.description }}</p>
      </div>
      <div class="header-right">
        <ElButton type="danger" @click="exitRoom">退出房间</ElButton>
        <AvatarComponent />
      </div>
    </div>

    <!-- Main -->
    <div class="room-main">
      <!-- 左侧歌曲列表 -->
      <div class="song-list">
        <el-table :data="songs" height="400px" style="width: 100%">
          <el-table-column prop="id" label="编号" width="60" />
          <el-table-column label="点赞数" width="100">
            <template #default="{ row }">
              <div class="like-cell" @click="handleClickLike(row)">
                {{ row.liked }}
                <el-icon>
                  <Top />
                </el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌曲名/歌手">
            <template #default="{ row }">
              <div>
                <div class="song-name">{{ row.song_name }}</div>
                <div class="singer">{{ row.singer }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="song_album" label="专辑名" />
          <el-table-column prop="song_duration" label="时长" width="80" />
          <el-table-column prop="by_user_name" label="点歌用户" />
          <el-table-column prop="by_user_time" label="点歌时间" />
        </el-table>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-area">
        <div class="chat-header">
          <span>房间人数: {{ roomUsers.length }}</span>
          <ElDropdown>
            <span class="el-dropdown-link">当前用户
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem v-for="user in roomUsers" :key="user">{{ user }}</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <div class="chat-messages" ref="chatMessagesRef">
          <p v-for="message in chatMessages" :key="message.id">
            [{{ message.sendTime }}] {{ message.sendBy }}: {{ message.message }}
          </p>
        </div>
        <div class="chat-controls">
          <div class="controls-row">
            <el-input @keydown.enter="sendMessage" v-model="inputMessage" placeholder="输入消息" />
            <ElButton type="primary" @click="sendMessage">发送</ElButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="room-footer">
      <div class="footer-left">
        <div class="song-info">
          <div class="song-name">{{ currentSong.song_name }}</div>
          <div class="singer">{{ currentSong.singer }}</div>
        </div>
        <div class="controls">
          <ElButton type="primary" @click="playPause">播放/暂停</ElButton>
          <ElButton type="primary" @click="changeSong">切歌</ElButton>
          <ElButton type="primary" @click="requestSong">点歌</ElButton>
        </div>
      </div>
      <div class="footer-center">
        <ElSlider v-model="progress" :min="0" :max="100" />
      </div>
      <div class="footer-right">
        <div class="lyrics">{{ currentSong.lyrics }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:focus-visible {
  outline: none;
}

.room-container {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  color: #ffffff;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header */
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #ffffff;
}

.header-left p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #cccccc;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Main */
.room-main {
  flex: none;
  height: calc(100vh - 60px - 80px);
  /* 100vh - footer高度 - header高度 */
  display: flex;
  gap: 10px;
  margin-top: 10px;
  overflow: hidden;
}

/* 左侧歌曲列表 */
.song-list {
  flex: 2;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  padding: 20px;
  overflow-y: auto;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-border: 0px solid var(--el-table-border-color);
  /**这里改成0了 */
  --el-table-text-color: rgb(127, 255, 202);
  /**文字颜色 */
  --el-table-header-text-color: rgb(135, 198, 235);
  /**表头文字颜色 */
  --el-table-row-hover-bg-color: rgba(103, 99, 118, 0.671);
  /**行悬浮颜色 */
  --el-table-current-row-bg-color: rgb(0, 161, 48);
  /**当前行颜色 */
  --el-table-header-bg-color: rgba(255, 0, 0, 0);
  /**表头背景颜色, 透明度为0 */
  --el-table-fixed-box-shadow: var(--el-box-shadow-light);
  --el-table-bg-color: rgba(255, 0, 0, 0);
  /**表格背景颜色, 透明度为0 */
  --el-table-tr-bg-color: rgba(255, 0, 0, 0);
  /**表格行的背景颜色, 透明度为0 */
  --el-table-expanded-cell-bg-color: var(--el-fill-color-blank);
  --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
  --el-table-index: var(--el-index-normal);
}

:deep(.el-table__inner-wrapper:before) {
  bottom: 0;
  height: 0px;
  left: 0;
}

/* 自定义点赞列样式 */
.like-cell {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ff6b6b;
  font-weight: 600;
  user-select: none;
}

.like-cell:hover {
  color: #ff8787;
}

/* 歌曲名和歌手 */
.song-name {
  font-size: 16px;
  font-weight: 600;
}

.singer {
  font-size: 12px;
  color: #cccccc;
}

/* 右侧聊天区域 */
.chat-area {
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chat-header span {
  font-size: 16px;
  color: #ffffff;
}

.el-dropdown-link {
  color: #ffffff;
  cursor: pointer;
}

.el-dropdown-menu {
  border: none !important;
  box-shadow: none !important;
  /* background-color: transparent !important; 取消背景色可选 */
}

/* 聊天消息区 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.chat-messages p {
  margin: 0 0 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: #ffffff;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

/* 聊天输入区 */
.chat-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.controls-row {
  display: flex;
  gap: 10px;
}

/* Footer */
.room-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-left .song-info {
  display: flex;
  flex-direction: column;
}

.song-info .song-name {
  font-size: 16px;
  font-weight: 600;
}

.song-info .singer {
  font-size: 12px;
  color: #cccccc;
}

.footer-center {
  flex: 1;
  max-width: 500px;
}

.footer-right {
  max-width: 300px;
  overflow: hidden;
}

.lyrics {
  font-size: 14px;
  color: #ffffff;
  white-space: nowrap;
  animation: scrollLyrics 10s linear infinite;
}

@keyframes scrollLyrics {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>
