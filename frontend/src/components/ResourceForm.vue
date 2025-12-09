<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEditing ? 'Editar Recurso' : 'Criar Novo Recurso' }}</h3>
        <button class="close-btn" @click="cancel">&times;</button>
      </div>
      
      <form @submit.prevent="save" class="resource-form">
        <div class="form-group">
          <label for="titulo">Título *</label>
          <input
            id="titulo"
            v-model="formData.titulo"
            type="text"
            required
            maxlength="100"
            placeholder="Digite o título do recurso"
          />
          <span v-if="errors.titulo" class="error-text">{{ errors.titulo }}</span>
        </div>
        
        <div class="form-group">
          <label for="conteudo">Conteúdo *</label>
          <textarea
            id="conteudo"
            v-model="formData.conteudo"
            required
            rows="4"
            maxlength="500"
            placeholder="Descreva o conteúdo do recurso"
          ></textarea>
          <span v-if="errors.conteudo" class="error-text">{{ errors.conteudo }}</span>
        </div>
        
        <div class="form-group">
          <label for="autor">Autor *</label>
          <input
            id="autor"
            v-model="formData.autor"
            type="text"
            required
            maxlength="50"
            placeholder="Nome do autor"
          />
          <span v-if="errors.autor" class="error-text">{{ errors.autor }}</span>
        </div>
        
        <div class="form-group">
          <label for="status">Status *</label>
          <select
            id="status"
            v-model="formData.status"
            required
          >
            <option value="">Selecione um status</option>
            <option value="ativo">Ativo</option>
            <option value="pendente">Pendente</option>
            <option value="resolvido">Resolvido</option>
          </select>
          <span v-if="errors.status" class="error-text">{{ errors.status }}</span>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save" :disabled="saving">
            {{ saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar') }}
          </button>
        </div>
        
        <div v-if="submitError" class="submit-error">
          ⚠️ {{ submitError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { createResource, updateResource } from '../services/resourceService.js'

// Props e Emits
const props = defineProps({
  model: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

// Estado
const formData = ref({
  titulo: '',
  conteudo: '',
  autor: '',
  status: '',
  data: ''
})

const errors = ref({
  titulo: '',
  conteudo: '',
  autor: '',
  status: ''
})

const saving = ref(false)
const submitError = ref('')

// Computed
const isEditing = computed(() => !!props.model)

// Lifecycle
onMounted(() => {
  if (props.model) {
    // Modo edição - preencher formulário com dados existentes
    formData.value = {
      titulo: props.model.titulo || '',
      conteudo: props.model.conteudo || '',
      autor: props.model.autor || '',
      status: props.model.status || '',
      data: props.model.data || ''
    }
  } else {
    // Modo criação - definir valores padrão
    formData.value = {
      titulo: '',
      conteudo: '',
      autor: '',
      status: 'ativo',
      data: new Date().toISOString()
    }
  }
})

// Validação
function validateForm() {
  let isValid = true
  errors.value = {
    titulo: '',
    conteudo: '',
    autor: '',
    status: ''
  }
  
  if (!formData.value.titulo.trim()) {
    errors.value.titulo = 'Título é obrigatório'
    isValid = false
  } else if (formData.value.titulo.trim().length < 3) {
    errors.value.titulo = 'Título deve ter pelo menos 3 caracteres'
    isValid = false
  }
  
  if (!formData.value.conteudo.trim()) {
    errors.value.conteudo = 'Conteúdo é obrigatório'
    isValid = false
  } else if (formData.value.conteudo.trim().length < 10) {
    errors.value.conteudo = 'Conteúdo deve ter pelo menos 10 caracteres'
    isValid = false
  }
  
  if (!formData.value.autor.trim()) {
    errors.value.autor = 'Autor é obrigatório'
    isValid = false
  } else if (formData.value.autor.trim().length < 2) {
    errors.value.autor = 'Autor deve ter pelo menos 2 caracteres'
    isValid = false
  }
  
  if (!formData.value.status) {
    errors.value.status = 'Status é obrigatório'
    isValid = false
  }
  
  return isValid
}

// Salvar
async function save() {
  submitError.value = ''
  
  if (!validateForm()) {
    return
  }
  
  saving.value = true
  
  try {
    let result
    if (isEditing.value) {
      // Atualizar recurso existente
      result = await updateResource(props.model.id, formData.value)
    } else {
      // Criar novo recurso
      result = await createResource(formData.value)
    }
    
    emit('save', result)
  } catch (error) {
    submitError.value = error.message || 'Erro ao salvar recurso.'
  } finally {
    saving.value = false
  }
}

// Cancelar
function cancel() {
  emit('cancel')
}

// Clicar fora do modal para fechar
function handleOverlayClick() {
  cancel()
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f5f5f5;
}

.resource-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

.error-text {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

.btn-cancel,
.btn-save {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-save {
  background: #42b983;
  color: white;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel:hover,
.btn-save:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-error {
  margin-top: 15px;
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  text-align: center;
}
</style>