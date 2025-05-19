import router from '@/router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'

const baseURL = 'http://localhost:8081'

const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true
})

instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 403) {
      Cookies.remove('ms-token')
      router.push('/login')
      ElMessage.error(res.response.data.message || '服务异常')
    }
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
