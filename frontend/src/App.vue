<template>
  <div id="app">
    <!-- Componente de Notificações -->
    <Notification />
    
    <!-- Router View -->
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Notification from '@/components/Notification.vue'

const router = useRouter()

// Inicialização
onMounted(() => {
  // Garantir que o sistema de notificações está disponível
  if (!window.$notify) {
    console.warn('Sistema de notificações não inicializado')
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>