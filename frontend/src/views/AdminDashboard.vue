<!-- src/views/AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <h1 class="titulo">🛠️ Painel Administrativo</h1>

    <!-- Estatísticas -->
    <section class="stats" v-if="!loadingStats && !statsError">
      <div class="stat-card">
        <h3>Usuários</h3>
        <p class="numero">{{ stats.usuarios }}</p>
      </div>
      <div class="stat-card">
        <h3>Mensagens</h3>
        <p class="numero">{{ stats.mensagens }}</p>
      </div>
    </section>

    <p v-if="loadingStats" class="estado carregando">Carregando estatísticas...</p>
    <p v-if="statsError" class="estado erro">{{ statsError }}</p>

    <hr />

    <!-- Usuários -->
    <section class="panel">
      <header class="panel-header">
        <h2>👥 Usuários</h2>
        <button class="btn-pequeno" @click="carregarUsuarios" :disabled="loadingUsuarios">
          {{ loadingUsuarios ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </header>

      <p v-if="loadingUsuarios" class="estado carregando">Carregando usuários...</p>
      <p v-else-if="usuariosError" class="estado erro">{{ usuariosError }}</p>

      <table v-else class="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Perfil</th>
            <th style="width:260px">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.nome }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.perfil }}</td>
            <td class="acoes">
              <button v-if="u.perfil !== 'ADMIN'"
                class="btn editar"
                @click="promover(u)"
                :disabled="savingUserId === u.id"
              >
                {{ savingUserId === u.id ? '...' : 'Promover → ADMIN' }}
              </button>

              <button v-else
                class="btn secundario"
                @click="demover(u)"
                :disabled="savingUserId === u.id"
              >
                {{ savingUserId === u.id ? '...' : 'Rebaixar para USER' }}
              </button>

              <button class="btn remover"
                @click="removerUsuario(u)"
                :disabled="removingUserId === u.id"
              >
                {{ removingUserId === u.id ? 'Removendo...' : 'Remover' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <hr />

    <!-- Mensagens -->
    <section class="panel">
      <header class="panel-header">
        <h2>💬 Mensagens</h2>
        <button class="btn-pequeno" @click="carregarMensagens" :disabled="loadingMensagens">
          {{ loadingMensagens ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </header>

      <p v-if="loadingMensagens" class="estado carregando">Carregando mensagens...</p>
      <p v-else-if="mensagensError" class="estado erro">{{ mensagensError }}</p>

      <div v-else class="lista-mensagens">
        <article v-for="m in mensagens" :key="m.id" class="mensagem-card">
          <div class="meta">
            <div>
              <strong>{{ m.titulo }}</strong>
              <div class="sub">por {{ m.autor ?? m.usuario_nome ?? '—' }}</div>
            </div>
            <small>{{ formatDate(m.data_criacao) }}</small>
          </div>

          <p class="conteudo">{{ m.conteudo }}</p>

          <div class="acoes">
            <button class="btn remover"
              @click="removerMensagem(m)"
              :disabled="removingMsgId === m.id"
            >
              {{ removingMsgId === m.id ? 'Removendo...' : 'Remover Mensagem' }}
            </button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import * as usersService from '@/services/users.service'
import * as messagesService from '@/services/messages.service'
import * as adminService from '@/services/admin.service'

const auth = useAuthStore()

// estatísticas
const stats = ref({ usuarios: 0, mensagens: 0 })
const loadingStats = ref(false)
const statsError = ref(null)

// usuários
const usuarios = ref([])
const loadingUsuarios = ref(false)
const usuariosError = ref(null)
const savingUserId = ref(null)
const removingUserId = ref(null)

// mensagens
const mensagens = ref([])
const loadingMensagens = ref(false)
const mensagensError = ref(null)
const removingMsgId = ref(null)

// util
function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  } catch { return iso }
}

/* Estatísticas -------------------------------------------------- */
async function carregarStats() {
  loadingStats.value = true
  statsError.value = null
  try {
    const resp = await adminService.getStats()
    stats.value = resp.data
  } catch {
    statsError.value = 'Falha ao carregar estatísticas.'
  } finally {
    loadingStats.value = false
  }
}

/* Usuários ------------------------------------------------------ */
async function carregarUsuarios() {
  loadingUsuarios.value = true
  usuariosError.value = null
  try {
    const resp = await usersService.getUsers()
    usuarios.value = resp.data.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      perfil: u.role ?? 'USER'
    }))
  } catch {
    usuariosError.value = 'Falha ao carregar usuários.'
  } finally {
    loadingUsuarios.value = false
  }
}

async function promover(u) {
  if (!confirm(`Promover ${u.nome} a ADMIN?`)) return
  savingUserId.value = u.id
  try {
    await usersService.promoteUser(u.id)
    u.perfil = 'ADMIN'
  } finally {
    savingUserId.value = null
  }
}

async function demover(u) {
  if (!confirm(`Rebaixar ${u.nome} para USER?`)) return
  savingUserId.value = u.id
  try {
    await usersService.demoteUser(u.id)
    u.perfil = 'USER'
  } finally {
    savingUserId.value = null
  }
}

async function removerUsuario(u) {
  if (!confirm(`Remover o usuário ${u.nome}?`)) return
  removingUserId.value = u.id
  try {
    await usersService.deleteUser(u.id)
    usuarios.value = usuarios.value.filter(x => x.id !== u.id)
  } finally {
    removingUserId.value = null
  }
}

/* Mensagens ------------------------------------------------------ */
async function carregarMensagens() {
  loadingMensagens.value = true
  mensagensError.value = null
  try {
    const resp = await messagesService.getMessages()
    mensagens.value = resp.data.map(m => ({
      id: m.id,
      titulo: m.titulo,
      conteudo: m.conteudo,
      autor: m.autor ?? m.usuario_nome ?? m.usuario?.nome,
      data_criacao: m.data_criacao
    }))
  } catch {
    mensagensError.value = 'Falha ao carregar mensagens.'
  } finally {
    loadingMensagens.value = false
  }
}

async function removerMensagem(m) {
  if (!confirm(`Remover a mensagem "${m.titulo}"?`)) return
  removingMsgId.value = m.id
  try {
    await messagesService.deleteMessage(m.id)
    mensagens.value = mensagens.value.filter(x => x.id !== m.id)
  } finally {
    removingMsgId.value = null
  }
}

/* Inicialização -------------------------------------------------- */
onMounted(async () => {
  if (auth.user?.role !== 'ADMIN') return  // reforço defensivo

  await Promise.all([
    carregarStats(),
    carregarUsuarios(),
    carregarMensagens()
  ])
})
</script>


<style scoped>
.admin-dashboard {
  max-width: 1100px;
  margin: 24px auto;
  padding: 12px;
}

.titulo { font-size: 1.5rem; margin-bottom: 12px; }

.stats { display:flex; gap:16px; margin-bottom:18px; }
.stat-card { background:#fff; padding:14px; border-radius:10px; box-shadow:0 6px 20px rgba(16,24,40,0.04); width:160px; text-align:center; }
.stat-card .numero { font-size:1.6rem; font-weight:700; margin-top:8px; }

.panel { margin-top: 18px; background:#fff; border-radius:10px; padding:14px; box-shadow:0 6px 20px rgba(16,24,40,0.04); }
.panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:12px; }
.acoes-header { display:flex; gap:8px; align-items:center; }

.tabela { width:100%; border-collapse:collapse; }
.tabela th, .tabela td { padding:8px 10px; border-bottom:1px solid #f3f4f6; text-align:left; vertical-align:middle; }
.tabela thead th { background: #f9fafb; font-weight:700; }

.acoes { display:flex; gap:8px; align-items:center; }

.btn { padding:8px 10px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
.btn.editar { background:#3b82f6; color:#fff; }
.btn.remover { background:#ef4444; color:#fff; }
.btn.secundario { background:#f3f4f6; color:#111827; }
.btn-pequeno { padding:6px 8px; border-radius:8px; background:#e6eef8; border:1px solid #d0e7ff; cursor:pointer; }

.estado { padding:10px; border-radius:8px; margin-bottom:12px; }
.estado.carregando { background:#fff9e6; color:#92400e; }
.estado.erro { background:#fff1f2; color:#991b1b; border:1px solid #fecaca; }

.lista-mensagens { display:flex; flex-direction:column; gap:12px; }
.mensagem-card { border:1px solid #eef2ff; padding:12px; border-radius:8px; background:#fff; }
.mensagem-card .meta { display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px; }
.mensagem-card .sub { color:#6b7280; font-size:0.9rem; }
.mensagem-card .conteudo { color:#374151; white-space:pre-wrap; margin-bottom:8px; }
</style>

