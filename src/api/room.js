import request from '@/utils/request'

export const addRoom = (params) => {
  return request.post('/room/add', params)
}

export const getRoomList = () => {
  return request.get(`/room/list`)
}

export const deleteRoom = (roomId) => {
  return request.delete(`/room/delete/${roomId}`)
}

export const updateRoom = (params) => {
  return request.put('/room/update', params)
}

export const joinRoom = (roomId, roomPass) => {
  return request.get(`/room/join?roomId=${roomId}&roomPass=${roomPass}`)
}
