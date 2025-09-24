# nextjs-fastify-auth

Authentication module for **Next.js + Fastify** applications.
This package provides a minimal, production-ready authentication system with JWT, secure password hashing, and role-based access control.

---

## ✨ Features

- 🔒 **JWT Authentication** (access & refresh tokens)
- 🧂 **Secure password hashing** with [argon2](https://www.npmjs.com/package/argon2)
- 👤 **User registration & login** APIs
- 🔑 **Role-based authorization** (e.g., `user`, `admin`)
- ♻️ **Token refresh endpoint**
- 📜 Built-in **input validation** (using Zod )
- ⚡️ Fast & lightweight (thanks to [Fastify](https://fastify.dev/))
