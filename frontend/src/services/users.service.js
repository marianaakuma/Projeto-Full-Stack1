// src/services/users.service.js
import api from '@/services/api'

export function getUsers() {
  return api.get('/users')
}

export function promoteUser(id) {
  return api.patch(`/users/${id}`, { role: 'ADMIN' })
}

export function demoteUser(id) {
  return api.patch(`/users/${id}`, { role: 'USER' })
}

export function deleteUser(id) {
  return api.delete(`/users/${id}`)
}

