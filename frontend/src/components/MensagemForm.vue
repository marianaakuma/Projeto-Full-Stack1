<!-- src/components/MensagemForm.vue -->
<!-- src/components/MensagemForm.vue -->
<template>
  <form class="form" @submit.prevent="enviarMensagem">
    <div class="grupo">
      <label for="titulo">Título</label>
      <input id="titulo"
        v-model.trim="titulo"
        type="text"
        placeholder="Digite o título da mensagem"
        required
      />
    </div>

    <div class="grupo">
      <label for="conteudo">Conteúdo</label>
      <textarea id="conteudo"
        v-model.trim="conteudo"
        rows="3"
        placeholder="Escreva o conteúdo da mensagem"
        required
      ></textarea>
    </div>

    <div class="grupo">
      <label for="autor">Autor</label>
      <input id="autor"
        v-model.trim="autor"
        type="text"
        placeholder="Seu nome (opcional)"
      />
    </div>

    <div class="acoes-form">
      <button class="enviar" type="submit">{{ modelo ? 'Salvar' : 'Adicionar' }}</button>
      <button v-if="modelo" class="cancelar" type="button" @click="$emit('cancelar')">Cancelar</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// Props
const props = defineProps({
  modelo: {
    type: Object,
    default: null
  }
})

// evento emitido para o componente pai
const emit = defineEmits(['adicionar', 'salvar', 'cancelar'])

// campos reativos do formulário
const titulo = ref('')
const conteudo = ref('')
const autor = ref('')

// Preencher formulário se houver modelo (modo edição)
watch(() => props.modelo, (novoModelo) => {
  if (novoModelo) {
    titulo.value = novoModelo.title || novoModelo.titulo || ''
    conteudo.value = novoModelo.content || novoModelo.conteudo || ''
    autor.value = novoModelo.author || novoModelo.autor || ''
  }
}, { immediate: true })

onMounted(() => {
  if (props.modelo) {
    titulo.value = props.modelo.title || props.modelo.titulo || ''
    conteudo.value = props.modelo.content || props.modelo.conteudo || ''
    autor.value = props.modelo.author || props.modelo.autor || ''
  }
})

// função de envio do formulário
function enviarMensagem() {
  if (!titulo.value || !conteudo.value) return

  const dados = {
    titulo: titulo.value,
    conteudo: conteudo.value,
    autor: autor.value || 'Anônimo',
    data_criacao: new Date().toISOString()
  }

  // Se há modelo, está editando, senão está criando
  if (props.modelo) {
    emit('salvar', dados)
  } else {
    emit('adicionar', dados)
  }

  // limpa os campos após o envio (apenas se não for edição)
  if (!props.modelo) {
    titulo.value = ''
    conteudo.value = ''
    autor.value = ''
  }
}
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

