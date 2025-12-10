import api from '@/services/api'

export function getMessages() {
  return api.get('/mensagens')
}

export function deleteMessage(id) {
  return api.delete(`/mensagens/${id}`)
}

export function getMessage(id) {
  return api.get(`/mensagens/${id}`)
}

export function updateMessage(id, payload) {
  return api.put(`/mensagens/${id}`, payload)
}

export function createMessage(payload) {
  return api.post('/mensagens', payload)
}
