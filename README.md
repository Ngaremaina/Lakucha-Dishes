# Lakucha Dishes

Lakucha Dishes is a food-ordering web app: browse a menu, place orders, and pay
with M-Pesa. The backend is a Spring Boot API on Postgres; the frontend is a
React + Tailwind single-page app.

## Tech stack

- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT + rotating refresh
  token), Spring Data JPA, Flyway, PostgreSQL, springdoc-openapi, Bucket4j
  (rate limiting), JUnit 5 + Testcontainers
- **Frontend:** React 19, Vite, Tailwind CSS, TanStack Query, Zustand,
  React Hook Form + Zod, Radix UI primitives
- **Payments:** Safaricom M-Pesa Daraja STK Push
- **Infra:** Docker / docker-compose, GitHub Actions CI, deploys to Render;
  Postgres via Neon in production

## Getting started

### Prerequisites

- **Docker + Docker Compose** — easiest way to run the full stack
- Or, to run services individually:
  - **Java 21** and **Maven** for the backend
  - **Node.js 22+** for the frontend
  - A local **PostgreSQL** instance

### Option A: Docker Compose (full stack)

```bash
docker compose up --build
```

This starts Postgres, the Spring Boot API (`http://localhost:8080`), and the
built frontend served by nginx (`http://localhost:80`).

### Option B: run services individually

**Backend** (`backend/`):

```bash
cd backend
mvn spring-boot:run
```

By default it expects Postgres at `jdbc:postgresql://localhost:5432/lakucha`
(user/password `lakucha`/`lakucha`) — override via `SPRING_DATASOURCE_URL`,
`SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`. Flyway migrates the
schema automatically on startup. See `backend/src/main/resources/application.yml`
for the full list of configurable environment variables (JWT secret, CORS
origins, cookie settings, Daraja credentials, rate limits).

**Frontend** (`frontend/`):

```bash
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL if the backend isn't on :8080
npm install
npm run dev
```

Visit `http://localhost:5173`.

### First admin user

There's no self-serve "become admin" endpoint by design. To access `/admin`,
register a normal account, then promote it directly in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

## Running tests

**Backend** — unit tests + Testcontainers integration tests (needs Docker):

```bash
cd backend
mvn verify
```

**Frontend** — lint and production build:

```bash
cd frontend
npm run lint
npm run build
```

**End-to-end smoke test** (Playwright, drives a real browser against a real
backend + frontend):

```bash
cd frontend
npx playwright install --with-deps chromium   # first time only
npm run test:e2e
```

## Features

- **Auth:** register/login, short-lived JWT access token + rotating refresh
  token in an `httpOnly` cookie, silent session refresh on page load
- **Catalog:** browse products by category, ratings
- **Cart & checkout:** per-user cart, shipping address, order placement
- **Payments:** M-Pesa STK Push with async callback reconciliation
- **Order history:** customers can track their past and in-progress orders
- **Admin dashboard** (`/admin`, role-gated): product and category CRUD, order
  list with status updates, contact-message inbox

## Project structure

```
Lakucha-Dishes/
├── backend/     # Spring Boot API
├── frontend/    # React + Vite SPA
└── docker-compose.yml
```

## License

This project is licensed under the [MIT License](LICENSE).
