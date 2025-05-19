<script setup>
import { userRegister } from '@/api/user'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'

const formRef = ref(null)
const registerForm = reactive({
  username: '',
  password: '',
  nickname: ''
})

const handleRegister = () => {
  formRef.value.validate(async valid => {
    if (valid) {
      const result = await userRegister(registerForm)
      if (result.data?.code === 200) {
        ElMessage({ type: 'success', message: result.data?.message })
        router.push("/login")
      } else {
        ElMessage({ type: 'error', message: result.data?.message })
      }
    }
  })
}

// 添加表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' }
  ]
})

</script>


<template>
  <div class="register-container">
    <el-form :model="registerForm" ref="formRef" label-width="80px" class="register-form"
      @submit.prevent="handleRegister" :rules="rules">
      <h2 class="form-title">用户注册</h2>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit" class="submit-btn">
          立即注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<style scoped>
.register-container {
  height: 100vh;
  width: 100%;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-form {
  width: 400px;
  padding: 30px 35px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.form-title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}
</style>
