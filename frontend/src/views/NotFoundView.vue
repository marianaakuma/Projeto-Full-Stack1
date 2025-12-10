<!-- src/views/NotFoundView.vue -->
<template>
  <div class="erro404">
    <h1>❌ 404</h1>
    <p>Página não encontrada.</p>

    <RouterLink to="/mensagens" class="btn">
      ⬅ Voltar para Mensagens
    </RouterLink>
  </div>
</template>

<script setup></script>

<style scoped>
.erro404 {
  text-align: center;
  margin-top: 40px;
}
.btn {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 14px;
  background: #42b983;
  color: white;
  border-radius: 6px;
}
</style>