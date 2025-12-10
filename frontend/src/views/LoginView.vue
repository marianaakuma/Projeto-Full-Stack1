<!-- src/views/LoginView.vue -->
<template>
  <div class="login-container">
    <h1 class="titulo">🔐 Acesso ao Sistema</h1>

    <form class="login-form" @submit.prevent="entrar">

      <div class="grupo">
        <label for="email">Email</label>
        <input id="email"
          type="email"
          v-model.trim="email"
          required
          placeholder="seuemail@example.com"
        />
      </div>

      <div class="grupo">
        <label for="senha">Senha</label>
        <input id="senha"
          type="password"
          v-model.trim="senha"
          required
          placeholder="••••••••"
        />
      </div>

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button class="btn" type="submit" :disabled="carregando">
        <span v-if="!carregando">Entrar</span>
        <span v-else>Carregando...</span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const senha = ref('')
const erro = ref(null)
const carregando = ref(false)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

async function entrar() {
  erro.value = null
  carregando.value = true

  try {
    // 1. autenticar usuário
    await auth.login(email.value, senha.value)

    // 2. Se guardou uma rota original (página que o usuário tentou acessar)
    //    use-a. Caso contrário, vá para /mensagens.
    const destino = route.query.redirect || '/mensagens'
    router.push(destino)

  } catch (e) {
    erro.value = e?.response?.data?.error || 'Credenciais inválidas.'
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 360px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.titulo {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grupo {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
}

input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 4px rgba(66, 184, 131, 0.15);
}

.btn {
  background: #42b883;
  padding: 12px;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.erro {
  color: #b91c1c;
  font-size: 0.9rem;
}
</style>
