<script setup>
import { ref } from 'vue';
import { Lock, Unlock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  locked: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true,
    default: '未命名房间'
  },
  description: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 0
  },
  owner: {
    type: String,
    required: true,
  }
});

const showTooltip = ref(false);
const showPasswordDialog = ref(false);
const password = ref('');

const emit = defineEmits(['join-room']);

// 处理房间点击事件
const handleClick = async () => {
  if (props.locked) {
    showPasswordDialog.value = true;
  } else {
    emit('join-room', props.id);
  }
};

// 处理密码提交事件
const handlePasswordSubmit = async () => {
  if (!password.value) {
    ElMessage.warning('请输入密码');
    return;
  }

  emit('join-room', props.id, password.value);

  // 清空密码并关闭对话框
  password.value = '';
  showPasswordDialog.value = false;
};
</script>

<template>
  <div class="room-bubble" :class="{ 'locked': locked }" @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false" @click="handleClick">
    <div class="lock-icon">
      <el-icon :size="16" :color="locked ? '#ff4d4f' : '#52c41a'">
        <component :is="locked ? Lock : Unlock" />
      </el-icon>
    </div>

    <div class="room-info">
      <span class="owner-name">{{ owner }}</span>
      <span>&nbsp;-&nbsp;</span>
      <span class="room-name">{{ name }}</span>
    </div>

    <div class="user-count">
      {{ count }}
    </div>

    <transition name="fade">
      <div class="room-tooltip" v-show="showTooltip && description">
        <div class="tooltip-content">
          {{ description }}
        </div>
      </div>
    </transition>
  </div>

  <el-dialog v-model="showPasswordDialog" title="请输入房间密码" width="30%" :close-on-click-modal="false">
    <el-input v-model="password" type="password" placeholder="请输入密码" show-password
      @keyup.enter="handlePasswordSubmit" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 样式保持不变 */
.room-bubble {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: #1a1a2e;
  color: #ffffff;
  padding: 10px 15px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  border: 1px solid #2a2a3e;
  margin: 10px;
}

.room-bubble.locked {
  background-color: #2e1a1a;
  border-color: #4a2a2a;
}

.room-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.lock-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.room-info {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.user-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.room-tooltip {
  position: absolute;
  bottom: calc(-100% - 20px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 200px;
}

.tooltip-content {
  background-color: #2a2a3e;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 13px;
  line-height: 1.5;
  color: #e0e0e0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
