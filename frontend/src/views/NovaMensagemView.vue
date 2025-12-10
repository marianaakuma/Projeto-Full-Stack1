<!-- src/views/NovaMensagemView.vue -->
<template>
  <div>
    <h1 class="titulo">➕ Nova Mensagem</h1>

    <MensagemForm v-if="auth.isAuthenticated"
      @adicionar="salvar"
    />

    <div v-else class="estado aviso">
      Você precisa estar logado para criar uma mensagem.
    </div>

    <button class="voltar" @click="router.back()">⬅ Voltar</button>
  </div>
</template>

<script setup>
import MensagemForm from '@/components/MensagemForm.vue'
import { useRouter } from 'vue-router'
import { createMessage } from '@/services/messages.service'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

async function salvar(payload) {
  try {
    await createMessage(payload)
    router.push('/mensagens')
  } catch (e) {
    alert(e?.response?.data?.error || e?.message || 'Erro ao criar mensagem.')
  }
}
</script>

<style scoped>
.titulo { margin-bottom:12px; font-size:1.25rem; }
.estado.aviso { padding:10px; border-radius:8px; background:#fffbeb; color:#92400e; margin-bottom:12px; }
.voltar { margin-top:12px; padding:6px 12px; border-radius:6px; background:#e5e7eb; border:none; cursor:pointer; }
</style>

