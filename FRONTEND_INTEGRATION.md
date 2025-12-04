# TMAX Frontend - Guia de Integração com Backend

## 🎯 Status de Integração

✅ **Integração Completa** - Frontend totalmente integrado com o backend em produção

## 📋 Resumo de Mudanças

### 1. **Configuração de Ambiente (.env)**
```bash
VITE_API_URL=https://tmax-backend.onrender.com
```

### 2. **Serviços de API (services/api.js)**
- ✅ Configuração de axios com interceptors de autenticação
- ✅ Interceptor de erro para redirecionar ao login (401)
- ✅ `authService` - Registro, Login, Logout
- ✅ `driverService` - Atualizar perfil, upload de foto, upload de RG
- ✅ `motorcycleService` - Criar, atualizar, obter dados de moto

### 3. **Autenticação**
- ✅ JWT (JSON Web Token) com localStorage
- ✅ Token é enviado automaticamente em todas as requisições
- ✅ Token expirado redireciona para login
- ✅ `AuthContext` para gerenciar estado de autenticação global

### 4. **Páginas Integradas**

#### **Register.jsx**
- ✅ Registra novo driver no backend
- ✅ Validações de senha e email duplicado
- ✅ Auto-login após registro
- ✅ Mensagens de erro do servidor

#### **Login.jsx**
- ✅ Login com email e senha
- ✅ Token JWT armazenado em localStorage
- ✅ Suporte para Enter para submeter
- ✅ Redirecionamento após login

#### **DriverRegistration.jsx**
- ✅ Atualiza dados do driver logado
- ✅ Upload de foto de perfil
- ✅ Upload de RG (múltiplos arquivos)
- ✅ Sincronização com backend

#### **MotorcycleRegistration.jsx**
- ✅ Registra moto no backend
- ✅ Upload de foto da moto
- ✅ Validação de campos obrigatórios
- ✅ Auto-upload sem localStorage

#### **Profile.jsx**
- ✅ Carrega dados do driver do backend
- ✅ Exibe foto de perfil
- ✅ Upload de nova foto de perfil
- ✅ Logout seguro

### 5. **Componentes Novos**

#### **ProtectedRoute.jsx**
Protege rotas que requerem autenticação:
```jsx
<Route 
  path="/routestodo" 
  element={
    <ProtectedRoute>
      <RoutesToDo />
    </ProtectedRoute>
  } 
/>
```

#### **AuthContext.jsx**
Gerenciamento global de autenticação com hooks:
```jsx
const { user, token, login, logout, isAuthenticated } = useAuth();
```

## 🚀 Como Usar

### Desenvolvimento Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Criar arquivo .env:**
```bash
VITE_API_URL=http://localhost:8000
```

Para desenvolvimento, você pode usar `http://localhost:8000` ou `https://tmax-backend.onrender.com`

3. **Rodar o servidor:**
```bash
npm run dev
```

4. **Acessar em:**
```
http://localhost:5173
```

### Fluxo de Uso

1. **Home** (`/`) - Página inicial
2. **Registro** (`/register`) - Criar nova conta
3. **Login** (`/login`) - Fazer login
4. **Cadastro do Driver** (`/driver-registration`) - Completar perfil
5. **Cadastro da Moto** (`/motorcycle-registration`) - Registrar moto
6. **Rotas** (`/routestodo`) - Página protegida
7. **Perfil** (`/profile`) - Ver e editar perfil

## 🔐 Autenticação

### Token JWT
- Obtido ao fazer login ou registrar
- Armazenado em `localStorage` como `access_token`
- Enviado automaticamente em todas as requisições no header `Authorization`
- Tempo de expiração: 30 minutos

### Exemplo de Request com Token
```javascript
// Automático via interceptor
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Testes de Integração

### Teste 1: Registro
```
1. Ir para /register
2. Preencher todos os campos
3. Clicar em "Criar Conta"
4. Deve ser redirecionado para /driver-registration
5. Token deve estar em localStorage
```

### Teste 2: Login
```
1. Ir para /login
2. Usar credenciais criadas
3. Clicar em "Continuar"
4. Deve ser redirecionado para /routestodo
5. Token deve estar em localStorage
```

### Teste 3: Upload de Foto
```
1. Ir para /driver-registration
2. Selecionar uma foto
3. Preencher dados
4. Clicar em "Salvar informações"
5. Foto deve ser enviada ao backend
```

### Teste 4: Logout
```
1. Ir para /profile
2. Clicar em "Sair da Conta"
3. Token e dados devem ser removidos
4. Deve ser redirecionado para /login
```

## 🐛 Troubleshooting

### Erro: "CORS policy"
```
Solução: Verificar se VITE_API_URL está correto em .env
Remover o arquivo .env e recriar
Limpar cache do navegador
```

### Erro: "401 Unauthorized"
```
Solução: Token pode estar expirado
Fazer login novamente
Verificar se localStorage tem access_token
```

### Erro: "Network Error"
```
Solução: Verificar se backend está rodando
Verificar console (F12) para mais detalhes
Testar: curl https://tmax-backend.onrender.com/health
```

### Erro: "Upload não funciona"
```
Solução: Arquivo muito grande? Máximo ~5MB
Arquivo em formato correto? (JPEG, PNG, etc)
Permissões do backend corretas?
```

## 🔧 Variáveis de Ambiente

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `VITE_API_URL` | `https://tmax-backend.onrender.com` | URL da API em produção |
| | `http://localhost:8000` | URL da API em desenvolvimento |

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────┐
│ Frontend React                      │
│ (TMAX App)                          │
└────────────┬────────────────────────┘
             │
             │ HTTP Requests
             │ (com JWT Token)
             ▼
┌─────────────────────────────────────┐
│ Backend FastAPI                     │
│ (TMAX API v2.0)                     │ 
│ https://tmax-backend.onrender.com   │
└────────────┬────────────────────────┘
             │
             │ Respostas JSON
             ▼
┌─────────────────────────────────────┐
│ Banco de Dados                      │
│ (PostgreSQL)                        │
└─────────────────────────────────────┘
```

## 📦 Dependências

```json
{
  "axios": "^1.12.2",           // HTTP Client
  "react": "^19.1.1",           // Framework
  "react-dom": "^19.1.1",       // DOM Rendering
  "react-router-dom": "^7.9.4", // Routing
  "tailwindcss": "^4.1.15"      // Styling
}
```

## ✅ Checklist de Integração

- [x] Configuração de ambiente (.env)
- [x] Serviços de API (api.js)
- [x] Autenticação JWT
- [x] Interceptors de erro
- [x] Register integrado
- [x] Login integrado
- [x] DriverRegistration integrado
- [x] MotorcycleRegistration integrado
- [x] Profile integrado
- [x] Upload de arquivos
- [x] Logout seguro
- [x] Mensagens de erro
- [x] Loading states
- [x] Redirecionamento de rotas

## 🚀 Deployment

Para fazer deploy em produção (Vercel, Netlify, etc):

1. Definir variável de ambiente:
```
VITE_API_URL=https://tmax-backend.onrender.com
```

2. Build para produção:
```bash
npm run build
```

3. Deploy da pasta `dist`:
```bash
vercel deploy --prod
# ou
netlify deploy
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte `INTEGRATION_GUIDE.md` para documentação detalhada
2. Verifique console (F12) para erros
3. Acesse `https://tmax-backend.onrender.com/docs` para API docs

---

**Última atualização:** 4 de Dezembro de 2024  
**Status:** ✅ Integração Completa
