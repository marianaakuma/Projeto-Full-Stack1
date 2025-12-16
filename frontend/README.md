# 🚀 Sistema de Mensagens - Vue.js Frontend

Sistema completo de CRUD desenvolvido em Vue.js com integração a API REST Flask.

## 📋 Funcionalidades

### ✅ CRUD de Recursos Principais (Posts/Mensagens)
- **Criar**: Adicionar novas mensagens com título e conteúdo
- **Ler**: Listar todas as mensagens com filtros avançados
- **Atualizar**: Editar mensagens existentes
- **Deletar**: Remover mensagens (com confirmação)

### ✅ CRUD de Sub-recursos (Comentários)
- **Criar**: Adicionar comentários aos posts
- **Ler**: Visualizar comentários por post
- **Atualizar**: Editar comentários existentes
- **Deletar**: Remover comentários

### ✅ Filtros Avançados (5 filtros implementados)
1. **Pesquisa por texto**: Buscar em títulos e conteúdos
2. **Filtro por autor**: Buscar por nome do autor
3. **Filtro por data inicial**: Filtrar mensagens a partir de uma data
4. **Filtro por data final**: Filtrar mensagens até uma data
5. **Ordenação**: Ordenar por mais recente, mais antigo, título (A-Z, Z-A) ou autor (A-Z)

### ✅ Sistema de Notificações UX (5 mensagens implementadas)
1. **Sucesso ao carregar**: Notificação quando mensagens são carregadas com sucesso
2. **Sucesso ao criar**: Notificação ao criar nova mensagem
3. **Sucesso ao atualizar**: Notificação ao editar mensagem
4. **Sucesso ao remover**: Notificação ao deletar mensagem
5. **Erro**: Notificações de erro em todas as operações

### ✅ Autenticação JWT
- Login com email e senha
- Token armazenado e enviado automaticamente pelo Axios
- Rotas protegidas com guards
- Refresh token para manter sessão ativa

### ✅ Interface Responsiva
- Design moderno e intuitivo
- Componentes reutilizáveis
- Formulários com validação
- Modal para criar/editar recursos

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo
- **Vite**: Build tool rápido e moderno
- **Vue Router**: Roteamento SPA
- **Pinia**: Gerenciamento de estado
- **Axios**: Cliente HTTP para requisições
- **Flask (Backend)**: API REST com autenticação JWT
- **CSS3**: Estilização moderna com animações

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Python 3.8+ (para o backend)

### 1. Clonar o Projeto
```bash
git clone <url-do-repositorio>
cd Projeto-Full-Stack1
```

### 2. Instalar Dependências do Frontend
```bash
cd frontend
npm install
```

### 3. Configurar Variáveis de Ambiente
O arquivo `.env` já está configurado com:
```
VITE_API_URL=http://localhost:5000/
```

**Nota**: Certifique-se de que a URL do backend está correta. O backend Flask roda na porta 5000 por padrão.

## 🚀 Execução

### Backend (Flask)
Em um terminal separado, navegue até a pasta backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
O servidor Flask iniciará em `http://localhost:5000`

### Frontend (Vue.js)
Em outro terminal, na pasta frontend:
```bash
cd frontend
npm run dev
```
O aplicativo Vue.js iniciará em `http://localhost:5173`

## 📡 Endpoints da API

### Autenticação (`/auth`)
- `POST /auth/login` - Fazer login
- `POST /auth/refresh` - Renovar token de acesso
- `POST /auth/logout` - Fazer logout
- `GET /auth/me` - Obter dados do usuário autenticado

### Posts/Mensagens (`/posts`)
- `GET /posts` - Listar todos os posts (público)
- `GET /posts/:id` - Obter post específico (requer autenticação)
- `POST /posts` - Criar novo post (requer autenticação)
- `PUT /posts/:id` - Atualizar post (requer autenticação, apenas dono)
- `DELETE /posts/:id` - Remover post (requer autenticação, apenas dono)

### Comentários (`/comments`)
- `GET /comments/:post_id` - Listar comentários de um post (requer autenticação)
- `POST /comments/:post_id` - Criar novo comentário (requer autenticação)
- `PUT /comments/:post_id/:comment_id` - Atualizar comentário (requer autenticação, apenas dono)
- `DELETE /comments/:post_id/:comment_id` - Remover comentário (requer autenticação, apenas dono)

## 🎯 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── MensagemCard.vue      # Card de mensagem
│   │   ├── MensagemForm.vue      # Formulário de mensagem
│   │   ├── ComentarioCard.vue    # Card de comentário
│   │   ├── ComentarioForm.vue    # Formulário de comentário
│   │   ├── SubResourceList.vue   # Lista de comentários
│   │   ├── SubResourceForm.vue   # Formulário de comentários
│   │   └── Notification.vue      # Sistema de notificações
│   ├── views/               # Views/Páginas
│   │   ├── LoginView.vue         # Página de login
│   │   ├── MensagensView.vue     # Lista de mensagens
│   │   ├── NovaMensagemView.vue   # Criar mensagem
│   │   ├── EditarMensagemView.vue # Editar mensagem
│   │   ├── AdminDashboard.vue    # Painel administrativo
│   │   └── NotFoundView.vue       # Página 404
│   ├── layouts/             # Layouts
│   │   └── MainLayout.vue        # Layout principal autenticado
│   ├── services/            # Serviços de API
│   │   ├── api.js               # Configuração do Axios com interceptors
│   │   ├── messages.service.js   # CRUD de mensagens
│   │   └── subResourceService.js # CRUD de comentários
│   ├── stores/              # Stores Pinia
│   │   └── auth.js              # Store de autenticação
│   ├── router/              # Roteamento
│   │   └── index.js             # Configuração do Vue Router com guards
│   ├── utils/               # Utilitários
│   │   └── permissions.js       # Funções de permissão
│   ├── App.vue              # Componente principal
│   └── main.js              # Entrada da aplicação
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências do projeto
└── README.md                # Este arquivo
```

## 💡 Exemplos de Uso

### Fazer Login
1. Acesse a página de login
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para a lista de mensagens

### Criar uma Mensagem
1. Clique em "Nova Mensagem"
2. Preencha o formulário com título e conteúdo
3. Clique em "Criar"
4. Uma notificação de sucesso aparecerá

### Filtrar Mensagens
1. Use o campo de pesquisa para buscar por texto (título ou conteúdo)
2. Digite o nome do autor no campo "Autor"
3. Selecione uma data inicial e/ou final
4. Escolha a ordenação desejada
5. Clique em "Limpar Filtros" para resetar

### Adicionar Comentário
1. Visualize uma mensagem
2. Clique em "Adicionar Comentário"
3. Digite seu comentário
4. Clique em "Criar"
5. Uma notificação de sucesso aparecerá

### Notificações
As notificações aparecem automaticamente no canto superior direito para:
- ✅ Sucesso ao criar/editar/excluir mensagens ou comentários
- ❌ Erros nas operações
- ℹ️ Informações importantes
- ⚠️ Avisos

## 🔧 Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Visualizar build de produção

## 🔐 Autenticação

O sistema utiliza autenticação JWT com:
- **Access Token**: Armazenado em memória (state do Pinia)
- **Refresh Token**: Armazenado em sessionStorage
- **Interceptors Axios**: Adicionam automaticamente o token em todas as requisições
- **Refresh Automático**: Renovação automática do token quando expira
- **Guards de Rota**: Proteção de rotas que requerem autenticação

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Nota**: Este projeto foi desenvolvido como parte de um exercício prático de Vue.js com integração a API REST Flask e autenticação JWT.
