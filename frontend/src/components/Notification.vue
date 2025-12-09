<template>
  <div class="notification-container">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification',
          `notification-${notification.type}`,
          { 'notification-fading': notification.fading }
        ]"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else-if="notification.type === 'warning'">⚠️</span>
          <span v-else-if="notification.type === 'info'">ℹ️</span>
          <span v-else>💬</span>
        </div>
        
        <div class="notification-content">
          <div class="notification-title" v-if="notification.title">
            {{ notification.title }}
          </div>
          <div class="notification-message">
            {{ notification.message }}
          </div>
        </div>
        
        <button
          class="notification-close"
          @click="dismiss(notification.id)"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

// Estado reativo para notificações
const notifications = reactive([])
let nextId = 1

// Função para adicionar notificação
function addNotification(type, message, title = null, duration = 5000) {
  const id = nextId++
  const notification = {
    id,
    type,
    message,
    title,
    fading: false
  }
  
  notifications.push(notification)
  
  // Auto-dismiss após o tempo especificado
  if (duration > 0) {
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }
  
  return id
}

// Função para remover notificação
function dismiss(id) {
  const notification = notifications.find(n => n.id === id)
  if (notification) {
    // Adicionar classe de fade out
    notification.fading = true
    
    // Remover após animação
    setTimeout(() => {
      const index = notifications.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.splice(index, 1)
      }
    }, 300)
  }
}

// Funções auxiliares para diferentes tipos de notificações
function success(message, title = null, duration = 5000) {
  return addNotification('success', message, title, duration)
}

function error(message, title = null, duration = 8000) {
  return addNotification('error', message, title, duration)
}

function warning(message, title = null, duration = 6000) {
  return addNotification('warning', message, title, duration)
}

function info(message, title = null, duration = 5000) {
  return addNotification('info', message, title, duration)
}

// Expor funções globalmente
onMounted(() => {
  // Adicionar ao objeto window para acesso global
  window.$notify = {
    success,
    error,
    warning,
    info,
    add: addNotification,
    dismiss
  }
})

// Limpar ao desmontar
onUnmounted(() => {
  if (window.$notify) {
    delete window.$notify
  }
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
}

.notification {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notification-success {
  background: #d4edda;
  border-left-color: #28a745;
  color: #155724;
}

.notification-error {
  background: #f8d7da;
  border-left-color: #dc3545;
  color: #721c24;
}

.notification-warning {
  background: #fff3cd;
  border-left-color: #ffc107;
  color: #856404;
}

.notification-info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
  color: #0c5460;
}

.notification-fading {
  opacity: 0;
  transform: translateX(100%);
}

.notification-icon {
  margin-right: 12px;
  font-size: 18px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  margin-right: 8px;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
}

.notification-message {
  font-size: 13px;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  padding: 0;
  margin-left: 8px;
  flex-shrink: 0;
}

.notification-close:hover {
  opacity: 1;
}

/* Animações de entrada e saída */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsividade */
@media (max-width: 480px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .notification {
    margin-bottom: 8px;
  }
}

/* Barra de progresso de auto-dismiss */
.notification::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: currentColor;
  opacity: 0.3;
  animation: progressBar 5s linear;
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.notification-fading::after {
  animation: none;
}
</style>