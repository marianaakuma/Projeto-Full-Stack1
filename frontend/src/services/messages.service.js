import api from '@/services/api'

export function getMessages() {
  return api.get('/posts/')
}

export function deleteMessage(id) {
  return api.delete(`/posts/${id}`)
}

export function getMessage(id) {
  return api.get(`/posts/${id}`)
}

export function updateMessage(id, payload) {
  return api.put(`/posts/${id}`, payload)
}

export function createMessage(payload) {
  return api.post('/posts/', payload)
}
