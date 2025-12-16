// src/utils/permissions.js
// Helpers de RBAC (Role-Based Access Control) para uso no frontend.
// Funções puras: recebem (user, recurso) e retornam boolean.
// Projetadas para serem fáceis de testar e reutilizar.

/**
 * Normaliza role para comparação segura.
 * @param {any} role
 * @returns {string}
 */
function _normRole(role) {
    return String(role ?? '').trim().toUpperCase()
  }
  
  /**
   * Retorna true se o usuário é administrador.
   * @param {Object|null} user - objeto usuário { id, nome, role, ... }
   * @returns {boolean}
   */
  export function isAdmin(user) {
    if (!user) return false
    return _normRole(user.role) === 'ADMIN'
  }
  
  /**
   * Retorna true se o usuário é proprietário (owner) do recurso.
   * Procura por vários campos possíveis no recurso:
   *   recurso.autor?.id, recurso.usuario_id, recurso.user_id, recurso.owner_id
   *
   * @param {Object|null} user
   * @param {Object|null} recurso
   * @returns {boolean}
   */
  export function isOwner(user, recurso) {
    if (!user || !recurso) return false
  
    const ownerId =
      recurso?.autor?.id ??
      recurso?.usuario_id ??
      recurso?.user_id ??
      recurso?.owner_id ??
      null
  
    if (ownerId == null) return false
    return String(user.id) === String(ownerId)
  }
  
  /**
   * Pode o usuário editar a mensagem?
   * Política atual: apenas owner (sem admin).
   * @param {Object|null} user
   * @param {Object|null} mensagem
   * @returns {boolean}
   */
  export function canEditMessage(user, mensagem) {
    return isOwner(user, mensagem)
  }
  
  /**
   * Pode o usuário deletar a mensagem?
   * Política atual: apenas owner (sem admin).
   * @param {Object|null} user
   * @param {Object|null} mensagem
   * @returns {boolean}
   */
  export function canDeleteMessage(user, mensagem) {
    return isOwner(user, mensagem)
  }

  /**
   * Pode o usuário editar o comentário?
   * Política: apenas owner.
   * @param {Object|null} user
   * @param {Object|null} comentario
   * @returns {boolean}
   */
  export function canEditComment(user, comentario) {
    return isOwner(user, comentario)
  }

  /**
   * Pode o usuário deletar o comentário?
   * Política: apenas owner.
   * @param {Object|null} user
   * @param {Object|null} comentario
   * @returns {boolean}
   */
  export function canDeleteComment(user, comentario) {
    return isOwner(user, comentario)
  }
  
  