<script setup>
import { ref } from 'vue';
import { Lock, Unlock } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import router from '@/router';

const props = defineProps({
  id: {
    type: String,
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
  }
});


// 控制工具提示显示
const showTooltip = ref(false);



const emit = defineEmits(['click', 'password-submit']);

const showPasswordDialog = ref(false);
const password = ref('');

// 点击处理逻辑
const handleClick = () => {
  if (props.locked) {
    showPasswordDialog.value = true;
  } else {
    // 路由跳转代替原有emit
    router.push(`/room/${props.id}`);
    // 保留原有emit供其他组件使用
    emit('click', {
      id: props.id,
      name: props.name,
      locked: props.locked,
      count: props.count
    });
  }
};

// 密码提交事件
const handlePasswordSubmit = () => {
  if (!password.value) {
    ElMessage.warning('请输入密码');
    return;
  }
  emit('password-submit', {
    id: props.id,  // 添加id参数
    name: props.name,
    password: password.value
  });
  // 密码验证成功后跳转
  router.push(`/room/${props.id}`);
  password.value = '';
  showPasswordDialog.value = false;
};
</script>


<template>
  <!-- 房间气泡组件，带悬停效果和点击事件 -->
  <div class="room-bubble" :class="{ 'locked': locked }" @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false" @click="handleClick">
    <!-- 左上角锁图标 -->
    <div class="lock-icon">
      <el-icon :size="16" :color="locked ? '#ff4d4f' : '#52c41a'">
        <component :is="locked ? Lock : Unlock" />
      </el-icon>
    </div>

    <!-- 房间名称 -->
    <span class="room-name">{{ name }}</span>

    <!-- 右上角人数气泡 -->
    <div class="user-count" v-if="count > 0">
      {{ count }}
    </div>

    <!-- 悬停时显示的房间描述 -->
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
/* 基础房间气泡样式 - 深色背景 */
.room-bubble {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: #1a1a2e;
  /* 深色背景 */
  color: #ffffff;
  /* 白色文字 */
  padding: 10px 15px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  /* 更深的阴影 */
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  border: 1px solid #2a2a3e;
  margin: 10px;
}

/* 锁定状态样式 */
.room-bubble.locked {
  background-color: #2e1a1a;
  /* 深红色背景 */
  border-color: #4a2a2a;
}

/* 悬停效果 */
.room-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 锁图标样式 */
.lock-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

/* 房间名称样式 */
.room-name {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

/* 用户计数气泡 */
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

/* 房间描述工具提示 */
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

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
