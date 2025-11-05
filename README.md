# ADS-GETS - Plataforma de Comparação de Anúncios

Uma aplicação fullstack para comparar o retorno de anúncios em diferentes redes sociais (Facebook, Instagram e Google).

## 🚀 Tecnologias

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Express.js, Node.js
- **Banco de Dados**: MongoDB (Mongoose)
- **Autenticação**: JWT, Passport.js (Google OAuth, Facebook OAuth)
- **Ícones**: React Icons

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MongoDB rodando (local ou Atlas)
- Variáveis de ambiente configuradas

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd ads-gets
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
MONGODB_URI=mongodb://localhost:27017/ads-gets
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
PORT=3000
```

4. Popule o banco de dados com dados de exemplo
```bash
npm run seed
```

5. Inicie o servidor
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
ads-gets/
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes de UI reutilizáveis
│   │   ├── AdCard.jsx
│   │   ├── AdModal.jsx
│   │   ├── CreateAdModal.jsx
│   │   ├── ShareModal.jsx
│   │   ├── DeleteConfirmModal.jsx
│   │   └── DuplicateModal.jsx
│   ├── context/          # Contextos React (Auth, Language)
│   ├── pages/            # Páginas Next.js
│   │   ├── index.js     # Login
│   │   ├── home.js      # Dashboard
│   │   ├── log.js       # Histórico
│   │   └── support.js    # Suporte
│   └── styles/           # Estilos globais
├── routes/               # Rotas Express
│   ├── authRoutes.js
│   ├── adRoutes.js
│   └── supportRoutes.js
├── models/               # Modelos Mongoose
│   ├── User.js
│   ├── Ad.js
│   └── FAQ.js
├── data/                 # Dados de exemplo (JSON)
│   ├── sample-ads.json
│   └── sample-faqs.json
├── scripts/              # Scripts utilitários
│   └── seed-data.js
└── server.js             # Servidor Express + Next.js
```

## 🎯 Funcionalidades

### Autenticação
- Login com email e senha
- Login via OAuth (Google e Facebook)
- Registro de novos usuários
- Alteração de idioma (PT/EN)

### Dashboard (Home)
- Visualização de gastos totais
- Balanço do dia
- Gráfico comparativo por plataforma (Facebook, Instagram, Google)
- Cards de anúncios com informações detalhadas
- Criação, edição, duplicação e remoção de anúncios
- Notificações sobre performance
- Compartilhamento de anúncios em redes sociais

### Histórico (Log)
- Listagem de todos os anúncios
- Filtros por data (dia, mês, ano)
- Filtros por plataforma
- Visualização de anúncios de anos anteriores

### Suporte
- Dúvidas frequentes pré-configuradas
- Busca de dúvidas
- Suporte multilíngue (PT/EN)

## 📡 API Endpoints

### Total de Endpoints: **19**

### 🔐 Autenticação (`/api/auth`) - **8 endpoints**
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email e senha
- `GET /api/auth/google` - Iniciar autenticação OAuth Google
- `GET /api/auth/google/callback` - Callback OAuth Google
- `GET /api/auth/facebook` - Iniciar autenticação OAuth Facebook
- `GET /api/auth/facebook/callback` - Callback OAuth Facebook
- `PUT /api/auth/language` - Atualizar idioma do usuário
- `GET /api/auth/me` - Obter dados do usuário atual

### 📊 Anúncios (`/api/ads`) - **7 endpoints**
- `GET /api/ads` - Listar todos os anúncios (com filtros: platform, year, month, day)
- `GET /api/ads/:id` - Obter um anúncio específico
- `POST /api/ads` - Criar novo anúncio
- `PUT /api/ads/:id` - Atualizar anúncio
- `DELETE /api/ads/:id` - Deletar anúncio
- `POST /api/ads/:id/duplicate` - Duplicar anúncio
- `GET /api/ads/stats/dashboard` - Obter estatísticas do dashboard

### ❓ Suporte (`/api/support`) - **4 endpoints**
- `GET /api/support/frequent` - Listar FAQs frequentes
- `GET /api/support/search?q=termo` - Buscar FAQs por termo
- `GET /api/support` - Listar todas as FAQs (com filtros: language, category)
- `PUT /api/support/:id/views` - Incrementar visualizações de uma FAQ

**Nota:** Todos os endpoints de anúncios requerem autenticação via JWT token no header `Authorization: Bearer <token>`.

## 📊 Dados de Exemplo

O script `seed-data.js` cria:
- 20 anúncios de exemplo para uma empresa de IT Recruiters
- FAQs em português e inglês
- Usuário de teste: `admin@techhr.com`

## 🔐 Segurança

- Senhas hashadas com bcrypt
- JWT para autenticação
- Validação de rotas protegidas
- Sanitização de inputs

## 📱 Mobile First

A aplicação é desenvolvida com foco em mobile, com navbar fixa na parte inferior e design responsivo.

## 🌐 Internacionalização

Suporte completo para Português (PT) e Inglês (EN), com todas as traduções configuradas.

## 📝 Notas

- Os anúncios são armazenados no MongoDB (não via APIs reais das plataformas)
- Isso permite testar a aplicação sem necessidade de contas reais de anúncios
- Os dados podem ser populados via script `npm run seed`

## 🐛 Troubleshooting

Se encontrar problemas:

1. Verifique se o MongoDB está rodando
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Execute `npm run seed` para popular o banco
4. Limpe o cache: `rm -rf .next node_modules && npm install`

## 📄 Licença

Este projeto é privado e destinado apenas para fins educacionais.
