<template>
  <div class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEdit ? 'Editar Comentário' : 'Novo Comentário' }}</h3>
        <button class="btn-close" @click="handleCancel">✕</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="subresource-form">
        <!-- Campo de Conteúdo -->
        <div class="form-group">
          <label for="conteudo">Comentário *</label>
          <textarea
            id="conteudo"
            v-model="formData.conteudo"
            rows="4"
            required
            placeholder="Digite seu comentário..."
            :class="{ 'error': errors.conteudo }"
          ></textarea>
          <span v-if="errors.conteudo" class="error-message">{{ errors.conteudo }}</span>
        </div>


        <!-- Mensagem de Erro Geral -->
        <div v-if="errors.general" class="error-message general-error">
          {{ errors.general }}
        </div>

        <!-- Botões de Ação -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-cancel"
            @click="handleCancel"
            :disabled="saving"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="btn-submit"
            :disabled="saving"
          >
            {{ saving ? '⏳ Salvando...' : (isEdit ? 'Atualizar' : 'Criar') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { createSubResource, updateSubResource } from '../services/subResourceService.js'

// Props e Emits
const props = defineProps({
  model: {
    type: Object,
    default: null
  },
  resourceId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

// Estado
const saving = ref(false)
const formData = reactive({
  conteudo: ''
})

const errors = reactive({
  conteudo: '',
  general: ''
})

// Computed
const isEdit = computed(() => !!props.model)

// Inicializar formulário com dados do modelo se for edição
if (isEdit.value) {
  formData.conteudo = props.model.content || props.model.conteudo || ''
}

// Funções de Validação
function validateForm() {
  let isValid = true
  
  // Limpar erros anteriores
  errors.conteudo = ''
  errors.general = ''
  
  // Validar conteúdo
  if (!formData.conteudo.trim()) {
    errors.conteudo = 'O comentário é obrigatório.'
    isValid = false
  } else if (formData.conteudo.trim().length < 3) {
    errors.conteudo = 'O comentário deve ter pelo menos 3 caracteres.'
    isValid = false
  }
  
  return isValid
}

// Submissão do Formulário
async function handleSubmit() {
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  errors.general = ''
  
  try {
    let result
    
    if (isEdit.value) {
      // Atualizar sub-recurso existente
      result = await updateSubResource(props.resourceId, props.model.id, {
        content: formData.conteudo
      })
    } else {
      // Criar novo sub-recurso
      result = await createSubResource({
        postId: props.resourceId,
        content: formData.conteudo
      })
    }
    
    // Emitir evento de sucesso
    emit('save', result)
    
  } catch (error) {
    errors.general = error.message || 'Erro ao salvar comentário. Tente novamente.'
  } finally {
    saving.value = false
  }
}

// Cancelar
function handleCancel() {
  if (!saving.value) {
    emit('cancel')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
}

.btn-close:hover {
  color: #333;
}

.subresource-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.general-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}

.btn-cancel,
.btn-submit {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-submit {
  background: #42b983;
  color: white;
}

.btn-cancel:hover {
  opacity: 0.9;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>