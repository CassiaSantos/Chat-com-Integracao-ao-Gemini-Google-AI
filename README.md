# Chat com Gemini (Google AI) - Desafio Técnico Growdev

![Status](https://img.shields.io/badge/status-conclu%C3%ADdo-brightgreen)![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=nodedotjs)![MongoDB](https://img.shields.io/badge/MongoDB-blueviolet?logo=mongodb)![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black?logo=socketdotio)

Esse projeto consiste em uma aplicação Full-Stack de um chat integrado com a IA Generativa do Google, Gemini. Desenvolvido como parte do processo seletivo para a vaga de Pessoa Desenvolvedora de Software Trainee na Growdev.

## 🚀 Aplicação em Produção

**Acesse a versão ao vivo da aplicação:**
### **[https://chat-com-integracao-ao-gemini-googl.vercel.app/](https://chat-com-integracao-ao-gemini-googl.vercel.app/)**

---

## 📋 Índice

- [Sobre o Projeto](#📖-sobre-o-projeto)
- [✨ Principais Funcionalidades](#✨-principais-funcionalidades)
- [🛠️ Tecnologias Utilizadas](#🛠️-tecnologias-utilizadas)
- [▶️ Como Rodar o Projeto Localmente](#▶️-como-rodar-o-projeto-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação e Execução](#instalação-e-execução)
- [🧪 Rodando os Testes](#🧪-rodando-os-testes)
- [☁️ Arquitetura de Deploy](#☁️-arquitetura-de-deploy)
- [👩‍💻 Autora](#👩‍💻-autora)

---

## 📖 Sobre o Projeto

O objetivo deste desafio foi construir uma aplicação web Full-Stack que simula um chat com inteligência artificial, utilizando o modelo de linguagem **Gemini do Google**. O projeto foi desenvolvido para avaliar habilidades técnicas em desenvolvimento frontend e backend, estruturação de aplicações modernas e familiaridade com a integração de APIs externas.

A aplicação permite que os usuários se autentiquem com um nome, criem múltiplas conversas, interajam com a IA em tempo real e tenham seu histórico salvo de forma persistente.

---

## ✨ Principais Funcionalidades

-   **Autenticação Simples:** Login baseado em nome de usuário para persistência de dados.
-   **Histórico de Conversas:** As conversas de cada usuário são salvas no banco de dados.
-   **Mensagens em Tempo Real:** Comunicação com o backend via **WebSockets (Socket.io)** para uma experiência de chat fluida.
-   **Streaming de Respostas da IA:** As respostas do Gemini são exibidas palavra por palavra, simulando um efeito de digitação em tempo real.
-   **Renderização de Markdown:** As respostas da IA que contêm formatação (listas, negrito, etc.) são renderizadas corretamente.
-   **Gerenciamento de Conversas:**
    -   Criação de novas conversas.
    -   Renomeação automática baseada na primeira mensagem do usuário (com limite de 30 caracteres).
    -   Exclusão de conversas com modal de confirmação.
-   **Interface Responsiva:** Design adaptável que oferece uma excelente experiência tanto em desktops quanto em dispositivos móveis, com um layout de duas telas para mobile.
-   **Testes Automatizados:** Suíte de testes unitários para o backend (Jest) e para os componentes do frontend (Vitest + React Testing Library) para garantir a qualidade e a estabilidade do código.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

#### **Frontend**

-   **React 18** com **Vite**: Para a construção da interface de usuário.
-   **React-Bootstrap**: Para componentes de UI responsivos e estilizados.
-   **Socket.io-client**: Para a comunicação em tempo real com o backend.
-   **React-Markdown**: Para renderizar as respostas da IA formatadas em Markdown.
-   **Vitest & React Testing Library**: Para os testes unitários dos componentes.
-   **Axios**: Para as requisições HTTP (autenticação e gerenciamento de conversas).

#### **Backend**

-   **Node.js** com **Express**: Para a criação do servidor e das APIs REST.
-   **Socket.io**: Para a implementação do servidor WebSocket.
-   **Mongoose**: Para a modelagem e interação com o banco de dados MongoDB.
-   **Google Generative AI SDK (`@google/generative-ai`)**: Para a integração com a API do Gemini em modo de streaming.
-   **Jest**: Para os testes unitários da lógica de negócio.
-   **Dotenv**: Para o gerenciamento de variáveis de ambiente.

#### **Banco de Dados**

-   **MongoDB Atlas**: Banco de dados NoSQL na nuvem para persistência dos dados de usuários e conversas.

#### **Deploy**

-   **Frontend**: **Vercel**
-   **Backend**: **Render**
-   **Controle de Versão**: **Git & GitHub**

---

## ▶️ Como Rodar o Projeto Localmente

Siga os passos abaixo para executar a aplicação em sua máquina.

### Pré-requisitos

-   [Node.js](https://nodejs.org/pt/) (versão 18.x ou superior);
-   [Git](https://git-scm.com/);
-   Um cliente de terminal de sua preferência (Git Bash, PowerShell, etc.)
-   Uma conta e um banco de dados no Mongo DB Atlas;
-   Uma [chave de API do Google Gemini](https://aistudio.google.com/apikey);

### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/CassiaSantos/Chat-com-Integracao-ao-Gemini-Google-AI.git
    cd Chat-com-Integracao-ao-Gemini-Google-AI
    ```

2.  **Configure o Backend:**
    ```bash
    # Navegue até a pasta do backend
    cd backend

    # Instale as dependências
    npm install

    # Renomeie o arquivo .env.example para .env
    # e preencha com suas chaves:
    ```
    #### `backend/.env`
    ```env
    PORT=5000
    MONGODB_URI=SUA_STRING_DE_CONEXAO_DO_MONGODB_ATLAS
    GEMINI_API_KEY=SUA_CHAVE_DE_API_DO_GEMINI
    CLIENT_ORIGIN=http://localhost:5173
    ```
    ```bash
    # Inicie o servidor do backend
    npm run dev
    ```

3.  **Configure o Frontend (em um novo terminal):**
    ```bash
    # Navegue até a pasta do frontend
    cd frontend

    # Instale as dependências
    npm install

    # Renomeie o arquivo .env.example para .env
    # e preencha com as URLs corretas:
    ```
    #### `frontend/.env`
    ```env
    VITE_API_BASE=http://localhost:5000/api
    VITE_WS_URL=http://localhost:5000
    ```
    ```bash
    # Inicie a aplicação React
    npm run dev
    ```

4.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://localhost:5173](http://localhost:5173).

---

## 🧪 Rodando os Testes

Este projeto contém testes automatizados para garantir a qualidade do código.

-   **Para rodar os testes do Backend:**
    ```bash
    cd backend
    npm test
    ```

-   **Para rodar os testes do Frontend:**
    ```bash
    cd frontend
    npm test
    ```

---

## ☁️ Arquitetura de Deploy

A aplicação está hospedada utilizando uma arquitetura de deploy moderna e gratuita:
-   O **Backend Node.js** está implantado na plataforma **Render**;
-   O **Frontend React** está implantado na plataforma **Vercel**;
-   O **Banco de Dados** está hospedado no **MongoDB Atlas**.

---

## 👩‍💻 Autora

Desenvolvido por **Cássia Oliveira dos Santos**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/cassia-santos-areadeti/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CassiaSantos/)