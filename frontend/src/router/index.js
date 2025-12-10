// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layout (area autenticada)
import MainLayout from '@/layouts/MainLayout.vue'

// Views públicas
import LoginView from '@/views/LoginView.vue'

// Views internas
import MensagensView from '@/views/MensagensView.vue'
import NovaMensagemView from '@/views/NovaMensagemView.vue'
import EditarMensagemView from '@/views/EditarMensagemView.vue'

// View administrativa
import AdminDashboard from '@/views/AdminDashboard.vue'

// 404
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  // Rota pública: login
  { path: '/login', name: 'login', component: LoginView },

  // Área autenticada: usa MainLayout como wrapper
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', redirect: '/mensagens' },

      {
        path: 'mensagens',
        name: 'mensagens',
        component: MensagensView,
        meta: { requiresAuth: true }
      },

      {
        path: 'mensagens/nova',
        name: 'mensagens-nova',
        component: NovaMensagemView,
        meta: { requiresAuth: true }
      },

      {
        path: 'mensagens/editar/:id',
        name: 'mensagens-editar',
        component: EditarMensagemView,
        props: true,
        meta: { requiresAuth: true }
      },

      // rota administrativa — exige papel ADMIN
      {
        path: 'admin',
        name: 'admin',
        component: AdminDashboard,
        meta: { requiresAuth: true, roles: ['ADMIN'] }
      }
    ]
  },

  // 404
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/*
  Guard global:
  - protege rotas marcadas com meta.requiresAuth
  - tenta recuperar sessão via auth.refreshAccessToken() se accessToken ausente
  - checa roles quando meta.roles está presente
  - redireciona para /login (com query.redirect) quando não é possível recuperar a sessão
*/
router.beforeEach(async (to, from) => {
  const auth = useAuthStore()

  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  const roles = to.meta?.roles || null

  // 1) rota pública: permitir (com exceção: evitar mostrar /login para usuário já autenticado)
  if (!requiresAuth) {
    if (to.name === 'login' && auth.accessToken) {
      return { name: 'mensagens' }
    }
    return true
  }

  // 2) rota protegida: se já há access token, permitir (após checar roles, se houver)
  if (auth.accessToken) {
    if (roles && (!auth.user || !roles.includes(auth.user.role))) {
      // usuário autenticado mas sem permissão
      return { name: 'not-found' } // ou rota 'forbidden' se preferir
    }
    return true
  }

  // 3) sem access token: tentar recuperar sessão via refresh token
  const refreshed = await auth.refreshAccessToken()

  if (refreshed) {
    if (roles && (!auth.user || !roles.includes(auth.user.role))) {
      return { name: 'not-found' }
    }
    return true
  }

  // 4) refresh falhou ou não existe refresh token: redirecionar ao login
  return {
    name: 'login',
    query: { redirect: to.fullPath }
  }
})

export default router


router.beforeEach(async (to, from) => {
    const auth = useAuthStore()
  
    const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
    const roles = to.meta?.roles || null
  
    if (!requiresAuth) {
      if (to.name === 'login' && auth.accessToken) {
        return { name: 'mensagens' }
      }
      return true
    }
  
    if (auth.accessToken) {
      if (roles && (!auth.user || !roles.includes(auth.user.role))) {
        return { name: 'not-found' }
      }
      return true
    }
  
    const refreshed = await auth.refreshAccessToken()
  
    if (refreshed) {
      if (roles && (!auth.user || !roles.includes(auth.user.role))) {
        return { name: 'not-found' }
      }
      return true
    }
  
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  })
  
  