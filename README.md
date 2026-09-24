# Portal Administrativo - Gestão de Cartas

Este projeto é um Portal Administrativo para a gestão de cartas (Magic: The Gathering, Pokémon e Yu-Gi-Oh!), desenvolvido como teste técnico para a vaga de Fullstack Frontend.

## 🚀 Como Inicializar o Projeto

O projeto utiliza **Docker** para garantir que o ambiente seja padronizado e fácil de rodar. O backend foi construído em PHP Puro e o banco de dados é o MySQL.

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na sua máquina.

### Passo a Passo

1. Abra o terminal na raiz do projeto (onde está localizado o arquivo `docker-compose.yml`).
2. Execute o comando abaixo para subir os containers em segundo plano:
   ```bash
   docker-compose up -d
   ```
3. Aguarde alguns segundos para que o banco de dados MySQL inicialize e crie as tabelas automaticamente através do script de seed.
4. Acesse o portal pelo navegador no endereço:
   👉 **http://localhost:8080**

## 🔐 Credenciais de Acesso (Teste)

O banco de dados já sobe pré-populado com um usuário administrador padrão para testes. 

- **Usuário:** `admin`
- **Senha:** `admin123`

## 🧠 Decisões de Produto / UX

*(As decisões de UX e fluxo da aplicação serão documentadas aqui assim que o frontend for construído).*

1. **Decisão 1:** (Em breve)
2. **Decisão 2:** (Em breve)
