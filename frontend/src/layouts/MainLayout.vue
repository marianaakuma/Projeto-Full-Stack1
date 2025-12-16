<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="layout">

    <!-- Cabeçalho -->
    <header class="cabecalho">
      <h1 class="logo">📬 App de Mensagens</h1>

      <nav class="menu">

        <!-- Quando autenticado -->
        <template v-if="auth.isAuthenticated">

          <span class="usuario">
            Olá, {{ auth.user?.username || auth.user?.nome || 'Usuário' }}
          </span>

          <RouterLink class="link" to="/mensagens">Mensagens</RouterLink>
          <RouterLink class="link" to="/mensagens/nova">Nova Mensagem</RouterLink>

          <!-- Apenas administradores -->
          <RouterLink v-if="isAdmin"
            class="link"
            to="/admin"
          >
            Admin
          </RouterLink>

          <button class="btn-sair" @click="sair">Sair</button>

        </template>

        <!-- Quando não autenticado -->
        <template v-else>
          <RouterLink class="link" to="/login">Entrar</RouterLink>
        </template>

      </nav>
    </header>

    <!-- Conteúdo da página -->
    <main class="conteudo">
      <RouterView />
    </main>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

// Verifica papel do usuário
const isAdmin = computed(() => auth.user?.role === 'ADMIN')

// Ação de logout
async function sair() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
/* Estilos simplificados — você pode adaptar conforme o capítulo 5 */

.layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  font-size: 1.4rem;
  font-weight: 700;
}

.menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.link {
  text-decoration: none;
  background: #f3f4f6;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.95rem;
}

.usuario {
  font-weight: 600;
  margin-right: 6px;
}

.btn-sair {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.conteudo {
  padding: 24px;
}
</style>

