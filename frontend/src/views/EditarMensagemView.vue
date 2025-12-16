<!-- src/views/EditarMensagemView.vue -->
<template>
  <div>
    <h1 class="titulo">✏️ Editar Mensagem</h1>

    <div v-if="carregando" class="estado carregando">
      Carregando dados da mensagem...
    </div>

    <div v-else-if="erro" class="estado erro">
      ⚠️ {{ erro }}
    </div>

    <MensagemForm v-else
      :modelo="mensagem"
      @salvar="atualizar"
      @cancelar="cancelar"
    />

    <button class="voltar" @click="router.back()">⬅ Voltar</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MensagemForm from '@/components/MensagemForm.vue'
import {
  getMessage,
  updateMessage
} from '@/services/messages.service'
import { useAuthStore } from '@/stores/auth'
import { isAdmin, isOwner } from '@/utils/permissions'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const id = route.params.id
const mensagem = ref(null)
const carregando = ref(true)
const erro = ref(null)

async function carregar() {
  carregando.value = true
  erro.value = null

  try {
    const resp = await getMessage(id)
    const data = resp.data ?? resp

    if (!data) {
      erro.value = 'Mensagem não encontrada.'
      return
    }

    mensagem.value = {
      ...data,
      id: data.id ?? data._id ?? data.uuid
    }

    // verificação defensiva - apenas o dono pode editar
    if (!isOwner(auth.user, mensagem.value)) {
      erro.value = 'Você não tem permissão para editar esta mensagem. Apenas o dono pode editar.'
      mensagem.value = null
    }

  } catch (e) {
    erro.value = e?.response?.data?.error || e?.message || 'Erro ao carregar mensagem.'
  } finally {
    carregando.value = false
  }
}

async function atualizar(payload) {
  try {
    // Converter campos do português para inglês (backend espera title e content)
    const dadosParaBackend = {
      title: payload.titulo || payload.title,
      content: payload.conteudo || payload.content
    }
    await updateMessage(id, dadosParaBackend) // ID vem da rota, NÃO do payload
    // Mensagem UX: Sucesso ao atualizar
    if (window.$notify) {
      window.$notify.success('Mensagem atualizada com sucesso!')
    }
    router.push('/mensagens')
  } catch (e) {
    // Mensagem UX: Erro ao atualizar
    if (window.$notify) {
      window.$notify.error(e?.response?.data?.error || e?.message || 'Erro ao atualizar mensagem.')
    }
  }
}

function cancelar() {
  router.back()
}

onMounted(carregar)
</script>

<style scoped>
.titulo { margin-bottom:12px; font-size:1.25rem; }
.estado { padding:12px; border-radius:8px; margin-bottom:12px; }
.estado.carregando { background:#f3f4f6; color:#374151; }
.estado.erro { background:#fff1f2; color:#991b1b; border:1px solid #fecaca; }
.voltar { margin-top:12px; padding:8px 14px; background:#e5e7eb; border-radius:6px; border:none; cursor:pointer; }
</style>

