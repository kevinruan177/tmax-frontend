# ✅ Checklist de Testes de Integração Frontend-Backend

## 📋 Pré-requisitos
- [ ] Frontend `.env` configurado com `VITE_API_URL=https://tmax-backend.onrender.com`
- [ ] Backend está rodando em `https://tmax-backend.onrender.com`
- [ ] Frontend está rodando em `http://localhost:5173` (desenvolvimento) ou deployado

## 🔗 Testes de Conexão Básica

### 1. Teste de Health Check
- [ ] Acessar `https://tmax-backend.onrender.com/health`
- [ ] Esperar resposta: `{"status": "ok", "version": "2.0.0"}`

### 2. Teste de Root Endpoint
- [ ] Acessar `https://tmax-backend.onrender.com/`
- [ ] Verificar se retorna informações da API

### 3. Teste de CORS
- [ ] Abrir console do navegador (F12)
- [ ] Ir para a página de login do frontend
- [ ] Verificar que não há erros de CORS (Access-Control-Allow-Origin)

## 🔐 Testes de Autenticação

### 4. Teste de Registro de Driver
- [ ] Preencher formulário de registro com dados válidos
- [ ] Submeter formulário
- [ ] Verificar se recebe resposta de sucesso
- [ ] Validar:
  - [ ] Email não duplicado (testa segunda tentativa com mesmo email)
  - [ ] CPF não duplicado (testa segunda tentativa com mesmo CPF)
  - [ ] Senhas devem coincidir (testa com senhas diferentes)

**Dados de teste recomendados:**
```
Nome: Teste Integração
Email: teste.integracao@example.com
CPF: 12345678901
Telefone: (11) 98765-4321
Senha: Senha@123
```

### 5. Teste de Login
- [ ] Usar credenciais do driver registrado
- [ ] Submeter formulário de login
- [ ] Verificar se retorna `access_token`
- [ ] Verificar se token é salvo em `localStorage` com chave `access_token`
- [ ] Testar login com credenciais inválidas (deve retornar erro 401)

## 👤 Testes de Perfil do Driver

### 6. Teste de Obter Perfil
- [ ] Após login bem-sucedido
- [ ] Acessar página de perfil
- [ ] Verificar se dados do driver são carregados corretamente
- [ ] Validar que são os mesmos dados registrados

### 7. Teste de Atualizar Perfil
- [ ] Na página de perfil, modificar dados (ex: telefone, nome)
- [ ] Salvar alterações
- [ ] Verificar se dados são atualizados no banco
- [ ] Fazer refresh da página e verificar se alterações persistem

### 8. Teste de Upload de Foto de Perfil
- [ ] Na página de perfil, selecionar uma imagem
- [ ] Fazer upload
- [ ] Verificar se foto é enviada com sucesso
- [ ] Verificar se foto é exibida no perfil
- [ ] Validar tamanho máximo de arquivo

### 9. Teste de Upload de RG
- [ ] Na página de registro de documentos
- [ ] Fazer upload de 2 arquivos (frente e verso do RG)
- [ ] Verificar se arquivos são enviados com sucesso
- [ ] Verificar se arquivos aparecem na lista de documentos

## 🏍️ Testes de Motorcycle

### 10. Teste de Upload de Foto da Moto
- [ ] Na página de registro de moto
- [ ] Selecionar foto da moto
- [ ] Preencher dados: modelo, ano, cor, placa
- [ ] Submeter formulário
- [ ] Verificar se moto é criada com sucesso
- [ ] Verificar se foto é exibida

### 11. Teste de Obter Dados da Moto
- [ ] Acessar página de perfil da moto
- [ ] Verificar se todos os dados estão corretos
- [ ] Validar que foto está sendo exibida

### 12. Teste de Atualizar Dados da Moto
- [ ] Modificar dados da moto (modelo, cor, etc.)
- [ ] Salvar alterações
- [ ] Fazer refresh e verificar se alterações persistem

## 🚀 Testes de Fluxo Completo

### 13. Fluxo de Registro Completo
- [ ] Registrar novo driver
- [ ] Fazer login
- [ ] Atualizar perfil
- [ ] Fazer upload de foto
- [ ] Fazer upload de RG
- [ ] Registrar moto
- [ ] Upload de foto da moto

### 14. Testes de Navegação
- [ ] Verificar que após logout o token é removido de `localStorage`
- [ ] Verificar que redirecionamento funciona corretamente
- [ ] Verificar que páginas protegidas são bloqueadas sem autenticação

## 🐛 Testes de Tratamento de Erros

### 15. Teste de Erro de Conexão
- [ ] Desligar internet ou backend
- [ ] Tentar fazer requisição
- [ ] Verificar se mensagem de erro apropriada é exibida

### 16. Teste de Token Expirado
- [ ] Fazer login
- [ ] Aguardar 30 minutos ou manipular token no localStorage
- [ ] Tentar acessar recurso protegido
- [ ] Verificar se é redirecionado para login

### 17. Teste de Validação de Formulário
- [ ] Tentar submeter formulários sem preencher campos obrigatórios
- [ ] Tentar submeter com dados inválidos (email, CPF, etc.)
- [ ] Verificar se mensagens de validação apropriadas aparecem

## 📊 Testes de Performance

### 18. Teste de Tempo de Resposta
- [ ] Abrir DevTools > Network
- [ ] Realizar login
- [ ] Verificar se tempo de resposta é < 2 segundos
- [ ] Carregar perfil e verificar se carrega em < 1 segundo

### 19. Teste de Tamanho de Request/Response
- [ ] Verificar que arquivos enviados não excedem limite
- [ ] Verificar que respostas não são excessivamente grandes

## 🔒 Testes de Segurança

### 20. Teste de Headers de Segurança
- [ ] Verificar em DevTools > Network que headers apropriados estão presentes
- [ ] Validar que token não está sendo enviado em URL (apenas em header)

### 21. Teste de CORS Restritivo
- [ ] Tentar fazer requisição de origem não permitida
- [ ] Verificar que é bloqueada

## 📝 Documentação e Logs

### 22. Verificar Logs
- [ ] Abrir console do navegador (F12 > Console)
- [ ] Verificar que debug log mostra URL correta: `API Base URL: https://tmax-backend.onrender.com`
- [ ] Não deve haver erros na console

### 23. Acessar Documentação
- [ ] Acessar `https://tmax-backend.onrender.com/docs`
- [ ] Verificar que documentação Swagger está disponível
- [ ] Testar alguns endpoints direto da documentação

---

## 📋 Relatório de Testes

| # | Teste | Status | Observações |
|---|-------|--------|-------------|
| 1 | Health Check | ⏳ Não testado | - |
| 2 | Root Endpoint | ⏳ Não testado | - |
| 3 | CORS | ⏳ Não testado | - |
| 4 | Registro | ⏳ Não testado | - |
| 5 | Login | ⏳ Não testado | - |
| 6 | Obter Perfil | ⏳ Não testado | - |
| 7 | Atualizar Perfil | ⏳ Não testado | - |
| 8 | Upload Foto | ⏳ Não testado | - |
| 9 | Upload RG | ⏳ Não testado | - |
| 10 | Upload Moto | ⏳ Não testado | - |
| 11 | Obter Moto | ⏳ Não testado | - |
| 12 | Atualizar Moto | ⏳ Não testado | - |
| 13 | Fluxo Completo | ⏳ Não testado | - |
| 14 | Navegação | ⏳ Não testado | - |
| 15 | Erro Conexão | ⏳ Não testado | - |
| 16 | Token Expirado | ⏳ Não testado | - |
| 17 | Validação | ⏳ Não testado | - |
| 18 | Performance | ⏳ Não testado | - |
| 19 | Tamanho Request | ⏳ Não testado | - |
| 20 | Headers | ⏳ Não testado | - |
| 21 | CORS Restritivo | ⏳ Não testado | - |
| 22 | Logs | ⏳ Não testado | - |
| 23 | Documentação | ⏳ Não testado | - |

---

**Data da Criação:** 4 de Dezembro de 2024  
**Versão:** 1.0
