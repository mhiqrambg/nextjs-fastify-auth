# node-fastify-reactjs

#### Package

"dependencies": {

"@fastify/cors": "^11.1.0",

"@fastify/helmet": "^13.0.1",

"@fastify/jwt": "^10.0.0",

"@fastify/postgres": "^6.0.2",

"@fastify/sensible": "^6.0.3",

"@fastify/swagger": "^9.5.1",

"@fastify/swagger-ui": "^5.2.3",

"argon2": "^0.44.0",

"fastify": "^5.5.0",

"fastify-type-provider-zod": "^5.0.3",

"pg": "^8.16.3",

"zod": "^4.1.1"

"node-cron": "^4.2.1",

"@types/node": "^24.3.0",

"@types/pg": "^8.15.5",

"dotenv-cli": "^10.0.0",

"node-pg-migrate": "^8.0.3",

"pino-pretty": "^13.1.1",

"ts-node": "^10.9.2",

"tsx": "^4.20.5",

"typescript": "^5.9.2"

#### Structure Folder

├── migrations
│ └── 1756149637174_users-create-table.js
├── package-lock.json
├── package.json
├── README.md
├── src
│ ├── app.ts
│ ├── index.ts
│ ├── modules
│ │ ├── auth
│ │ │ ├── controller.ts
│ │ │ ├── model.ts
│ │ │ ├── route.ts
│ │ │ ├── service.ts
│ │ │ └── validation.ts
│ │ ├── health
│ │ │ └── route.ts
│ │ └── users
│ │ ├── controller.ts
│ │ ├── model.ts
│ │ ├── route.ts
│ │ ├── service.ts
│ │ └── validation.ts
│ ├── plugins
│ │ ├── auth.ts
│ │ ├── cors.ts
│ │ ├── db.ts
│ │ ├── errorHandler.ts
│ │ ├── jwt.ts
│ │ ├── swagger.ts
│ │ └── users.ts
│ └── utils
│ └── errors.ts
└── tsconfig.json

#### Existing Feature

- Auth (signin/up)
- Users

#### Route

- auth
- users
- health

# StarterKit

#### Install

#### Implementasi
