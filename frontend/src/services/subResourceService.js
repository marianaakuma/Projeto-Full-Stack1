import api from './api.js'

/**
 * Lista todos os sub-recursos de um recurso específico
 * GET /subresources?resourceId=:resourceId
 */
export async function getSubResources(resourceId) {
  try {
    const resposta = await api.get(`/subresources?resourceId=${resourceId}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar sub-recursos.',
      status: 500
    }
  }
}

/**
 * Busca um sub-recurso por ID
 * GET /subresources/:id
 */
export async function getSubResourceById(id) {
  try {
    const resposta = await api.get(`/subresources/${id}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar sub-recurso.',
      status: 500
    }
  }
}

/**
 * Cria um novo sub-recurso
 * POST /subresources
 */
export async function createSubResource(dados) {
  try {
    const resposta = await api.post('/subresources', dados)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao criar sub-recurso.',
      status: 500
    }
  }
}

/**
 * Atualiza um sub-recurso existente
 * PUT /subresources/:id
 */
export async function updateSubResource(id, dados) {
  try {
    const resposta = await api.put(`/subresources/${id}`, dados)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao atualizar sub-recurso.',
      status: 500
    }
  }
}

/**
 * Remove um sub-recurso
 * DELETE /subresources/:id
 */
export async function deleteSubResource(id) {
  try {
    const resposta = await api.delete(`/subresources/${id}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao remover sub-recurso.',
      status: 500
    }
  }
}