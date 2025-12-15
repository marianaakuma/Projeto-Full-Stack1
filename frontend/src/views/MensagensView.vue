<!-- src/views/MensagensView.vue -->
<template>
  <div>
    <h1 class="titulo">📬 Mensagens</h1>

    <div class="acoes-topo">
      <RouterLink v-if="auth.isAuthenticated"
        class="btn"
        to="/mensagens/nova"
      >➕ Nova Mensagem</RouterLink>

      <span v-else class="nota">
        Faça login para criar uma mensagem.
      </span>
    </div>

    <div v-if="carregando" class="estado carregando">
      ⏳ Carregando mensagens...
    </div>

    <div v-else-if="erro" class="estado erro">
      ⚠️ {{ erro }}
      <div style="margin-top:8px;">
        <button class="btn-pequeno" @click="carregar">Tentar novamente</button>
      </div>
    </div>

    <div v-else-if="mensagens.length === 0" class="estado vazio">
      🗒️ Nenhuma mensagem encontrada.
    </div>

    <div v-else class="lista-mensagens">
      <MensagemCard v-for="msg in mensagens"
        :key="msg.id"
        :id="msg.id"
        :mensagem="msg"
        @editar="onEditarMensagem"
        @remover="onRemoverMensagem"
      >
        <template #titulo>{{ msg.title }}</template>
        <template #conteudo>{{ msg.content }}</template>
        <template #autor>{{ msg.author }}</template>
        <template #data>{{ formatarData(msg.created_at) }}</template>
      </MensagemCard>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MensagemCard from '@/components/MensagemCard.vue'
import { getMessages, deleteMessage } from '@/services/messages.service'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const mensagens = ref([])
const carregando = ref(true)
const erro = ref(null)

function formatarData(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  } catch { return iso }
}

async function carregar() {
  carregando.value = true
  erro.value = null
  try {
    const resp = await getMessages()
    const lista = resp.data ?? resp

    mensagens.value = (Array.isArray(lista) ? lista : (lista.items ?? []))
      .map(m => ({ ...m, id: m.id ?? m._id ?? m.uuid }))
      console.log(mensagens.value)
  } catch (e) {
    erro.value = e?.response?.data?.error || e?.message || 'Falha ao carregar mensagens.'
  } finally {
    carregando.value = false
  }
}

function onEditarMensagem(id) {
  router.push({ name: 'mensagens-editar', params: { id } })
}

async function onRemoverMensagem(id) {
  if (!confirm('Deseja realmente excluir esta mensagem?')) return

  const prev = [...mensagens.value]
  mensagens.value = mensagens.value.filter(m => String(m.id) !== String(id))

  try {
    await deleteMessage(id)
  } catch (e) {
    mensagens.value = prev
    alert(e?.response?.data?.error || e?.message || 'Erro ao remover mensagem.')
  }
}

onMounted(carregar)
</script>

<style scoped>
.titulo { font-size: 1.25rem; margin-bottom: 8px; }
.acoes-topo { margin-bottom: 12px; display:flex; align-items:center; gap:12px; }
.btn { display:inline-block; padding:8px 12px; background:#42b983; color:#fff; border-radius:6px; text-decoration:none; }
.btn-pequeno { padding:6px 10px; border-radius:6px; background:#f3f4f6; border:1px solid #e5e7eb; cursor:pointer; }
.lista-mensagens { display:grid; gap:12px; margin-top:12px; }
.estado { padding:12px; border-radius:8px; margin-bottom:12px; }
.estado.carregando { background:#f3f4f6; color:#374151; }
.estado.erro { background:#fff1f2; color:#991b1b; border:1px solid #fecaca; }
.estado.vazio { color:#6b7280; }
.nota { color:#6b7280; }
</style>

