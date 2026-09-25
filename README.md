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

## 🧠 Decisões de Arquitetura e UX

1. **Arquitetura Backend (PSR-4 e Modularização):** Apesar da restrição do uso de frameworks no desafio, decidi implementar o padrão PSR-4 utilizando o Autoloader do Composer. Aliado a uma separação modular de rotas e padrão MVC (Models e Controllers), isso garante que o código PHP puro seja altamente maduro e limpo, sem o clássico problema de múltiplos `require_once` espalhados.
2. **Padronização de Responses da API (Traits):** Foi criado um `ResponseTrait` no backend para garantir que qualquer requisição (com sucesso ou erro) devolva os dados no mesmo formato JSON padronizado (`{ success, message, data }`). Isso evita quebras e facilita muito a construção do frontend Vanilla que consome a API.
3. **Autenticação via Sessão Segura vs JWT:** Optei por usar Sessões Nativas do PHP configuradas com flags de segurança (`HttpOnly` e `SameSite: Strict`) em vez de JWT armazenado no `localStorage`. Essa escolha blinda a aplicação contra ataques XSS e CSRF, além de permitir a invalidação imediata do acesso no momento do logout.
4. **Armazenamento de Imagens e Segurança:** Em vez de salvar as imagens em formato Base64 diretamente no banco de dados (o que deixaria o banco extremamente lento e pesado), criei uma rotina de upload de arquivos para a pasta local `storage`. O banco armazena apenas a string do caminho (`image_url`). Além disso, implementei a validação de extensão e limite máximo de **2MB** no Controller, bloqueando uploads abusivos ou de arquivos executáveis disfarçados.

## 🖼 Imagens de Amostra (Testes)

Para facilitar os testes, foi criada uma pasta `sample_images/` na raiz do projeto. Ela já contém a árvore de diretórios exata separada por jogos e edições (ex: `sample_images/magic/dom/`). Você pode colocar imagens locais nessa pasta para usá-las facilmente durante o preenchimento de cadastros e validação da interface.

Dicas
docker-compose down -v; docker-compose up -d
