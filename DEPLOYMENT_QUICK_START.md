# 🚀 Guia Rápido de Deployment - Frontend + Backend

## Status Atual

### ✅ Backend
- **URL de Produção:** https://tmax-backend.onrender.com
- **Status:** Em produção (Render)
- **Versão:** 2.0.0
- **Documentação:** https://tmax-backend.onrender.com/docs

### ⏳ Frontend
- **Status:** Desenvolvimento local
- **Próximo passo:** Fazer deploy em Vercel, Netlify ou Render

---

## 🔧 Setup Local Completo

### 1. Backend (Local)

```bash
# Navegar até a pasta do backend
cd tmax-backend

# Instalar dependências (se usar Python venv)
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Instalar pacotes
pip install -r requirements.txt

# Rodar o servidor
uvicorn main:app --reload

# Será disponível em: http://localhost:8000
```

### 2. Frontend (Local)

```bash
# Navegar até a pasta do frontend
cd TMAX-main

# Instalar dependências
npm install

# Criar arquivo .env com:
# VITE_API_URL=http://localhost:8000

# Rodar em desenvolvimento
npm run dev

# Será disponível em: http://localhost:5173
```

---

## 📦 Deploy do Frontend em Produção

### Opção 1: Vercel (Recomendado para React/Vite)

1. **Criar conta em https://vercel.com**

2. **Conectar repositório GitHub:**
   - Fazer push do código para GitHub
   - Importar projeto em Vercel
   - Selecionar branch `main`

3. **Configurar variáveis de ambiente:**
   ```
   VITE_API_URL=https://tmax-backend.onrender.com
   ```

4. **Fazer deploy:**
   - Vercel faz deploy automático quando você faz push
   - Build command: `npm run build`
   - Output directory: `dist`

### Opção 2: Netlify

1. **Fazer push para GitHub**

2. **Conectar em https://netlify.com**

3. **Configurar:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable: `VITE_API_URL=https://tmax-backend.onrender.com`

4. **Deploy automático** ao fazer push para main

### Opção 3: Render (Mesmo servidor do backend)

1. **Criar novo Web Service em Render**

2. **Conectar repositório GitHub**

3. **Configurar:**
   - Build command: `npm run build`
   - Start command: `npm run preview` (ou usar Node.js com servidor estático)
   - Environment variable: `VITE_API_URL=https://tmax-backend.onrender.com`

---

## 🔗 Atualizar CORS no Backend (quando frontend for deployado)

Quando o frontend estiver em produção, atualizar `main.py`:

```python
allowed_origins = [
    "http://localhost:5173",  # Desenvolvimento
    "http://localhost:3000",
    "https://tmax-frontend.vercel.app",  # ADICIONAR URL DO FRONTEND EM PRODUÇÃO
    "https://tmax.onrender.com",  # Se usar Render
]
```

Depois fazer deploy do backend novamente.

---

## ✅ Checklist de Integração

### Desenvolvimento Local
- [ ] Backend rodando em `http://localhost:8000`
- [ ] Frontend rodando em `http://localhost:5173`
- [ ] `.env` do frontend com `VITE_API_URL=http://localhost:8000`
- [ ] CORS configurado para localhost em `main.py`
- [ ] Testes locais passando (ver `TESTING_CHECKLIST.md`)

### Produção
- [ ] Backend em `https://tmax-backend.onrender.com`
- [ ] Frontend deployado (Vercel/Netlify/Render)
- [ ] Variável de ambiente `VITE_API_URL=https://tmax-backend.onrender.com` configurada
- [ ] URL do frontend adicionada na lista CORS do backend
- [ ] Health check passando: `curl https://tmax-backend.onrender.com/health`
- [ ] Documentação API acessível: `https://tmax-backend.onrender.com/docs`

---

## 🐛 Troubleshooting

### Frontend não conecta ao backend
```bash
# 1. Verificar variável de ambiente
cat .env

# 2. Verificar console do navegador (F12 > Console)
# Deve exibir: API Base URL: https://tmax-backend.onrender.com

# 3. Testar conexão direta
curl https://tmax-backend.onrender.com/health
```

### CORS Error
- Verificar se URL do frontend está em `allowed_origins` no backend
- Fazer redeploy do backend após adicionar novo domínio

### Token não funciona
- Verificar se está sendo salvo em localStorage: `localStorage.getItem('access_token')`
- Fazer novo login para obter token válido

---

## 📚 Links Importantes

| Recurso | Link |
|---------|------|
| API Docs | https://tmax-backend.onrender.com/docs |
| API ReDoc | https://tmax-backend.onrender.com/redoc |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub | https://github.com/kevinruan177/tmax-backend |

---

## 📞 Contato e Suporte

Para dúvidas sobre integração, consulte:
- `INTEGRATION_GUIDE.md` - Documentação detalhada
- `TESTING_CHECKLIST.md` - Testes de integração
- Logs do Render para erros do backend
- Console do navegador (F12) para erros do frontend

---

**Última atualização:** 4 de Dezembro de 2024
