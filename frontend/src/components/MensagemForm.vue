<!-- src/components/MensagemForm.vue -->
<template>
  <form class="form" @submit.prevent="enviarMensagem">
    <div class="grupo">
      <label for="titulo">Título</label>
      <input id="titulo" v-model.trim="titulo" type="text" required placeholder="Digite o título" />
    </div>

    <div class="grupo">
      <label for="conteudo">Conteúdo</label>
      <textarea id="conteudo" v-model.trim="conteudo" rows="5" required placeholder="Escreva a mensagem"></textarea>
    </div>

    <div class="acoes-form">
      <button class="enviar" type="submit">
        {{ modelo ? "Salvar Alterações" : "Adicionar Mensagem" }}
      </button>

      <button v-if="modelo" type="button" class="cancelar" @click="onCancelar">
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelo: { type: Object, default: null }
})

const emit = defineEmits(['adicionar', 'salvar', 'cancelar'])

const titulo = ref('')
const conteudo = ref('')

watch(
  () => props.modelo,
  (m) => {
    titulo.value = m?.titulo ?? ''
    conteudo.value = m?.conteudo ?? ''
  },
  { immediate: true }
)

function enviarMensagem() {
  if (!titulo.value || !conteudo.value) return

  const payload = {
    titulo: titulo.value,
    conteudo: conteudo.value
    // NÃO inclui id — id vem da rota na view
  }

  if (props.modelo) emit('salvar', payload)
  else {
    emit('adicionar', payload)
    titulo.value = ''
    conteudo.value = ''
  }
}

function onCancelar() { emit('cancelar') }
</script>

<style scoped>
.form { display:flex; flex-direction:column; gap:12px; margin:12px 0; }
.grupo { display:flex; flex-direction:column; }
label { font-weight:600; margin-bottom:6px; }
input, textarea {
  border:1px solid #d1d5db; padding:10px; border-radius:8px; font-size:14px; outline:none;
}
input:focus, textarea:focus {
  border-color:#42b983;
  box-shadow:0 0 0 4px rgba(66,185,131,0.06);
}
.enviar {
  background:#42b983; color:#fff; border:none;
  padding:10px 14px; border-radius:8px; cursor:pointer; font-weight:600;
}
.cancelar {
  background:#f3f4f6; border:1px solid #e5e7eb;
  padding:8px 12px; border-radius:8px; cursor:pointer;
}
.acoes-form { display:flex; align-items:center; gap:8px; }
</style>

