# Pointhub API Starter

## Features
- **Compression** Using gzip compression with [Compression](https://github.com/expressjs/compression)
- **CORS** Cross-Origin Resource-Sharing enabled using [Cors](https://github.com/expressjs/cors)
- **Environment Variable** using [dotenv](https://www.npmjs.com/package/dotenv)
- **Secure HTTP Headers** using [Helmet](https://github.com/helmetjs/helmet)

## Development Stack
- [Node.js](https://nodejs.org) JavaScript run-time environment
- [Express](https://expressjs.com) Node.js framework
- [Typescript](https://www.typescriptlang.org/) for type checking
- [Jest](https://jestjs.io/), [ts-jest](https://www.npmjs.com/package/ts-jest) for unit testing
- [Supertest](https://www.npmjs.com/package/supertest) for e2e testing
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting

## Services
- [MongoDB](https://www.mongodb.com/docs/drivers/node/current/) Database

## Directory Structure

```bash
PAPI-STARTER
├── build
├── coverage
├── node_modules
├── src
│   ├── assets
│   ├── config
│   ├── database
│   ├── middleware
│   ├── modules
│   │   └── example
│   │       ├── controller
│   │       ├── model
│   │       ├── use-case
│   │       ├── validation
│   │       └── router.ts
│   ├── services
│   └── test
│       ├── setup.ts
│       ├── teardown.ts
│       └── utils.ts
├── .env
├── .env.example
├── .env.text
├── .env.test.example
└── README.md
```

## Contribution Guide

---

### Database for development

Since transactions are built on concepts of logical sessions they require mechanics which are only available in a replica set environment.

Choose one of the options that you prefer

- Install offline MongoDB database replica set using docker
[Docker MongoDB RS](https://github.com/point-hub/docker-mongodb-rs)

- Use online Database as a Service (DBaaS) [Atlas MongoDB](https://www.mongodb.com/atlas/database)

### Installation

If you are using docker for installation, currently we cannot connect it to the local MongoDB database. So you should use an online database for development

#### With Docker

> You still need to install dependencies locally to enable development features like eslint, prettier, and test. 

```bash
cp .env.example .env
cp .env.test.example .env.test
npm install
docker-compose up
```

#### Without Docker

```bash
cp .env.example .env
cp .env.test.example .env.test
npm install
npm run dev
```

### Setup Database

#### Add Validation Schema

```bash
node cli db:init
```

#### Seed Default Database

```bash
node cli db:seed
```

### Testing

Setup Database Schema

```bash
node cli db:init --db-name="starterTestDB"
```

Testing all test case

```bash
npm run test
```

Testing specific file or folder

```bash
# Test specific file
npm run test -- src/modules/example/controller/create.spec

# Test specific folder
npm run test -- src/modules/example/controller

# Test example module
npm run test -- src/modules/example
```

(Optional) Running test from docker

1. Check running container

```bash
docker ps
```

```bash
CONTAINER ID   IMAGE              COMMAND                  CREATED             STATUS                PORTS                                 NAMES
902293b368b3   papi-starter-api   "docker-entrypoint.s…"   About an hour ago   Up 11 minutes         0.0.0.0:3000->3000/tcp
```

2. Access docker container using CONTAINER ID above

```bash
docker exec -it 902293b368b3 bash
```

3. Run test inside docker container

```bash
node@902293b368b3:~/app$ npm run test
```

### Deployment

```bash
docker build -t pointhub/papi-starter .
```