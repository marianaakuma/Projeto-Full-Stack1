// src/services/mensagensService.js
import api from '@/services/api.js'

/**
 * Lista todas as mensagens.
 * GET /mensagens
 */
export async function getMensagens() {
  try {
    const resposta = await api.get('/mensagens')
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar mensagens.',
      status: 500
    }
  }
}

/**
 * Busca uma única mensagem por ID.
 * GET /mensagens/:id
 */
export async function getMensagem(id) {
  try {
    const resposta = await api.get(`/mensagens/${id}`)
    return resposta.data
  } catch (erro) {
    // Repassa informação de erro da API quando disponível
    const payload = erro.response?.data
    if (payload) throw payload
    throw {
      erro: 'NetworkError',
      message: 'Falha ao carregar a mensagem.',
      status: erro.response?.status || 500
    }
  }
}

/**
 * Cria uma nova mensagem.
 * POST /mensagens
 */
export async function criarMensagem(dados) {
  try {
    const resposta = await api.post('/mensagens', dados)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao criar mensagem.',
      status: 500
    }
  }
}

/**
 * Atualiza uma mensagem existente.
 * PUT /mensagens/:id
 */
export async function atualizarMensagem(id, dados) {
  try {
    const resposta = await api.put(`/mensagens/${id}`, dados)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao atualizar mensagem.',
      status: 500
    }
  }
}

/**
 * Remove uma mensagem.
 * DELETE /mensagens/:id
 */
export async function removerMensagem(id) {
  try {
    const resposta = await api.delete(`/mensagens/${id}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao remover mensagem.',
      status: 500
    }
  }
}