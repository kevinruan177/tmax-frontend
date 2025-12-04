# Guia de Integração Frontend-Backend TMAX

## 📋 Visão Geral

Este documento descreve como o frontend TMAX está integrado com o backend de produção em `https://tmax-backend.onrender.com`.

## 🔧 Configuração do Ambiente

### Frontend (.env)

O arquivo `.env` localizado na raiz do projeto TMAX-main deve conter:

```bash
# Production API URL
VITE_API_URL=https://tmax-backend.onrender.com

# Para desenvolvimento local, descomente:
# VITE_API_URL=http://localhost:8000
```

**Nota:** As variáveis de ambiente Vite devem começar com `VITE_` para serem acessíveis no código.

### Backend (main.py)

O backend está configurado com CORS (Cross-Origin Resource Sharing) para permitir requisições do frontend. A configuração inclui:

- **Origens permitidas em desenvolvimento:**
  - `http://localhost:5173`
  - `http://localhost:3000`
  - `http://127.0.0.1:5173`
  - `http://127.0.0.1:3000`

- **Origens permitidas em produção:**
  - `https://tmax-frontend.vercel.app`
  - `https://tmax.onrender.com`

## 🌐 Estrutura de Endpoints

### 1. Autenticação (`/auth`)

#### Registro de Driver
```
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321",
  "password": "senha123",
  "confirm_password": "senha123"
}

Response: 200 OK
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321",
  "profile_photo": null,
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:00"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 2. Driver (`/driver`)

#### Obter Perfil do Driver Logado
```
GET /driver/me
Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321",
  "profile_photo": null,
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:00"
}
```

#### Obter Driver por ID
```
GET /driver/{driver_id}

Response: 200 OK
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321",
  "profile_photo": null,
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:00"
}
```

#### Atualizar Dados do Driver
```
PUT /driver/{driver_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "phone": "(11) 99876-5432"
}

Response: 200 OK
{
  "id": 1,
  "nome": "João Silva Santos",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 99876-5432",
  "profile_photo": null,
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:01"
}
```

#### Upload de Foto de Perfil
```
POST /driver/upload/profile
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Form Data:
- driver_id: 1
- file: [arquivo de imagem]

Response: 200 OK
{
  "success": true,
  "message": "Foto de perfil atualizada com sucesso"
}
```

#### Upload de RG
```
POST /driver/upload/rg
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Form Data:
- driver_id: 1
- files: [múltiplos arquivos de imagem do RG]

Response: 200 OK
{
  "success": true,
  "message": "RG enviado com sucesso"
}
```

### 3. Motorcycle (`/driver/vehicle`)

#### Upload de Foto da Moto
```
POST /driver/vehicle
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

Form Data:
- file: [arquivo de imagem]
- driver_id: 1

Response: 200 OK
{
  "id": 1,
  "driver_id": 1,
  "model": "Honda CB 500",
  "year": 2023,
  "color": "Vermelha",
  "plate": "ABC-1234",
  "vehicle_photo": "[foto_base64]",
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:00"
}
```

#### Obter Moto do Driver
```
GET /driver/vehicle/{driver_id}

Response: 200 OK
{
  "id": 1,
  "driver_id": 1,
  "model": "Honda CB 500",
  "year": 2023,
  "color": "Vermelha",
  "plate": "ABC-1234",
  "vehicle_photo": "[foto_base64]",
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:00"
}
```

#### Atualizar Dados da Moto
```
PUT /driver/vehicle/{motorcycle_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "model": "Honda CB 500F",
  "year": 2024,
  "color": "Vermelha Escura",
  "plate": "XYZ-5678"
}

Response: 200 OK
{
  "id": 1,
  "driver_id": 1,
  "model": "Honda CB 500F",
  "year": 2024,
  "color": "Vermelha Escura",
  "plate": "XYZ-5678",
  "vehicle_photo": "[foto_base64]",
  "created_at": "2024-12-04T10:30:00",
  "updated_at": "2024-12-04T10:30:01"
}
```

## 🔐 Autenticação com JWT

Todos os endpoints protegidos exigem um token JWT (JSON Web Token) no header:

```
Authorization: Bearer {access_token}
```

### Como o Token é Gerenciado

1. **Login/Registro:** O servidor retorna um `access_token`
2. **Armazenamento:** O frontend salva o token em `localStorage` com chave `access_token`
3. **Uso:** O `api.js` automaticamente adiciona o token em todas as requisições via interceptor

```javascript
// Exemplo do interceptor em api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📡 Serviços Disponíveis no Frontend

### authService

```javascript
import { authService } from './services/api';

// Registro
await authService.register({
  name: "João Silva",
  email: "joao@example.com",
  cpf: "12345678901",
  phone: "(11) 98765-4321",
  password: "senha123",
  confirm_password: "senha123"
});

// Login
await authService.login("joao@example.com", "senha123");
```

### driverService

```javascript
import { driverService } from './services/api';

// Obter perfil do driver logado
await driverService.getMe();

// Obter dados de um driver específico
await driverService.getDriver(1);

// Atualizar dados do driver
await driverService.updateDriver(1, { nome: "Novo Nome" });

// Upload de foto de perfil
await driverService.uploadProfilePhoto(1, fileObject);

// Upload de RG
await driverService.uploadRG(1, filesArray);
```

### motorcycleService

```javascript
import { motorcycleService } from './services/api';

// Upload de foto da moto
await motorcycleService.uploadImage(fileObject, 1);

// Obter dados da moto
await motorcycleService.getMoto(1);

// Atualizar dados da moto
await motorcycleService.updateMoto(1, { model: "Novo Modelo" });
```

## ✅ Testando a Integração

### 1. Verificar Conexão com Backend
```bash
curl https://tmax-backend.onrender.com/health
# Deve retornar: {"status": "ok", "version": "2.0.0"}
```

### 2. Verificar Documentação API
Acesse `https://tmax-backend.onrender.com/docs` para ver a documentação interativa Swagger.

### 3. Testar Registro
```bash
curl -X POST https://tmax-backend.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "cpf": "12345678901",
    "phone": "(11) 98765-4321",
    "password": "senha123",
    "confirm_password": "senha123"
  }'
```

## 🐛 Solução de Problemas

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** O backend não está permitindo requisições da origem do frontend.

**Solução:**
1. Verifique se a URL do frontend está na lista de origens permitidas em `main.py`
2. Verifique se `VITE_API_URL` está correta no `.env`
3. Reinicie o servidor backend

### Erro: "401 Unauthorized"

**Causa:** Token JWT inválido ou ausente.

**Solução:**
1. Verifique se o token está sendo salvo em `localStorage`
2. Faça login novamente para obter um novo token
3. Verifique se o header `Authorization` está sendo enviado corretamente

### Erro: "Network Error" ao chamar API

**Causa:** Backend pode estar offline ou URL incorreta.

**Solução:**
1. Verifique se a URL em `VITE_API_URL` está correta
2. Teste a conexão: `curl https://tmax-backend.onrender.com/health`
3. Verifique os logs do Render: https://dashboard.render.com

## 🚀 Deployment em Produção

### Frontend
Quando o frontend for deployado (ex: Vercel, Netlify):
1. Configure a variável de ambiente `VITE_API_URL=https://tmax-backend.onrender.com`
2. Adicione a URL do frontend na lista de CORS permitidas no backend

### Backend
O backend já está em produção em `https://tmax-backend.onrender.com` e pronto para receber requisições.

## 📞 Endpoints de Saúde

```
GET /health
Response: {"status": "ok", "version": "2.0.0"}

GET /
Response: {
  "mensagem": "Bem-vindo à TMAX API v2.0",
  "versao": "2.0.0",
  "endpoints": {
    "usuarios": "/usuarios/",
    "auth": "/auth/",
    "driver": "/driver/",
    "docs": "/docs"
  }
}
```

## 📚 Documentação Adicional

- **Documentação Interativa:** https://tmax-backend.onrender.com/docs
- **Alternative Docs (ReDoc):** https://tmax-backend.onrender.com/redoc
- **OpenAPI Schema:** https://tmax-backend.onrender.com/openapi.json

---

**Última atualização:** 4 de Dezembro de 2024  
**Versão do Backend:** 2.0.0  
**Versão do Frontend:** 0.0.0
