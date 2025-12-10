// src/services/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error)
    else promise.resolve(token)
  })
  failedQueue = []
}

/**
 * REQUEST INTERCEPTOR
 * -> garante que TODO request enviado pela instância carregue o access token atual
 */
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    const token = auth.accessToken
    if (token) {
      config.headers = config.headers || {}
      // só altera quando não há Authorization ou sempre sobrescreve com token atual
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  res => res,

  async (err) => {
    const auth = useAuthStore()
    const originalReq = err.config

    // Se for erro de autenticação
    if (err.response?.status === 401 && !originalReq._retry) {

      const refreshToken = auth.getRefreshToken()

      // Se não houver refresh token → logout imediato
      if (!refreshToken) {
        await auth.logout()
        return Promise.reject(err)
      }

      // Se já estamos renovando, coloca na fila
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalReq.headers.Authorization = `Bearer ${newToken}`
            return api(originalReq)
          })
          .catch((refreshErr) => Promise.reject(refreshErr))
      }

      // Marca para evitar múltiplos refresh
      originalReq._retry = true
      isRefreshing = true

      try {
        // Chama o endpoint de refresh com header Bearer
        const resp = await api.post('/auth/refresh', null, {
          headers: { Authorization: `Bearer ${refreshToken}` }
        })

        const newAccess = resp.data.access_token
        const newRefresh = resp.data.refresh_token

        // Atualiza tokens na store
        auth.setAccessToken(newAccess)
        if (newRefresh) auth.saveRefreshToken(newRefresh)

        // Libera fila com novo token
        processQueue(null, newAccess)

        // Reenvia requisição original
        originalReq.headers.Authorization = `Bearer ${newAccess}`
        return api(originalReq)

      } catch (refreshErr) {
        // Refresh falhou → força logout
        processQueue(refreshErr, null)
        await auth.logout()
        return Promise.reject(refreshErr)

      } finally {
        isRefreshing = false
      }
    }

    // Se outro erro qualquer, deixa seguir
    return Promise.reject(err)
  }
)

export default api

