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
       REGISTER
    --------------------------------------------------------- */
    async register(username, email, password) {
      // 1. criar conta e obter token
      const resp = await api.post('/auth/register', { username, email, password })

      // 2. armazenar token (backend retorna 'token' não 'access_token')
      const token = resp.data.token || resp.data.access_token
      this.setAccessToken(token)

      // 3. armazenar dados do usuário (backend já retorna user na resposta)
      if (resp.data.user) {
        this.setUser(resp.data.user)
      }
    },

    /* ---------------------------------------------------------
       LOGIN
    --------------------------------------------------------- */
    async login(email, senha) {
      // 1. solicitar tokens (backend espera 'password' não 'senha')
      const resp = await api.post('/auth/login', { email, password: senha })

      // 2. armazenar tokens (backend retorna 'token' não 'access_token')
      const token = resp.data.token || resp.data.access_token
      this.setAccessToken(token)
      
      // Backend pode não retornar refresh_token, então só salva se existir
      if (resp.data.refresh_token) {
        this.saveRefreshToken(resp.data.refresh_token)
      }

      // 3. armazenar dados do usuário (backend já retorna user na resposta)
      if (resp.data.user) {
        this.setUser(resp.data.user)
      }
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

