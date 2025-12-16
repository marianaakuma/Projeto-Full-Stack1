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

    <!-- Filtros -->
    <div class="filtros-container">
      <div class="filtros-grid">
        <!-- Filtro 1: Pesquisa por texto (título/conteúdo) -->
        <div class="filtro-grupo">
          <label for="filtro-texto">🔍 Pesquisar</label>
          <input
            id="filtro-texto"
            v-model="filtros.texto"
            type="text"
            placeholder="Título ou conteúdo..."
            @input="aplicarFiltros"
          />
        </div>

        <!-- Filtro 2: Autor -->
        <div class="filtro-grupo">
          <label for="filtro-autor">👤 Autor</label>
          <input
            id="filtro-autor"
            v-model="filtros.autor"
            type="text"
            placeholder="Nome do autor..."
            @input="aplicarFiltros"
          />
        </div>

        <!-- Filtro 3: Data inicial -->
        <div class="filtro-grupo">
          <label for="filtro-data-inicio">📅 Data Inicial</label>
          <input
            id="filtro-data-inicio"
            v-model="filtros.dataInicio"
            type="date"
            @change="aplicarFiltros"
          />
        </div>

        <!-- Filtro 4: Data final -->
        <div class="filtro-grupo">
          <label for="filtro-data-fim">📅 Data Final</label>
          <input
            id="filtro-data-fim"
            v-model="filtros.dataFim"
            type="date"
            @change="aplicarFiltros"
          />
        </div>

        <!-- Filtro 5: Ordenação -->
        <div class="filtro-grupo">
          <label for="filtro-ordenacao">🔄 Ordenar por</label>
          <select
            id="filtro-ordenacao"
            v-model="filtros.ordenacao"
            @change="aplicarFiltros"
          >
            <option value="recente">Mais Recente</option>
            <option value="antigo">Mais Antigo</option>
            <option value="titulo-asc">Título (A-Z)</option>
            <option value="titulo-desc">Título (Z-A)</option>
            <option value="autor-asc">Autor (A-Z)</option>
          </select>
        </div>
      </div>

      <button 
        v-if="temFiltrosAtivos" 
        class="btn-limpar" 
        @click="limparFiltros"
      >
        🗑️ Limpar Filtros
      </button>
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

    <div v-else-if="mensagensFiltradas.length === 0" class="estado vazio">
      🗒️ {{ temFiltrosAtivos ? 'Nenhuma mensagem encontrada com os filtros aplicados.' : 'Nenhuma mensagem encontrada.' }}
    </div>

    <div v-else class="lista-mensagens">
      <MensagemCard 
        v-for="msg in mensagensFiltradas"
        :key="msg.id || msg._id || msg.uuid"
        :id="Number(msg.id) || Number(msg._id) || Number(msg.uuid)"
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
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import MensagemCard from '@/components/MensagemCard.vue'
import { getMessages, deleteMessage } from '@/services/messages.service'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const mensagens = ref([])
const mensagensFiltradas = ref([])
const carregando = ref(true)
const erro = ref(null)

// Filtros
const filtros = ref({
  texto: '',
  autor: '',
  dataInicio: '',
  dataFim: '',
  ordenacao: 'recente'
})

const temFiltrosAtivos = computed(() => {
  return filtros.value.texto !== '' || 
         filtros.value.autor !== '' || 
         filtros.value.dataInicio !== '' || 
         filtros.value.dataFim !== '' ||
         filtros.value.ordenacao !== 'recente'
})

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
    
    aplicarFiltros()
    
    // Mensagem UX: Sucesso ao carregar
    if (window.$notify && mensagens.value.length > 0) {
      window.$notify.success(`Carregadas ${mensagens.value.length} mensagem(ns) com sucesso!`)
    }
  } catch (e) {
    erro.value = e?.response?.data?.error || e?.message || 'Falha ao carregar mensagens.'
    // Mensagem UX: Erro ao carregar
    if (window.$notify) {
      window.$notify.error('Erro ao carregar mensagens. Tente novamente.')
    }
  } finally {
    carregando.value = false
  }
}

function aplicarFiltros() {
  let resultado = [...mensagens.value]

  // Filtro 1: Texto (título ou conteúdo)
  if (filtros.value.texto) {
    const texto = filtros.value.texto.toLowerCase()
    resultado = resultado.filter(msg => 
      (msg.title?.toLowerCase().includes(texto) || 
       msg.content?.toLowerCase().includes(texto))
    )
  }

  // Filtro 2: Autor
  if (filtros.value.autor) {
    const autor = filtros.value.autor.toLowerCase()
    resultado = resultado.filter(msg => 
      msg.author?.toLowerCase().includes(autor)
    )
  }

  // Filtro 3 e 4: Data
  if (filtros.value.dataInicio || filtros.value.dataFim) {
    resultado = resultado.filter(msg => {
      if (!msg.created_at) return false
      const msgDate = new Date(msg.created_at)
      
      if (filtros.value.dataInicio) {
        const inicio = new Date(filtros.value.dataInicio)
        inicio.setHours(0, 0, 0, 0)
        if (msgDate < inicio) return false
      }
      
      if (filtros.value.dataFim) {
        const fim = new Date(filtros.value.dataFim)
        fim.setHours(23, 59, 59, 999)
        if (msgDate > fim) return false
      }
      
      return true
    })
  }

  // Filtro 5: Ordenação
  resultado.sort((a, b) => {
    switch (filtros.value.ordenacao) {
      case 'recente':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      case 'antigo':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0)
      case 'titulo-asc':
        return (a.title || '').localeCompare(b.title || '')
      case 'titulo-desc':
        return (b.title || '').localeCompare(a.title || '')
      case 'autor-asc':
        return (a.author || '').localeCompare(b.author || '')
      default:
        return 0
    }
  })

  mensagensFiltradas.value = resultado
}

function limparFiltros() {
  filtros.value = {
    texto: '',
    autor: '',
    dataInicio: '',
    dataFim: '',
    ordenacao: 'recente'
  }
  aplicarFiltros()
  
  // Mensagem UX: Filtros limpos
  if (window.$notify) {
    window.$notify.info('Filtros limpos com sucesso!')
  }
}

function onEditarMensagem(id) {
  if (!id) {
    console.error('ID não fornecido para editar')
    if (window.$notify) {
      window.$notify.error('Erro: ID da mensagem não encontrado.')
    }
    return
  }
  router.push({ name: 'mensagens-editar', params: { id: String(id) } })
}

async function onRemoverMensagem(id) {
  if (!id) {
    console.error('ID não fornecido para remover')
    if (window.$notify) {
      window.$notify.error('Erro: ID da mensagem não encontrado.')
    }
    return
  }

  if (!confirm('Deseja realmente excluir esta mensagem?')) return

  const prev = [...mensagens.value]
  const prevFiltradas = [...mensagensFiltradas.value]
  mensagens.value = mensagens.value.filter(m => String(m.id) !== String(id))
  mensagensFiltradas.value = mensagensFiltradas.value.filter(m => String(m.id) !== String(id))

  try {
    await deleteMessage(String(id))
    // Mensagem UX: Sucesso ao remover
    if (window.$notify) {
      window.$notify.success('Mensagem removida com sucesso!')
    }
  } catch (e) {
    mensagens.value = prev
    mensagensFiltradas.value = prevFiltradas
    // Mensagem UX: Erro ao remover
    if (window.$notify) {
      window.$notify.error(e?.response?.data?.error || e?.message || 'Erro ao remover mensagem.')
    }
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

/* Filtros */
.filtros-container {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.filtro-grupo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filtro-grupo label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.filtro-grupo input,
.filtro-grupo select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.filtro-grupo input:focus,
.filtro-grupo select:focus {
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.btn-limpar {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-limpar:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }
}
</style>

