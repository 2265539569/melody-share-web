<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const roomId = route.params.id

const currentUser = ref({
  username: '音乐达人',
  avatar: '@/assets/custom_avatar.jpg'
})

// 播放列表数据
const playlist = ref([
  { id: 1, name: '夜曲', singer: '周杰伦', album: '十一月的萧邦', likes: 245, duration: '3:45', src: 'audio1.mp3' },
  { id: 2, name: '富士山下', singer: '陈奕迅', album: 'What\'s Going On...?', likes: 189, duration: '4:15', src: 'audio2.mp3' }
])

// 聊天消息
const chatMessages = ref([])
const newMessage = ref('')

// 当前在线人数
const onlineUsers = ref(12)

// 排序配置
const sortLikes = (a, b) => b.likes - a.likes

// 点歌处理
const requestSong = () => {
  ElMessage.success('已发送点歌请求')
}

// 发送聊天
const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push({
      user: '当前用户',
      content: newMessage.value,
      time: new Date().toLocaleTimeString()
    })
    newMessage.value = ''
  }
}
</script>

<template>
  <div class="room-container">
    <!-- 背景层 -->
    <div class="background-layer"></div>

    <!-- 内容层 -->
    <div class="content-layer">
      <!-- 头部 -->
      <header class="room-header">
        <h1>{{ route.params.name || '音乐房间' }} - ID: {{ roomId }}</h1>
        <AvatarComponent :user-info="currentUser" />
      </header>

      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 左侧播放列表 -->
        <section class="playlist-section">
          <el-table :data="playlist.sort(sortLikes)" style="width: 100%">
            <el-table-column prop="name" label="歌曲" width="180" />
            <el-table-column prop="singer" label="歌手" />
            <el-table-column prop="album" label="专辑" />
            <el-table-column prop="duration" label="时长" sortable />
            <el-table-column label="点赞">
              <template #default="{ row }">
                <el-button type="danger" circle @click="row.likes++">
                  ♥ {{ row.likes }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </section>

        <!-- 右侧功能栏 -->
        <el-aside class="function-aside">
          <div class="online-users">在线人数: {{ onlineUsers }}</div>

          <el-button type="primary" class="request-btn" @click="requestSong">
            🎵 点歌
          </el-button>

          <div class="chat-box">
            <div class="chat-messages">
              <div v-for="(msg, index) in chatMessages" :key="index" class="message">
                <span class="time">[{{ msg.time }}]</span>
                <span class="user">{{ msg.user }}:</span>
                <span class="content">{{ msg.content }}</span>
              </div>
            </div>

            <el-input v-model="newMessage" placeholder="输入聊天内容" @keyup.enter="sendMessage">
              <template #append>
                <el-button @click="sendMessage">发送</el-button>
              </template>
            </el-input>
          </div>
        </el-aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('@/assets/background.jpg') no-repeat center/cover;
  filter: blur(5px);
  z-index: 0;
}

.content-layer {
  position: relative;
  z-index: 1;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.room-header {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  padding: 20px;
}

.playlist-section {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.function-aside {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.online-users {
  color: #666;
  font-size: 0.9em;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.chat-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.message {
  margin: 5px 0;
  font-size: 0.9em;
  color: #333;
}

.time {
  color: #999;
  margin-right: 8px;
}

.request-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}
</style>
