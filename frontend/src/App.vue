<!-- template atualizado do App.vue -->
<template>
   <div class="container">
    <RouterView />
  </div>
</template>

<!-- script atualizado do App.vue -->
<script setup>
import Notification from './components/Notification.vue'
import ResourceList from './components/ResourceList.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.titulo {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitulo {
  text-align: center;
  color: rgba(255,255,255,0.9);
  font-size: 1.1rem;
  margin-bottom: 30px;
}
</style>