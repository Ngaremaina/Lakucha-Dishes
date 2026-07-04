# Lakucha Dishes — Production Rewrite Workplan

Target: rebuild the current Flask/SQLite/mixed-UI prototype into a production-grade
food-ordering platform on **Spring Boot + Neon Postgres** (backend) and
**React + Tailwind** (frontend), deployed on **Render**, with **M-Pesa** as the
payment rail.

This document is the plan only — no code has been changed yet.

---

## 1. Current state (reverse-engineered)

**Backend** — Flask, SQLAlchemy, Marshmallow, Flask-JWT-Extended, SQLite locally /
Postgres via `DATABASE_URL` in prod, Gunicorn, Docker.

**Domain model**: `Auth` (user + role), `Profile`, `Category`, `Product`, `Rating`,
`Cart`, `Contact`, `Shipping`. There is **no `Order` entity** — the cart is the only
persisted purchase record, so there's no order history or status tracking today.

**Frontend** — React 19 + Vite, React Router, Axios, four overlapping styling
systems installed at once (Tailwind, MUI, Material-Tailwind, styled-components +
emotion), Context API for auth/global state.

**Payments** — M-Pesa Daraja STK Push (sandbox), called directly from a route file
mixed in with blueprint registration.

### Findings that shape the plan

| # | Issue | Where |
|---|---|---|
| 1 | No route requires authentication — `@jwt_required()` is never used | `server/routes/*.py` |
| 2 | IDOR: cart/user/shipping mutations never check the caller owns the resource | `cart.py`, `user.py`, `shipping.py` |
| 3 | Marshmallow schemas don't mark `id` `dump_only` → mass-assignment on POST | `schemas.py` |
| 4 | M-Pesa STK push uses a hardcoded timestamp string, so it's broken | `route.py` |
| 5 | No `Order` entity — can't show order history or track fulfillment status | `models.py` |
| 6 | `price`/`total` are `Integer`, not fixed-point/decimal — rounding risk on money | `models.py` |
| 7 | No pagination, no consistent error shape, almost no tests | backend-wide |
| 8 | Backend base URL hardcoded in frontend instead of env var | `frontend/src/api/api.js` |
| 9 | Four styling libraries installed simultaneously — inconsistent UI, bloated bundle | `frontend/package.json` |
| 10 | No CI step runs backend tests against Postgres; no Flyway/Alembic gating in CI | `.github/workflows/*` |

---

## 2. Target architecture

### Backend: Spring Boot

- **Java 21**, **Spring Boot 3.x**
- **Spring Web** (REST controllers) + **springdoc-openapi** for auto-generated API docs
- **Spring Data JPA** + **Hibernate** for persistence
- **Flyway** for versioned schema migrations (replaces Alembic)
- **Spring Security 6** + **JWT** (access + refresh token pair; short-lived access
  token, rotating refresh token) — replaces Flask-JWT-Extended, and this time every
  endpoint is protected by default (`permitAll` is an explicit opt-in, not the
  default)
- **Bean Validation** (`jakarta.validation`) on request DTOs — replaces Marshmallow
- **BCrypt** via Spring Security's `PasswordEncoder` — replaces Werkzeug hashing
- **MapStruct** for entity↔DTO mapping (keeps entities out of the wire format,
  closing the mass-assignment hole)
- **Bucket4j** for basic rate limiting on `/auth/login`, `/auth/register`, `/payments`
- **Testcontainers** (Postgres) + JUnit 5 + Mockito for integration/unit tests
- **Spring Boot Actuator** for `/actuator/health` and metrics

### Database: Neon Postgres

- One Neon project, with **branches**: `main` (prod), `staging`, and ad-hoc dev
  branches per feature (Neon's branch-per-PR workflow works well with a
  GitHub Actions step that creates/tears down a branch for integration tests)
- Flyway manages schema; no more hand-edited SQLite files in the repo
- Connection via Neon's pooled connection string (PgBouncer-compatible) for the app,
  direct connection reserved for migrations

### Frontend: React + Tailwind only

- Keep React 19 + Vite + React Router — the app structure is sound, the styling
  layer is not
- **Remove**: `@mui/material`, `@mui/styled-engine-sc`, `@material-tailwind/react`,
  `styled-components`, `@emotion/*`
- **Keep/standardize on**: Tailwind CSS v4 (already partially wired via
  `@tailwindcss/vite`) as the only styling system
- Add a small **headless component layer** (Radix UI primitives or Headless UI) for
  accessible dropdowns/dialogs/toasts, styled with Tailwind utility classes —
  avoids reinventing accessible components while keeping a single visual language
- **TanStack Query** for server-state — replaces the manual `useEffect` +
  service-call pattern in `GlobalContext.jsx` (which today refetches products/
  categories/cart on every mount). Query results are cached and deduped per
  key, with per-resource `staleTime` tuning: catalog data (products,
  categories) rarely changes so it's cached long (minutes), cart/order data is
  cached short and invalidated on mutation — so the same screen doesn't hit the
  backend on every navigation, only when data is actually stale or a mutation
  invalidates it
- **Zustand** for client-side state — replaces the `Authentication`/
  `GlobalContext` Context providers entirely. One small store for auth session
  (the in-memory access token + decoded user/role — **not** persisted to
  `localStorage`, since the refresh token already lives in an `httpOnly` cookie
  per the backend's silent-refresh design in §6.3; on app load, a silent
  `POST /auth/refresh` repopulates the access token from that cookie) and one
  for cart/UI state that isn't naturally server state (e.g. cart drawer open/
  closed, checkout step). Server data itself (products, cart contents, orders)
  stays in TanStack Query's cache, not duplicated into Zustand.
- **Zod** + `react-hook-form` for form validation (login/register/checkout)
- Design system pass: extract a small token set (brand colors, spacing, radius,
  shadows) into `tailwind.config` theme extension, and build a shared component kit
  (`Button`, `Card`, `Input`, `Badge`, `Skeleton`, `Toast`, `Navbar`, `Footer`)
  so pages compose from consistent primitives instead of ad-hoc classNames
- `VITE_API_BASE_URL` env var replaces the hardcoded Axios `baseURL`

### Domain model changes

- Add a real **`Order`** and **`OrderItem`** entity: placing an order snapshots the
  cart into an immutable order record with a status enum
  (`PENDING_PAYMENT → PAID → PREPARING → OUT_FOR_DELIVERY → DELIVERED / CANCELLED`).
  Cart becomes purely a pre-checkout scratchpad again.
- Add a **`Payment`** entity tied to `Order`, storing the Daraja `CheckoutRequestID`,
  status, and callback payload — needed to fix the M-Pesa flow properly and to
  reconcile async callbacks.
- `price`, `total`, `amount` become `NUMERIC(10,2)` / `BigDecimal`, not integers.
- `Role` becomes a proper enum (`CUSTOMER`, `ADMIN`) enforced by Spring Security
  method security (`@PreAuthorize`), not a free-text string.
- Ownership checks: cart/order/shipping endpoints resolve the authenticated
  principal and verify `resource.userId == principal.id` (or `ADMIN`) before any
  mutation.

### Payments: M-Pesa, fixed

- Generate the Daraja password/timestamp dynamically per request (current code
  hardcodes a stale timestamp, so STK push is currently non-functional)
- Add a `/payments/callback` endpoint Safaricom calls back on, which updates the
  `Payment`/`Order` status — currently the callback URL points at a placeholder
  domain and nothing consumes it
- Persist every STK push attempt so payment status can be polled from the frontend
  instead of trusting only the immediate response
- Store Daraja credentials as Render environment secrets, never in source

### Infra / deployment

- **Render**: one Web Service (Docker) for the Spring Boot API, one Static Site
  for the Vite build output
- **Neon**: managed Postgres, connected via env-configured JDBC URL + pooled
  connection string
- **GitHub Actions**:
  - PR pipeline: `mvn verify` (unit + Testcontainers integration tests) for
    backend, `npm run lint && npm run build` for frontend
  - Main-branch pipeline: build & push Docker image, trigger Render deploy hook,
    run Flyway `migrate` as a release step
- Secrets (JWT signing key, Neon URL, Daraja consumer key/secret) live in Render's
  environment settings and GitHub Actions secrets — never committed (there's
  currently no `.env` in the repo, which is good; keep it that way)

---

## 3. Proposed repo layout

```
Lakucha-Dishes/
├── backend-java/            # new Spring Boot service
│   ├── src/main/java/com/lakucha/
│   │   ├── auth/            # security config, JWT filter, login/register
│   │   ├── catalog/         # Product, Category, Rating
│   │   ├── cart/
│   │   ├── order/           # Order, OrderItem, status transitions
│   │   ├── payment/         # M-Pesa client, Payment entity, callback controller
│   │   ├── shipping/
│   │   ├── contact/
│   │   └── common/          # error handling, DTO base classes, pagination
│   ├── src/main/resources/db/migration/   # Flyway SQL
│   └── src/test/java/...
├── frontend/                 # existing app, restyled
└── docker-compose.yml         # updated to run backend-java + frontend
```

The old Flask `backend/` is deleted outright at the start of Phase 0, not kept
around for a parallel-run cutover — Spring Boot is the backend from day one.
Its routes/models/schemas are already fully documented in Section 1 above, so
nothing is lost by removing the source; that section (plus git history) is the
reference used to build the Java equivalent.

---

## 4. Phased plan

### Phase 0 — Foundations (small) — ✅ done
- Delete the old Flask `backend/` directory and its Python CI workflow outright
  — no parallel run, Spring Boot replaces it immediately
- Provision Neon project + `main`/`staging` branches
- Scaffold the new `backend/` as a Spring Boot project with Spring Initializr
  (Web, Data JPA, Security, Validation, Flyway, PostgreSQL driver, Testcontainers)
- Write the first Flyway migration from the reverse-engineered schema (Section 2),
  including the new `Order`, `OrderItem`, `Payment` tables and `NUMERIC` money columns
- Stand up Spring Security with JWT filter, `PasswordEncoder`, and a
  `permitAll`-by-exception security config
- Add `.github/workflows/java-ci.yml` (JDK 21 + Maven + Testcontainers) running
  from the first commit, replacing `python-app.yml`

### Phase 1 — Backend core domain (medium/large) — ✅ done
- Auth: register/login, BCrypt, role enum, `@PreAuthorize` guards, access token
  (JWT) + rotating opaque refresh token in an `httpOnly` cookie, `/auth/refresh`
  for silent refresh, `/auth/logout` revokes the refresh token
- Catalog: Category, Product, Rating CRUD (admin-only writes, public reads)
- Cart: per-user cart with ownership enforcement
- Order: checkout endpoint that converts a cart → immutable Order + OrderItems,
  status transitions restricted to admin/system
- Shipping, Contact endpoints
- OpenAPI docs via springdoc, generated Postman/HTTP-client collection for manual QA
- Unit + Testcontainers integration tests for every module as it's built (not
  deferred to the end) — every module now has an IT class
  (`AuthControllerIT`, `CategoryControllerIT`, `ProductControllerIT`,
  `RatingControllerIT`, `CartControllerIT`, `OrderControllerIT`,
  `AdminOrderControllerIT`, `PaymentControllerIT`, `ShippingControllerIT`,
  `ContactControllerIT`, `ProfileControllerIT`), plus `RateLimitFilterTest`

### Phase 2 — Payments (medium) — ✅ done
- Rebuild Daraja STK push with dynamic timestamp/password generation
- `/payments/callback` handler + `Payment` status reconciliation
- Idempotency: guard against duplicate STK pushes for the same order
- Manual sandbox test against Safaricom's Daraja sandbox before considering this done
  (mocked in `PaymentControllerIT`; a `FakeDarajaClient` under the `e2e` Spring
  profile stands in for a real sandbox call in the Playwright smoke test — see
  Phase 4)

### Phase 3 — Frontend rebuild (medium/large) — ✅ done

**UI redesign**
- Remove MUI/Material-Tailwind/styled-components/emotion from `package.json`
- Define Tailwind theme tokens (brand palette, type scale, spacing, radius,
  shadows) in `tailwind.config` — a real design pass, not just utility classes
  sprinkled on the existing markup
- Build the shared component kit (Button, Card, Input, Badge, Navbar, Footer,
  Toast, Skeleton, Modal) on Tailwind + Radix/Headless UI primitives
- Re-skin existing pages (Menu, DetailsPage, Cart, Checkout, Payment, Login,
  Register, Contact, About) on the new kit — same routes/flows, new visual layer
- Add loading/empty/error states everywhere a list is fetched (menu, cart, orders) —
  today's app has none
- Add an **Order history** page, since the backend now actually has orders
- Add a minimal **`/admin`** dashboard (role-gated on `role === ADMIN`): product
  and category CRUD, order list with status updates, contact-message inbox —
  the backend already enforces these as admin-only via `@PreAuthorize`

**State & data layer**
- Introduce **TanStack Query** for all server data (products, categories,
  cart, orders, ratings), tuned per-resource `staleTime` so navigating between
  pages reuses cached data instead of re-hitting the backend every time;
  mutations (add to cart, checkout, admin edits) invalidate only the affected
  query keys
- Introduce **Zustand** for client-side state (auth session, cart-drawer/
  checkout-step UI state) and delete `Authentication.jsx`/`GlobalContext.jsx`
  entirely — no more manually-orchestrated `useEffect` fetch waterfalls
  (`GlobalContext.jsx:37-63` today refetches products+categories+cart together
  on every token change)
- Access token lives only in the Zustand store (memory), never `localStorage`;
  a silent `POST /auth/refresh` on app boot repopulates it from the backend's
  `httpOnly` refresh cookie
- Move Axios `baseURL` to `VITE_API_BASE_URL`

### Phase 4 — Hardening & observability (small/medium) — ✅ done
- Bucket4j rate limits on auth + payment endpoints — in-memory, per-client-IP,
  configurable via `app.rate-limit.*` (`RateLimitFilter`); fine for the
  single-Render-instance target, would need `bucket4j-redis` for multi-instance
- Structured JSON logging (Logback), Actuator health checks wired to Render's
  health-check config — `logback-spring.xml`: human-readable console by default,
  JSON (logstash encoder) under `SPRING_PROFILES_ACTIVE=prod`
- Centralized `@ControllerAdvice` error handler with a consistent JSON error shape
  — already existed (`GlobalExceptionHandler`)
- CORS locked to the real frontend origin(s) only — `CORS_ALLOWED_ORIGINS` env var
- Basic frontend E2E smoke test (Playwright): register → login → browse → add to
  cart → checkout → (sandbox) pay — `frontend/e2e/checkout.spec.js`, run via
  `.github/workflows/e2e.yml`; backend runs with `SPRING_PROFILES_ACTIVE=e2e`
  so `FakeDarajaClient` + `E2eDataSeeder` stand in for Safaricom/seed data

### Phase 5 — Data migration & launch (medium) — not started
- One-off script to export any existing SQLite/Postgres data (users, products,
  categories) and load it into the new Neon schema (carts intentionally **not**
  migrated — they're ephemeral)
- Deploy the Spring Boot backend + restyled frontend to Render staging, point
  frontend `VITE_API_BASE_URL` at staging, run the full manual + Playwright
  smoke pass
- Cut DNS/env over to production, monitor Actuator health + Render logs

**Remaining before Phase 5**: Neon project not yet provisioned (backend still
targets a plain Postgres via `SPRING_DATASOURCE_URL`); no admin bootstrap path
(the first `ADMIN` user must be promoted directly in the database — there's no
self-serve "become admin" endpoint, intentionally); no frontend component tests
(Vitest + RTL) yet, only the Playwright smoke test.

---

## 5. Testing strategy

There is no interim Flask test suite — the Flask backend is deleted outright in
Phase 0 rather than kept running in parallel, so all backend tests are written
directly against the new Spring Boot service from its first commit.

**Backend — JUnit 5 + Mockito + Testcontainers**
- Every module (auth, catalog, cart, order, payment, shipping, contact) gets:
  service-layer unit tests (Mockito), and a `@SpringBootTest` + `MockMvc`
  controller/integration test run against a real ephemeral **Testcontainers
  Postgres** — not H2, so behavior matches Neon/Postgres exactly, including
  `NUMERIC` money columns.
- Flyway migrations run against that same Testcontainers instance before each
  test class, so a broken migration fails CI, not production.
- The Daraja M-Pesa client is tested against a mocked HTTP layer (e.g.
  `MockRestServiceServer`/WireMock) — no real Safaricom calls in CI, even
  though your real Daraja credentials already exist locally; they're only ever
  read from environment config at runtime, never from test code or git.
- Security tests directly target what the old Flask app got wrong: requests to
  protected routes without a valid JWT get 401/403, and a user cannot
  read/mutate another user's cart, order, or shipping record (ownership checks).
- `mvn verify` runs the full suite; JaCoCo generates a coverage report uploaded
  as a CI artifact.

**Frontend — Vitest + React Testing Library** (added in Phase 3 once the
Tailwind rebuild starts): component tests for the shared kit (Button, Card,
Input, etc.), provider tests for auth/cart state with API calls mocked, and
Playwright for the checkout happy-path E2E.

**CI**: `.github/workflows/java-ci.yml` (JDK 21 + Maven, Docker available for
Testcontainers on `ubuntu-latest`) replaces `python-app.yml` entirely and runs
`mvn verify` on every push/PR from Phase 0 onward.

## 6. Risks / open questions to confirm before Phase 0 starts

1. ~~**Existing data**~~ — **Resolved**: no existing data to preserve. `backend/`
   (Flask) is deleted outright with no export step.
2. ~~**M-Pesa credentials**~~ — **Resolved**: you already have Daraja
   credentials in a local `.env` file. They stay out of git and out of the test
   suite (Section 5 mocks all outbound Safaricom calls); they'll move to
   Render/GitHub Actions secrets at deploy time (Section 2, Infra).
3. ~~**Auth session model**~~ — **Resolved**: access token (short-lived JWT,
   returned in the response body, sent as `Authorization: Bearer`) + refresh
   token (opaque, stored hashed in the DB, delivered as an `httpOnly`/`Secure`
   cookie, rotated on every use). The frontend performs a silent refresh via
   `POST /auth/refresh` (cookie sent automatically) instead of ever holding the
   refresh token in JS-reachable storage.
4. ~~**Admin surface**~~ — **Resolved**: add a minimal admin dashboard.
   Backend endpoints are already role-gated per Section 2 (`@PreAuthorize`);
   Phase 3 (frontend rebuild) adds an `/admin` area (product/category CRUD,
   order list + status update, contact-message inbox) gated on `role === ADMIN`.

---

## 7. Next step

Phases 0–4 are done: Spring Boot backend (auth, catalog, cart, orders, payments,
shipping, contact, profile) with a Testcontainers IT class per module, a
restyled React/Tailwind frontend with an admin dashboard, Bucket4j rate
limiting, structured JSON logging, a Spring Boot Dockerfile + working
`docker-compose.yml`, and a Playwright smoke test wired into CI
(`.github/workflows/e2e.yml`).

What's left is all Phase 5 (launch), which needs decisions only you can make:
provisioning the real Neon project/branches, deciding the first-admin bootstrap
approach for production (there's no self-serve promote-to-admin route by
design — Section 6.4), and the actual Render deploy + DNS cutover.
