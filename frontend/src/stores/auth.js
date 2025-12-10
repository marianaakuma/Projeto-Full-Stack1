// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/services/api'
import router from '@/router'

const REFRESH_KEY = 'refresh_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,   // sempre em memória
    user: null,          // informações do usuário
    refreshing: false    // evita chamadas simultâneas
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },

  actions: {
    /* ---------------------------------------------------------
       Armazenamento de tokens
    --------------------------------------------------------- */
    setAccessToken(token) {
      this.accessToken = token
    },

    saveRefreshToken(token) {
      if (token) sessionStorage.setItem(REFRESH_KEY, token)
      else sessionStorage.removeItem(REFRESH_KEY)
    },

    getRefreshToken() {
      return sessionStorage.getItem(REFRESH_KEY)
    },

    /* ---------------------------------------------------------
       Armazenamento do usuário autenticado
    --------------------------------------------------------- */
    setUser(user) {
      this.user = user
    },

    /* ---------------------------------------------------------
       LOGIN
    --------------------------------------------------------- */
    async login(email, senha) {
      // 1. solicitar tokens
      const resp = await api.post('/auth/login', { email, senha })

      // 2. armazenar tokens
      this.setAccessToken(resp.data.access_token)
      this.saveRefreshToken(resp.data.refresh_token)

      // 3. solicitar perfil do usuário
      const me = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${this.accessToken}` }
      })
      this.setUser(me.data)
    },

    /* ---------------------------------------------------------
       LOGOUT
    --------------------------------------------------------- */
    async logout() {
      try {
        const refresh = this.getRefreshToken()
        if (refresh) {
          await api.post('/auth/logout', null, {
            headers: { Authorization: `Bearer ${refresh}` }
          })
        }
      } catch (e) {
        // falha na revogação não impede logout local
      } finally {
        this.accessToken = null
        this.user = null
        this.saveRefreshToken(null)

        // opcional: sincronização entre abas (implementada em 6.8)
        try { localStorage.setItem('app:logout', Date.now()) } catch {}

        router.push('/login')
      }
    },

    /* ---------------------------------------------------------
       RECUPERAR SESSÃO — método utilizado pelo router (Seção 6.6)
    --------------------------------------------------------- */
    async refreshAccessToken() {
      const refresh = this.getRefreshToken()
      if (!refresh) return false

      // impede requisições duplicadas
      if (this.refreshing) return false
      this.refreshing = true

      try {
        // 1. solicitar novo access token
        const resp = await api.post('/auth/refresh', null, {
          headers: {
            Authorization: `Bearer ${refresh}`  // IMPORTANTE: refresh via Bearer
          }
        })

        const newAccess = resp.data.access_token
        const newRefresh = resp.data.refresh_token

        // 2. armazenar tokens atualizados
        this.setAccessToken(newAccess)
        if (newRefresh) this.saveRefreshToken(newRefresh)

        // 3. recuperar dados do usuário, se necessário
        if (!this.user) {
          const me = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${newAccess}` }
          })
          this.setUser(me.data)
        }

        return true
      } catch (e) {
        // refresh token inválido ou expirado
        this.accessToken = null
        this.user = null
        this.saveRefreshToken(null)
        return false
      } finally {
        this.refreshing = false
      }
    }
  }
})

