import request from '@/utils/request'

export const userLogin = (params) => {
  return request.post('/user/login', params)
}

export const userRegister = (params) => {
  return request.post('/user/register', params)
}

export const getUserInfo = () => {
  return request.get('/user/info')
}

export const updateUser = (params) => {
  return request.put('/user/update', params)
}
