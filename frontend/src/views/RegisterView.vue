<!-- src/views/RegisterView.vue -->
<template>
  <div class="register-container">
    <h1 class="titulo">📝 Criar Conta</h1>

    <form class="register-form" @submit.prevent="registrar">
      <div class="grupo">
        <label for="username">Nome de Usuário</label>
        <input
          id="username"
          type="text"
          v-model.trim="username"
          required
          placeholder="Seu nome de usuário"
          :class="{ 'error': errors.username }"
        />
        <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
      </div>

      <div class="grupo">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model.trim="email"
          required
          placeholder="seuemail@example.com"
          :class="{ 'error': errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="grupo">
        <label for="password">Senha</label>
        <input
          id="password"
          type="password"
          v-model.trim="password"
          required
          placeholder="••••••••"
          :class="{ 'error': errors.password }"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <div class="grupo">
        <label for="confirmPassword">Confirmar Senha</label>
        <input
          id="confirmPassword"
          type="password"
          v-model.trim="confirmPassword"
          required
          placeholder="••••••••"
          :class="{ 'error': errors.confirmPassword }"
        />
        <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
      </div>

      <p v-if="erro" class="erro">{{ erro }}</p>

      <button class="btn" type="submit" :disabled="carregando">
        <span v-if="!carregando">Criar Conta</span>
        <span v-else>Registrando...</span>
      </button>

      <div class="login-link">
        <p>Já tem uma conta? <RouterLink to="/login">Fazer login</RouterLink></p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const erro = ref(null)
const carregando = ref(false)

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function validarFormulario() {
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  let isValid = true

  // Validar username
  if (!username.value.trim()) {
    errors.value.username = 'Nome de usuário é obrigatório'
    isValid = false
  } else if (username.value.trim().length < 3) {
    errors.value.username = 'Nome de usuário deve ter pelo menos 3 caracteres'
    isValid = false
  }

  // Validar email
  if (!email.value.trim()) {
    errors.value.email = 'Email é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Email inválido'
    isValid = false
  }

  // Validar senha
  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
    isValid = false
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  // Validar confirmação de senha
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Confirmação de senha é obrigatória'
    isValid = false
  } else if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'As senhas não coincidem'
    isValid = false
  }

  return isValid
}

async function registrar() {
  erro.value = null

  if (!validarFormulario()) {
    return
  }

  carregando.value = true

  try {
    await auth.register(username.value, email.value, password.value)
    
    // Mensagem UX: Sucesso no registro
    if (window.$notify) {
      window.$notify.success(`Conta criada com sucesso! Bem-vindo, ${username.value}!`)
    }

    // Redirecionar para mensagens após registro bem-sucedido
    router.push('/mensagens')
  } catch (e) {
    erro.value = e?.response?.data?.message || e?.response?.data?.error || 'Erro ao criar conta. Tente novamente.'
    
    // Mensagem UX: Erro no registro
    if (window.$notify) {
      window.$notify.error(erro.value)
    }
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.titulo {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.5rem;
  color: #333;
}

.register-form {
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
  color: #374151;
  font-size: 14px;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 4px rgba(66, 184, 131, 0.15);
}

input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.erro {
  color: #b91c1c;
  font-size: 0.9rem;
  text-align: center;
  padding: 8px;
  background: #fee2e2;
  border-radius: 6px;
}

.btn {
  background: #42b883;
  padding: 12px;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s;
  margin-top: 8px;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.login-link p {
  color: #6b7280;
  font-size: 14px;
}

.login-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>

