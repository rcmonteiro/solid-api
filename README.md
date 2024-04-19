# SOLID API

Projeto para praticar conceitos SOLID na criação de uma API Node.js

Para implementar os 5 princípios do SOLID, foram feitas estas decisões de design patterns:

**Single-responsibility**
- 
**Open–closed**
- 
**Liskov substitution**
- 
**Interface segregation**
- 
**Dependency inversion**
- Os controllers ficam responsáveis de instanciar os use cases passando as dependências, assim podemos focar em criar repositórios genéricos que vão forçar os repositórios de dependência seguirem as regras do jogo, deixando todo o código bem independente em termos de regras de negócio dos casos de uso, que nesta versão da API, por ser algo bem simplificado, ficou como uma simples interface mesmo, mas poderia ser uma classe abstrata.


# Detalhamento da API

GymPass style app.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- [x] Deve ser possível o usuário obter o seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após ser criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

# Cobertura de testes

- Testes unitários em todos os use cases, usando banco de dados em memória
- Testes e2e em todas as rotas, usando um banco de dados isolado

```sh
------------------|---------|----------|---------|---------|
File              | % Stmts | % Branch | % Funcs | % Lines |
------------------|---------|----------|---------|---------|
All files         |   95.51 |    89.93 |   96.51 |   95.51 |                   
------------------|---------|----------|---------|---------|
```

- Rodando com Github Actions a cada push, todos os testes unitários:
![unit-tests](./docs/images/unit-tests.png)

# Project Timeline

Setup do projeto
- Create .npmrc file with `save-exact=true` 
  - [todo] Someday, test an upgrade automation with [renovate](https://github.com/renovatebot/renovate)
- npm i typescript @types/node tsx tsup -D
- npx tsc --init
- Change on tsconfig.json `"target": "es2020",` and `baseUrl` and `paths`
- Create start:dev, start and build scripts
- Create a .gitignore file
- npm i fastify dotenv zod
- set the env.ts env validation
- npm i eslint @rocketseat/eslint-config -D (or just eslint --init to setup a fresh config)
  - .eslintrc.json and .eslintignore
- Install prisma
  - npm i prisma -D
  - npx prisma init
  - npx prisma generate
  - npm i @prisma/client
- Run postgres docker image
  - edit .env `DATABASE_URL="postgresql://docker:docker@localhost:5432/apisolid?schema=public"`
  - docker compose up/down (create/delete)
  - docker compose start/stop
- Create other models and run the migration
- Setup Vitest
  - npm install -D vitest vite-tsconfig-paths @vitest/coverage-v8
  - vite.config.ts
- Create use cases and tests, using TDD methodology
- Create factories for repo dependencies in use-cases inside controllers
- Create controllers
- Setup for JWT Auth
  - npm i @fastify/jwt
  - env and app.js chore
- Setup for Vitest Testing Environments
  - Create /prisma/vitest-environment-prisma
  - On /prisma/vitest-environment-prisma:
    - run npm init -y
    - change the main for prisma-test-environment.ts
    - run npm link
  - Back on root dir
    - run npm link vitest-environment-prisma
- Setup CI/CD
  - CI: run all unit tests on every push on github using github actions
- 