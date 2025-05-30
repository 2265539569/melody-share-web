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
  return request.get(`/room/join?roomId=${roomId}&roomPassword=${roomPass}`)
}

export const getRoomInfo = () => {
  return request.get('/room/info')
}

export const quitRoom = () => {
  return request.get('/room/exit')
}

export const searchRoom = (roomName) => {
  return request.get(`/room/search?roomName=${roomName}`)
}
