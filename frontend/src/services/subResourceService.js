import api from './api.js'

/**
 * Lista todos os comentários de um post específico
 * GET /comments/:post_id
 */
export async function getSubResources(postId) {
  try {
    const resposta = await api.get(`/comments/${postId}`)
    return resposta.data || []
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar comentários.',
      status: 500
    }
  }
}

/**
 * Busca um comentário por ID (não usado diretamente, mas mantido para compatibilidade)
 * GET /comments/:post_id/:comment_id
 */
export async function getSubResourceById(postId, commentId) {
  try {
    const resposta = await api.get(`/comments/${postId}/${commentId}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao carregar comentário.',
      status: 500
    }
  }
}

/**
 * Cria um novo comentário
 * POST /comments/:post_id
 */
export async function createSubResource(dados) {
  try {
    const { postId, content } = dados
    const resposta = await api.post(`/comments/${postId}`, { content })
    return resposta.data.comment || resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao criar comentário.',
      status: 500
    }
  }
}

/**
 * Atualiza um comentário existente
 * PUT /comments/:post_id/:comment_id
 */
export async function updateSubResource(postId, commentId, dados) {
  try {
    const resposta = await api.put(`/comments/${postId}/${commentId}`, { content: dados.content })
    return resposta.data.comment || resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao atualizar comentário.',
      status: 500
    }
  }
}

/**
 * Remove um comentário
 * DELETE /comments/:post_id/:comment_id
 */
export async function deleteSubResource(postId, commentId) {
  try {
    const resposta = await api.delete(`/comments/${postId}/${commentId}`)
    return resposta.data
  } catch (erro) {
    throw erro.response?.data || {
      erro: 'NetworkError',
      message: 'Falha ao remover comentário.',
      status: 500
    }
  }
}