// src/services/admin.service.js
import api from '@/services/api'
import * as users from './users.service'
import * as messages from './messages.service'

export async function getStats() {
  try {
    return await api.get('/admin/stats')
  } catch {
    // fallback quando a API não fornece este endpoint
    const [uRes, mRes] = await Promise.all([
      users.getUsers(),
      messages.getMessages()
    ])
    return {
      data: {
        usuarios: Array.isArray(uRes.data) ? uRes.data.length : 0,
        mensagens: Array.isArray(mRes.data) ? mRes.data.length : 0
      }
    }
  }
}

