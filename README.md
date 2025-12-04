Este arquivo deve ser salvo como `README.md` na pasta `mobile-app-crud`.

```markdown
# 📱 Frontend: App Mobile CRUD de Produtos (Desafio 2)

Esta é a aplicação mobile desenvolvida em **React Native + TypeScript (Expo)** que consome a API de Produtos para realizar operações de **CRUD** (Cadastrar, Ler, Editar e Deletar).

## ⚙️ Tecnologias Utilizadas

- **Framework:** React Native
- **Ambiente:** Expo
- **Linguagem:** TypeScript (TSX)
- **Conexão:** API RESTful (Backend em Node/Express)

## 🔗 Endereço do Backend Conectado

O aplicativo está configurado para se conectar à API implantada publicamente.

- **URL Base do Backend:** [https://backend-api-crud-coral.vercel.app/](https://backend-api-crud-coral.vercel.app/)

## 🚀 Instalação e Execução

Para rodar este aplicativo, você precisará ter o Node.js, npm/yarn e o Expo CLI instalados na sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone https://f-droid.org/pt_BR/tutorials/add-repo/
    cd mobile-app-crud
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Inicie o Expo:**
    ```bash
    npm start
    # ou
    expo start
    ```

4.  **Visualizar:**
    -   Use o aplicativo **Expo Go** no seu celular para escanear o código QR exibido no terminal.
    -   Pressione `a` para abrir no Emulador Android.
    -   Pressione `i` para abrir no Simulador iOS.

## 💾 Estrutura do Projeto

O código principal da aplicação reside no arquivo `app.tsx`, que contém:

-   A interface de usuário (formulário e lista).
-   Toda a lógica de estado (`useState`, `useEffect`).
-   As funções assíncronas (`fetchProducts`, `handleSubmit`, `deleteProduct`) que realizam as operações CRUD via HTTP.

---
