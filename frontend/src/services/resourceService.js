import api from './api.js'

/**
 * Lista todos os recursos com filtros opcionais
 * GET /resources
 */
export async function getResources(filters = {}) {
  try {
    let url = '/resources'
    const params = new URLSearchParams()
    
    // Aplicar filtros
    if (filters.titulo) {
      params.append('titulo_like', filters.titulo)
    }
    if (filters.autor) {
      params.append('autor_like', filters.autor)
    }
    if (filters.status) {
      params.append('status', filters.status)
    }
    if (filters.dataInicio && filters.dataFim) {
      // Filtrar por intervalo de datas
      params.append('data_gte', filters.dataInicio)
      params.append('data_lte', filters.dataFim)
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    const resposta = await api.get(url)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar recursos.',
      status: 500
    }
  }
}

/**
 * Busca um recurso por ID
 * GET /resources/:id
 */
export async function getResourceById(id) {
  try {
    const resposta = await api.get(`/resources/${id}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar recurso.',
      status: 500
    }
  }
}

/**
 * Cria um novo recurso
 * POST /resources
 */
export async function createResource(dados) {
  try {
    const resposta = await api.post('/resources', dados)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao criar recurso.',
      status: 500
    }
  }
}

/**
 * Atualiza um recurso existente
 * PUT /resources/:id
 */
export async function updateResource(id, dados) {
  try {
    const resposta = await api.put(`/resources/${id}`, dados)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao atualizar recurso.',
      status: 500
    }
  }
}

/**
 * Remove um recurso
 * DELETE /resources/:id
 */
export async function deleteResource(id) {
  try {
    const resposta = await api.delete(`/resources/${id}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao remover recurso.',
      status: 500
    }
  }
}