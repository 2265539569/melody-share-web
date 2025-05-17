import request from '@/utils/request'

export const userLogin = (params) => {
  return request.post('/user/login', params, { withCredentials: true })
}

export const userRegister = (params) => {
  return request.post('/user/register', params)
}

export const userInfo = () => {
  return request.get('/user/info')
}
