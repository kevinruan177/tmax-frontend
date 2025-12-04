

# 🚴‍♂️ TMAX Entregas

**TMAX Entregas** é um sistema desenvolvido para facilitar a vida dos motoboys e entregadores autônomos, oferecendo ferramentas para **gerenciamento de entregas, cálculo de rotas otimizadas e cadastro de veículos e motoristas**.  
O objetivo do projeto é tornar o processo de entrega mais rápido, organizado e eficiente.

---

## 🧭 Índice

- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Configuração da API de Rotas](#configuração-da-api-de-rotas)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 📸 Demonstração

> _(Adicione aqui prints ou gifs do projeto rodando, por exemplo:)_

![Tela de Login](docs/login.png)
![Tela de Registro](docs/register.png)
![Mapa de Rotas](docs/map.png)

---

## ⚙️ Funcionalidades

✅ Cadastro de entregadores com nome, CPF e telefone  
✅ Escolha do tipo de veículo: **Bike, Moto ou Carro**  
✅ Sistema de login e redirecionamento automático  
✅ Integração com **mapas interativos (Leaflet)**  
✅ Cálculo de **rotas otimizadas** com a API da OpenRouteService  
✅ Interface moderna e responsiva feita com **Tailwind CSS**  
✅ Navegação entre telas com **React Router DOM**

---

## 🧠 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|--------------|
| Frontend | React, Vite |
| Estilização | Tailwind CSS |
| Roteamento | React Router DOM |
| Mapas | Leaflet |
| Requisições HTTP | Axios |
| API de rotas | OpenRouteService |
| Gerenciamento de estado | React Hooks (useState, useEffect) |

---

## 📁 Estrutura de Pastas

Tmax-entregas/
├── public/
│ ├── logo.png
│ └── index.html
├── src/
│ ├── components/
│ │ ├── Login.jsx
│ │ ├── RegisterForm.jsx
│ │ └── RouteStarted.jsx
│ ├── main.jsx
│ └── App.jsx
├── package.json
└── README.md


---

## 🚀 Como Executar o Projeto

### 🔧 Pré-requisitos
Antes de começar, você precisa ter instalado:
- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Git](https://git-scm.com/)
- Um editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

---

### 📦 Passos para rodar

```bash
# Clone este repositório
git clone https://github.com/seu-usuario/TMAX-MAIN.git

# Entre na pasta do projeto
cd TMAX-MAIN 

# Instale as dependências
npm install

# Execute o projeto
npm run dev
