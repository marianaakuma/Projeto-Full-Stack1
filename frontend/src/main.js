// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'     // ← importar Pinia

const app = createApp(App)

const pinia = createPinia()            // ← criar instância
app.use(pinia)                         // ← registrar no Vue

app.mount('#app')

