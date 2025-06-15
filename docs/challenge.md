# 📚 PagePilot Backend Engineer Take-Home Challenge

## 🏢 Company Backstory

**PagePilot** is a startup on a mission to bring independent bookstores online. We provide tools for small bookstore owners to manage their inventory, sales, and operations through a clean and simple digital platform.

As part of our new MVP, we’re building out the backend service to power our bookstore platform. You’ve been brought on as a backend engineer to architect and build out our core API layer for managing books, authors, and inventory.

---

## 🧪 Project Overview

### 🎯 Your Task

Your job is to design and implement a backend service using **TypeScript** and **Fastify** (preferred) or **Express** that supports:

- 📚 CRUD operations for **Books**
- ✍️ CRUD operations for **Authors**
- 📦 Ability to link a Book to an Author (many books per author)
- 🔎 Fetch all books by a specific author

**Bonus**
- ❤️ Optional: Mark a book as a "favorite" and fetch user favorites

Your implementation should follow RESTful API conventions, be modular and testable, and simulate a realistic backend service a full-stack team could consume.

---

## 📐 Requirements

### 🧱 Core Entities

#### `Author`
- `id` (UUID)
- `name` (string)
- `bio` (string)
- `birthYear` (number)

#### `Book`
- `id` (UUID)
- `title` (string)
- `summary` (string)
- `publicationYear` (number)
- `authorId` (UUID)

> You may store the data in memory or use a local RDBMS or Document Store. Bonus for using an ORM like Prisma or Moongoose.

---

## 🛠️ Tech Requirements

- Use **TypeScript**
- Use **Fastify** (preferred) or **Express**
- API follows **RESTful conventions**
- Responses must be in JSON format
- Write **unit or integration tests** for at least 2 of the endpoints (e.g., Vitest, Jest)

**Bonus**
- Implement **input validation** (e.g., Zod, Joi, or Fastify Schema)
- Add **OpenAPI spec** or basic API documentation (Swagger or similar)

---

## 🔌 API Requirements

### 📚 `/books`
- `POST /books`: Create a new book
- `GET /books`: List all books
- `GET /books/:id`: Get book by ID
- `PUT /books/:id`: Update book by ID
- `DELETE /books/:id`: Delete book by ID

### ✍️ `/authors`
- `POST /authors`: Create a new author
- `GET /authors`: List all authors
- `GET /authors/:id`: Get author by ID
- `PUT /authors/:id`: Update author by ID
- `DELETE /authors/:id`: Delete author by ID

### 🔎 `/authors/:id/books`
- `GET`: Get all books by this author

---

## ✅ Deliverables

- A GitHub repository with:
  - 📁 Clean, well-structured code
  - 📄 `README.md` with:
    - Setup instructions
    - API usage instructions
  - ✅ Tests for at least 1 model (book or author)
  - 📦 `package.json` with proper scripts (`dev`, `test`, `build`)

---

## 🏁 Bonus Ideas (Optional)

- Add user auth and associate favorites to a user
- Use Prisma with SQLite/PostgreSQL
- Containerize with Docker