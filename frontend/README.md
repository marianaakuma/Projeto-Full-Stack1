# 🚀 Gerenciador de Recursos - Vue.js Frontend

Sistema completo de CRUD desenvolvido em Vue.js com integração a API REST simulada via json-server.

## 📋 Funcionalidades

### ✅ CRUD de Recursos Principais
- **Criar**: Adicionar novos recursos com título, conteúdo, autor e status
- **Ler**: Listar todos os recursos com filtros avançados
- **Atualizar**: Editar recursos existentes
- **Deletar**: Remover recursos (com confirmação)

### ✅ CRUD de Sub-recursos (Comentários)
- **Criar**: Adicionar comentários aos recursos
- **Ler**: Visualizar comentários por recurso
- **Atualizar**: Editar comentários existentes
- **Deletar**: Remover comentários

### ✅ Filtros Avançados
- **Pesquisa por texto**: Buscar em títulos e conteúdos
- **Filtro por status**: Ativo, Pendente, Resolvido
- **Filtro por autor**: Buscar por nome do autor
- **Filtro por data**: Intervalo de datas (início e fim)
- **Limpar filtros**: Botão para resetar todos os filtros

### ✅ Sistema de Notificações
- **Sucesso**: ✅ Operações realizadas com sucesso
- **Erro**: ❌ Falhas nas operações
- **Avisos**: ⚠️ Alertas importantes
- **Informações**: ℹ️ Mensagens informativas

### ✅ Interface Responsiva
- Design moderno e intuitivo
- Componentes reutilizáveis
- Formulários com validação
- Modal para criar/editar recursos

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3**: Framework JavaScript progressivo
- **Vite**: Build tool rápido e moderno
- **Axios**: Cliente HTTP para requisições
- **json-server**: API REST simulada
- **CSS3**: Estilização moderna com animações

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Clonar o Projeto
```bash
git clone <url-do-repositorio>
cd hello-vue
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
O arquivo `.env` já está configurado com:
```
VITE_API_URL=http://localhost:3000
```

## 🚀 Execução

### Backend (json-server)
Em um terminal separado, navegue até a pasta backend:
```bash
cd backend
npm install
npm run dev
```
O servidor json-server iniciará em `http://localhost:3000`

### Frontend (Vue.js)
Em outro terminal, na pasta hello-vue:
```bash
npm run dev
```
O aplicativo Vue.js iniciará em `http://localhost:5173`

## 📡 Endpoints da API

### Recursos Principais (`/resources`)
- `GET /resources` - Listar todos os recursos
- `GET /resources/:id` - Obter recurso específico
- `POST /resources` - Criar novo recurso
- `PUT /resources/:id` - Atualizar recurso
- `DELETE /resources/:id` - Remover recurso

### Sub-recursos (`/subresources`)
- `GET /subresources?resourceId=:id` - Listar comentários de um recurso
- `GET /subresources/:id` - Obter comentário específico
- `POST /subresources` - Criar novo comentário
- `PUT /subresources/:id` - Atualizar comentário
- `DELETE /subresources/:id` - Remover comentário

## 🎯 Estrutura do Projeto

```
hello-vue/
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── ResourceList.vue     # Lista de recursos com filtros
│   │   ├── ResourceForm.vue     # Formulário de recursos
│   │   ├── SubResourceList.vue  # Lista de comentários
│   │   ├── SubResourceForm.vue  # Formulário de comentários
│   │   └── Notification.vue     # Sistema de notificações
│   ├── services/           # Serviços de API
│   │   ├── api.js              # Configuração do Axios
│   │   ├── resourceService.js  # CRUD de recursos
│   │   └── subResourceService.js # CRUD de sub-recursos
│   ├── App.vue            # Componente principal
│   └── main.js            # Entrada da aplicação
├── backend/
│   └── db.json            # Banco de dados simulado
├── .env                   # Variáveis de ambiente
└── package.json           # Dependências do projeto
```

## 💡 Exemplos de Uso

### Criar um Recurso
1. Clique em "Novo Recurso"
2. Preencha o formulário com título, conteúdo, autor e status
3. Clique em "Criar"

### Filtrar Recursos
1. Use o campo de pesquisa para buscar por texto
2. Selecione um status específico no dropdown
3. Digite o nome do autor no campo correspondente
4. Defina um intervalo de datas

### Adicionar Comentário
1. Clique em um recurso para expandir
2. Clique em "Adicionar Comentário"
3. Digite seu comentário e nome
4. Clique em "Criar"

### Notificações
As notificações aparecem automaticamente no canto superior direito para:
- Sucesso ao criar/editar/excluir recursos ou comentários
- Erros nas operações
- Avisos de validação

## 🔧 Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Visualizar build de produção

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Nota**: Este projeto foi desenvolvido como parte de um exercício prático de Vue.js com integração a API REST.
