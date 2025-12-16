<template>
  <div class="subresource-list">
    <div class="subresource-header">
      <h4>Comentários</h4>
      <button 
        v-if="auth.isAuthenticated"
        class="btn-add" 
        @click="openCreateModal"
      >
        ➕ Adicionar Comentário
      </button>
    </div>

    <!-- Lista de Sub-recursos -->
    <div v-if="loading" class="loading">
      ⏳ Carregando comentários...
    </div>
    
    <div v-else-if="error" class="error">
      ⚠️ {{ error }}
      <button @click="loadSubResources">Tentar novamente</button>
    </div>
    
    <div v-else-if="subResources.length === 0" class="empty">
      💬 Nenhum comentário ainda.
      <small>Seja o primeiro a comentar!</small>
    </div>
    
    <div v-else class="subresources-list">
      <div
        v-for="subResource in subResources"
        :key="subResource.id"
        class="subresource-item"
      >
        <div class="subresource-content">
          <p>{{ subResource.content || subResource.conteudo }}</p>
          <div class="subresource-meta">
            <small>📅 {{ formatDate(subResource.created_at || subResource.data) }}</small>
          </div>
        </div>
        
        <div class="subresource-actions" v-if="canEditCommentLocal(subResource) || canDeleteCommentLocal(subResource)">
          <button 
            v-if="canEditCommentLocal(subResource)"
            class="btn-edit-small" 
            @click="editSubResource(subResource)"
            title="Editar comentário"
          >
            ✏️
          </button>
          <button 
            v-if="canDeleteCommentLocal(subResource)"
            class="btn-delete-small" 
            @click="confirmDelete(subResource)"
            title="Excluir comentário"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Formulário -->
    <SubResourceForm
      v-if="showForm"
      :model="editingSubResource"
      :resource-id="resourceId"
      @save="handleSave"
      @cancel="closeForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { canEditComment, canDeleteComment } from '@/utils/permissions'
import { getSubResources, deleteSubResource } from '../services/subResourceService.js'
import SubResourceForm from './SubResourceForm.vue'

const auth = useAuthStore()

// Props e Emits
const props = defineProps({
  resourceId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['error'])

// Estado
const subResources = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingSubResource = ref(null)

// Carregar sub-recursos
async function loadSubResources() {
  loading.value = true
  error.value = null
  try {
    subResources.value = await getSubResources(props.resourceId)
  } catch (e) {
    error.value = e.message || 'Erro ao carregar comentários.'
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

// Formatar data
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Abrir modal de criação
function openCreateModal() {
  editingSubResource.value = null
  showForm.value = true
}

// Editar sub-recurso
function editSubResource(subResource) {
  editingSubResource.value = { ...subResource }
  showForm.value = true
}

// Confirmar exclusão
function confirmDelete(subResource) {
  if (confirm(`Deseja realmente excluir este comentário?`)) {
    deleteSubResourceConfirmed(subResource)
  }
}

// Excluir sub-recurso
async function deleteSubResourceConfirmed(subResource) {
  try {
    await deleteSubResource(props.resourceId, subResource.id)
    
    // Remover da lista local
    const index = subResources.value.findIndex(sr => sr.id === subResource.id)
    if (index !== -1) {
      subResources.value.splice(index, 1)
    }
    
    // Mensagem UX: Sucesso ao deletar
    if (window.$notify) {
      window.$notify.success('Comentário removido com sucesso!')
    }
  } catch (e) {
    error.value = e.message || 'Erro ao excluir comentário.'
    emit('error', error.value)
    // Mensagem UX: Erro ao deletar
    if (window.$notify) {
      window.$notify.error('Erro ao remover comentário.')
    }
  }
}

// Salvar sub-recurso (criar ou atualizar)
async function handleSave(savedSubResource) {
  try {
    if (editingSubResource.value) {
      // Atualizar na lista
      const index = subResources.value.findIndex(sr => sr.id === savedSubResource.id)
      if (index !== -1) {
        subResources.value[index] = savedSubResource
      }
      // Mensagem UX: Sucesso ao atualizar
      if (window.$notify) {
        window.$notify.success('Comentário atualizado com sucesso!')
      }
    } else {
      // Adicionar à lista
      subResources.value.push(savedSubResource)
      // Mensagem UX: Sucesso ao criar
      if (window.$notify) {
        window.$notify.success('Comentário criado com sucesso!')
      }
    }
    
    closeForm()
    // Recarregar lista para garantir sincronização
    await loadSubResources()
  } catch (e) {
    error.value = e.message || 'Erro ao salvar comentário.'
    // Mensagem UX: Erro ao salvar
    if (window.$notify) {
      window.$notify.error('Erro ao salvar comentário.')
    }
  }
}

// Fechar formulário
function closeForm() {
  showForm.value = false
  editingSubResource.value = null
}

// Watch para mudanças no resourceId
watch(() => props.resourceId, () => {
  loadSubResources()
})

// Funções de permissão (wrappers locais)
const canEditCommentLocal = (comentario) => canEditComment(auth.user, comentario)
const canDeleteCommentLocal = (comentario) => canDeleteComment(auth.user, comentario)

// Lifecycle
onMounted(() => {
  loadSubResources()
})
</script>

<style scoped>
.subresource-list {
  padding: 20px;
  background: #f8f9fa;
  border-top: 2px solid #e5e7eb;
}

.subresource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.subresource-header h4 {
  margin: 0;
  color: #333;
}

.btn-add {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-add:hover {
  opacity: 0.9;
}

.loading, .error, .empty {
  text-align: center;
  padding: 20px;
  font-size: 14px;
}

.error {
  color: #dc3545;
}

.error button {
  margin-left: 10px;
  padding: 4px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.empty {
  color: #6c757d;
}

.subresources-list {
  display: grid;
  gap: 10px;
}

.subresource-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.subresource-content {
  flex: 1;
  margin-right: 10px;
}

.subresource-content p {
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.subresource-meta {
  display: flex;
  gap: 15px;
  color: #6c757d;
  font-size: 12px;
}

.subresource-actions {
  display: flex;
  gap: 5px;
}

.btn-edit-small,
.btn-delete-small {
  padding: 5px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: opacity 0.2s;
}

.btn-edit-small {
  background: #3b82f6;
  color: white;
}

.btn-delete-small {
  background: #ef4444;
  color: white;
}

.btn-edit-small:hover,
.btn-delete-small:hover {
  opacity: 0.9;
}
</style>