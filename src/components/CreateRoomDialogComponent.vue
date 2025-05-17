<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:visible'])

const dialogVisible = ref(false)
const form = reactive({
  name: '',
  password: '',
  description: ''
})

watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:visible', val)
  if (!val) {
    // Reset form when dialog closes
    form.name = ''
    form.password = ''
    form.description = ''
  }
})

const handleConfirm = () => {
  if (!form.name.trim()) {
    ElMessage.error('房间名称不能为空')
    return
  }
  emit('confirm', { ...form })
  dialogVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>


<template>
  <el-dialog v-model="dialogVisible" title="创建房间" width="500px" center>
    <el-form :model="form" label-width="100px">
      <el-form-item label="房间名称" required>
        <el-input v-model="form.name" placeholder="请输入房间名称" />
      </el-form-item>
      <el-form-item label="房间密码">
        <el-input v-model="form.password" type="password" placeholder="可选" show-password />
      </el-form-item>
      <el-form-item label="房间描述">
        <el-input v-model="form.description" type="textarea" placeholder="请输入房间描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
