# 🚀 Project Name

Uma breve descrição do seu projeto. (Ex: Sistema de gerenciamento de usuários com controle de ponto e rotas protegidas).

Este projeto foi desenvolvido utilizando **React**, **TypeScript** e **Vite** para garantir uma interface rápida, tipada e escalável.

---

## 📂 Estrutura do Projeto

Abaixo, uma explicação detalhada da organização das pastas e arquivos dentro do diretório `src/`:

### 🏗️ [Components](./src/components)
Contém os blocos reutilizáveis da interface.
- **figma/**: Componentes exportados ou baseados estritamente no design do Figma.
- **ui/**: Componentes de interface genéricos (botões, inputs, cards).
- `AdminRoute.tsx` & `ProtectedRoute.tsx`: Componentes de alta ordem (HOC) para proteção de rotas com base no nível de acesso.
- `ClockOutModal.tsx`: Interface para registro de saída/ponto.
- `CreateUserModal.tsx` & `EditUserModal.tsx`: Modais para gerenciamento (CRUD) de usuários.

### 🔐 [Context](./src/context)
- `AuthContext.tsx`: Gerenciamento de estado global de autenticação (armazenamento de token, dados do usuário logado e persistência da sessão).

### 📄 [Pages](./src/pages)
Representam as telas completas da aplicação.
- `AdminDashboardPage.tsx`: Visão exclusiva para administradores.
- `DashboardPage.tsx`: Visão geral do usuário comum.
- `LoginPage.tsx`: Tela de autenticação.

### ⚙️ [Services](./src/services)
- `api.js`: Configuração do cliente HTTP (ex: Axios ou Fetch) para comunicação com o backend/API.

### 🎨 [Styles](./src/styles)
- `globals.css`: Definições de cores, fontes e estilos globais aplicados em toda a aplicação.

---

## 🛠️ Tecnologias Utilizadas

- **React**: Biblioteca principal para construção da UI.
- **TypeScript**: Adição de tipagem estática para maior segurança no código.
- **Vite**: Ferramenta de build e ambiente de desenvolvimento ultra-rápido.
- **CSS**: Estilização da interface.

---

## 🚀 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
Entre na pasta:
code
Bash
cd seu-repositorio
Instale as dependências:
code
Bash
npm install
# ou
yarn install
Inicie o servidor de desenvolvimento:
code
Bash
npm run dev
Acesse no navegador:
http://localhost:5173
📜 Scripts Disponíveis
npm run dev: Inicia o servidor local.
npm run build: Cria a versão de produção na pasta dist.
npm run preview: Visualiza a build de produção localmente.
