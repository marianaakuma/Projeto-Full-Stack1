<!-- src/components/MensagemCard.vue -->
<template>
  <div class="card">
    <h3 class="titulo">
      <slot name="titulo"></slot>
    </h3>

    <p class="conteudo">
      <slot name="conteudo"></slot>
    </p>

    <div class="info">
      <small>👤 <slot name="autor"></slot></small>
      <small>🕒 <slot name="data"></slot></small>
    </div>

    <div class="acoes" v-if="canEdit || canDelete">
      <button v-if="canEdit" class="editar" @click="onEditar">✏️ Editar</button>
      <button v-if="canDelete" class="remover" @click="onRemover">🗑️ Excluir</button>
    </div>

    <!-- Seção de Comentários -->
    <div class="comentarios-section">
      <SubResourceList :resource-id="id" />
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  background: #fff;
}

.titulo {
  margin-bottom: 6px;
  font-weight: 700;
  color: #222;
}

.conteudo {
  margin-bottom: 12px;
}

.info {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
  font-size: 14px;
}

.acoes {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

button {
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

button.editar {
  background: #3b82f6;
  color: white;
}

button.remover {
  background: #ef4444;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.comentarios-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}
</style>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { canEditMessage, canDeleteMessage } from '@/utils/permissions'
import SubResourceList from './SubResourceList.vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
  mensagem: { type: Object, default: null }
})

const emit = defineEmits(['editar', 'remover'])

const auth = useAuthStore()

function onEditar() { 
  const id = Number(props.id) || Number(props.mensagem?.id)
  if (!id || isNaN(id)) {
    console.error('ID não encontrado para editar', { id: props.id, mensagem: props.mensagem })
    if (window.$notify) {
      window.$notify.error('Erro: ID da mensagem não encontrado.')
    }
    return
  }
  emit('editar', id) 
}

function onRemover() { 
  const id = Number(props.id) || Number(props.mensagem?.id)
  if (!id || isNaN(id)) {
    console.error('ID não encontrado para remover', { id: props.id, mensagem: props.mensagem })
    if (window.$notify) {
      window.$notify.error('Erro: ID da mensagem não encontrado.')
    }
    return
  }
  emit('remover', id) 
}

const canEdit = computed(() => canEditMessage(auth.user, props.mensagem))
const canDelete = computed(() => canDeleteMessage(auth.user, props.mensagem))

const displayAutor = computed(() => {
  const m = props.mensagem
  if (!m) return '—'
  return m.author || m.autor?.nome || m.usuario_nome || m.autor_nome || '—'
})
</script>

<style scoped>
.card {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e6e9ef;
  background: #fff;
  box-shadow: 0 4px 12px rgba(16,24,40,0.04);
}
.card-header { font-weight:700; margin-bottom:8px; }
.card-body { margin:10px 0; white-space:pre-wrap; }
.card-footer { display:flex; justify-content:space-between; align-items:center; margin-top:12px; }
.meta { display:flex; gap:8px; color:#6b7280; }
.acoes { display:flex; gap:8px; }
.btn { padding:6px 10px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
.btn.editar { background:#3b82f6; color:#fff; }
.btn.remover { background:#ef4444; color:#fff; }
.btn:hover { opacity:0.95; }
</style>
