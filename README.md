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
│   │   └── CreateAdModal.jsx
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

### Histórico (Log)
- Listagem de todos os anúncios
- Filtros por data (dia, mês, ano)
- Filtros por plataforma
- Visualização de anúncios de anos anteriores

### Suporte
- Dúvidas frequentes pré-configuradas
- Busca de dúvidas
- Suporte multilíngue (PT/EN)

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
