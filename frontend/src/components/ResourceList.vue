<template>
  <div class="resource-list">
    <div class="header">
      <h2>Recursos</h2>
      <button class="btn-primary" @click="openCreateModal">
        ➕ Novo Recurso
      </button>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <div class="filter-group">
        <label for="search">Pesquisar:</label>
        <input
          id="search"
          v-model="filters.titulo"
          type="text"
          placeholder="Título ou conteúdo..."
          @input="applyFilters"
        />
      </div>
      
      <div class="filter-group">
        <label for="status">Status:</label>
        <select
          id="status"
          v-model="filters.status"
          @change="applyFilters"
        >
          <option value="">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="pendente">Pendente</option>
          <option value="resolvido">Resolvido</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="autor">Autor:</label>
        <input
          id="autor"
          v-model="filters.autor"
          type="text"
          placeholder="Nome do autor..."
          @input="applyFilters"
        />
      </div>
      
      <div class="filter-group">
        <label>Data:</label>
        <div class="date-range">
          <input
            v-model="filters.dataInicio"
            type="date"
            @change="applyFilters"
          />
          <span>até</span>
          <input
            v-model="filters.dataFim"
            type="date"
            @change="applyFilters"
          />
        </div>
      </div>
      
      <button class="btn-secondary" @click="clearFilters">
        🗑️ Limpar Filtros
      </button>
    </div>

    <!-- Lista de Recursos -->
    <div v-if="loading" class="loading">
      ⏳ Carregando recursos...
    </div>
    
    <div v-else-if="error" class="error">
      ⚠️ {{ error }}
      <button @click="loadResources">Tentar novamente</button>
    </div>
    
    <div v-else-if="filteredResources.length === 0" class="empty">
      🗒️ Nenhum recurso encontrado.
      <small v-if="hasActiveFilters">Tente ajustar os filtros ou adicione um novo recurso.</small>
    </div>
    
    <div v-else class="resources-grid">
      <div
        v-for="resource in filteredResources"
        :key="resource.id"
        class="resource-card"
        :class="{ expanded: expandedResource === resource.id }"
      >
        <div class="resource-header" @click="toggleResource(resource.id)">
          <h3>{{ resource.titulo }}</h3>
          <div class="resource-meta">
            <span class="status" :class="resource.status">{{ resource.status }}</span>
            <span class="date">{{ formatDate(resource.data) }}</span>
          </div>
        </div>
        
        <div class="resource-content">
          <p>{{ resource.conteudo }}</p>
          <div class="resource-footer">
            <small>👤 {{ resource.autor }}</small>
            <div class="actions">
              <button class="btn-edit" @click.stop="editResource(resource)">
                ✏️ Editar
              </button>
              <button class="btn-delete" @click.stop="confirmDelete(resource)">
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>
        
        <!-- Sub-recursos -->
        <div v-if="expandedResource === resource.id" class="subresources-section">
          <SubResourceList
            :resource-id="resource.id"
            @error="handleSubResourceError"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Formulário -->
    <ResourceForm
      v-if="showForm"
      :model="editingResource"
      @save="handleSave"
      @cancel="closeForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getResources, deleteResource } from '../services/resourceService.js'
import ResourceForm from './ResourceForm.vue'
import SubResourceList from './SubResourceList.vue'

// Estado
const resources = ref([])
const filteredResources = ref([])
const loading = ref(false)
const error = ref(null)
const showForm = ref(false)
const editingResource = ref(null)
const expandedResource = ref(null)

// Filtros
const filters = ref({
  titulo: '',
  status: '',
  autor: '',
  dataInicio: '',
  dataFim: ''
})

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value !== '')
})

// Carregar recursos
async function loadResources() {
  loading.value = true
  error.value = null
  try {
    resources.value = await getResources()
    applyFilters()
  } catch (e) {
    error.value = e.message || 'Erro ao carregar recursos.'
  } finally {
    loading.value = false
  }
}

// Aplicar filtros
function applyFilters() {
  filteredResources.value = resources.value.filter(resource => {
    // Filtro por título/conteúdo
    if (filters.value.titulo) {
      const searchTerm = filters.value.titulo.toLowerCase()
      if (!resource.titulo.toLowerCase().includes(searchTerm) && 
          !resource.conteudo.toLowerCase().includes(searchTerm)) {
        return false
      }
    }
    
    // Filtro por status
    if (filters.value.status && resource.status !== filters.value.status) {
      return false
    }
    
    // Filtro por autor
    if (filters.value.autor) {
      const autorTerm = filters.value.autor.toLowerCase()
      if (!resource.autor.toLowerCase().includes(autorTerm)) {
        return false
      }
    }
    
    // Filtro por data
    if (filters.value.dataInicio || filters.value.dataFim) {
      const resourceDate = new Date(resource.data)
      if (filters.value.dataInicio) {
        const startDate = new Date(filters.value.dataInicio)
        if (resourceDate < startDate) return false
      }
      if (filters.value.dataFim) {
        const endDate = new Date(filters.value.dataFim)
        endDate.setHours(23, 59, 59, 999) // Include entire day
        if (resourceDate > endDate) return false
      }
    }
    
    return true
  })
}

// Limpar filtros
function clearFilters() {
  filters.value = {
    titulo: '',
    status: '',
    autor: '',
    dataInicio: '',
    dataFim: ''
  }
  applyFilters()
}

// Expandir/Recolher recurso
function toggleResource(resourceId) {
  expandedResource.value = expandedResource.value === resourceId ? null : resourceId
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
  editingResource.value = null
  showForm.value = true
}

// Editar recurso
function editResource(resource) {
  editingResource.value = { ...resource }
  showForm.value = true
}

// Confirmar exclusão
function confirmDelete(resource) {
  if (confirm(`Deseja realmente excluir "${resource.titulo}"?\n\nIsso também removerá todos os sub-recursos relacionados.`)) {
    deleteResourceConfirmed(resource)
  }
}

// Excluir recurso
async function deleteResourceConfirmed(resource) {
  try {
    await deleteResource(resource.id)
    
    // Remover da lista local
    const index = resources.value.findIndex(r => r.id === resource.id)
    if (index !== -1) {
      resources.value.splice(index, 1)
      applyFilters()
    }
    
    // Fechar se estava expandido
    if (expandedResource.value === resource.id) {
      expandedResource.value = null
    }
  } catch (e) {
    error.value = e.message || 'Erro ao excluir recurso.'
  }
}

// Salvar recurso (criar ou atualizar)
async function handleSave(savedResource) {
  if (editingResource.value) {
    // Atualizar na lista
    const index = resources.value.findIndex(r => r.id === savedResource.id)
    if (index !== -1) {
      resources.value[index] = savedResource
    }
  } else {
    // Adicionar à lista
    resources.value.push(savedResource)
  }
  
  applyFilters()
  closeForm()
}

// Fechar formulário
function closeForm() {
  showForm.value = false
  editingResource.value = null
}

// Erro de sub-recurso
function handleSubResourceError(errorMessage) {
  error.value = errorMessage
}

// Lifecycle
onMounted(() => {
  loadResources()
})
</script>

<style scoped>
.resource-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
}

.filter-group input,
.filter-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-range span {
  white-space: nowrap;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.error button {
  margin-left: 10px;
  padding: 5px 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty {
  color: #6c757d;
}

.resources-grid {
  display: grid;
  gap: 15px;
}

.resource-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: all 0.3s ease;
}

.resource-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.resource-header {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resource-header h3 {
  margin: 0;
  color: #333;
}

.resource-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.ativo {
  background: #d4edda;
  color: #155724;
}

.status.pendente {
  background: #fff3cd;
  color: #856404;
}

.status.resolvido {
  background: #cce5ff;
  color: #004085;
}

.date {
  color: #6c757d;
  font-size: 14px;
}

.resource-content {
  padding: 0 20px 20px;
}

.resource-content p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.resource-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary, .btn-edit, .btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-primary:hover, .btn-secondary:hover, .btn-edit:hover, .btn-delete:hover {
  opacity: 0.9;
}

.subresources-section {
  border-top: 2px solid #f0f0f0;
  background: #f8f9fa;
}
</style>