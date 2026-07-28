# CMPNION Hotel Service Management Dashboard

A responsive hotel operations dashboard for monitoring guest service requests, spotting SLA and payment issues, and moving orders through their lifecycle.

## AI assistance

This project was developed with AI assistance from OpenAI Codex using **GPT-5.6-Sol** with **high reasoning effort**.

## Features

- Operational overview with active guests, pending and completed orders, today's revenue, average order value, and service demand
- Search by guest name, order ID, or room number
- Combined status and service filters with newest/oldest sorting
- Order detail drawer with guest, request, payment, and lifecycle information
- Validated `New → Acknowledged → In Progress → Completed` transitions
- Cancellation from non-final states with confirmation and toast feedback
- Visual highlighting for orders that remain `New` beyond the 15-minute SLA
- Loading, empty, error, success, and not-found states
- Responsive desktop table and mobile order-card layouts
- Light and dark themes
- Typed frontend event tracking for navigation and key order workflows
- Optimistic order-status updates with automatic rollback on failure
- Simulated real-time order arrival with dashboard notification
- React component tests with Testing Library, Happy DOM, and Bun's test runner
- Extra Bed approval workflow with capacity context and approve/reject actions
- Mock staff authentication, persistent sign-out, safe return paths, and protected dashboard routes

## Technology and architecture

- **Bun** is the package manager, script runtime, and unit-test runner.
- **React, TypeScript, and Vite** provide the application and build foundation. The React Compiler is enabled through the Vite configuration.
- **Tailwind CSS** supplies the responsive design system, with reusable Base UI/shadcn-style primitives under `src/components/ui`.
- **React Router** runs in declarative mode. The central route registry drives routes, navigation items, active navigation state, page titles, and lazy page loading.
- **TanStack Query** owns asynchronous server state, caching, retries, and status mutations. UI-only state remains local to components, while order-list controls are represented by URL search parameters.
- **Mock Service Worker (MSW)** provides an asynchronous in-browser API for listing, filtering, sorting, paginating, retrieving, and updating orders. Mock data is held in memory and resets after a full page reload.
- **Feature-oriented modules** keep dashboard and order domain models, policies, API access, hooks, and components together. Shared infrastructure lives under `src/app`, `src/components`, and `src/lib`.
- **Authentication** uses a mock asynchronous session service backed by local storage. TanStack Query owns session state, protected routes preserve internal destinations, and authentication events use the same typed observability layer as order workflows.

Frontend observability emits typed `cmpnion:analytics` browser events. The
transport-neutral subscriber in `src/lib/analytics.ts` can be connected to a
production analytics SDK without coupling product features to a vendor. During
local development, every event is also logged automatically in the browser
console with the `[CMPNION analytics]` prefix.

Optimistic mutations share a reusable lifecycle hook under
`src/hooks/use-optimistic-mutation.ts`. Feature-specific cache adapters own the
snapshot, optimistic update, rollback, reconciliation, and invalidation rules.

While the dashboard is open, the mock API simulates an incoming order every
five seconds. Each order is added to cached dashboard/list data and surfaced
through an accessible toast notification. The simulation stops when the
dashboard is unmounted and prevents overlapping requests.

Daily dashboard metrics use the hotel's `Asia/Jakarta` timezone. Revenue today includes paid, non-cancelled orders placed on the current hotel date. Completed orders use the same date boundary.

## Prerequisites

- [Bun](https://bun.com/) 1.3.14 or newer

No separate Node.js installation is required.

The app starts with a seeded staff session so reviewers can enter the dashboard immediately. Use **Sign out** to exercise the protected-route flow, then sign in with:

- Email: `manager@cmpnion.test`
- Password: `companion123`

Authentication is intentionally frontend-only for this take-home. A production implementation must validate sessions and authorize order APIs on a trusted server.

## Local development

```bash
bun install
bun run dev
```

Vite prints the local URL when the development server starts, normally `http://localhost:5173`.

The mock API is enabled by default. Set `VITE_ENABLE_MOCKS=false` when connecting the frontend to a real API that implements the same endpoints.

## Available commands

| Command                    | Purpose                                        |
| -------------------------- | ---------------------------------------------- |
| `bun run dev`              | Start the Vite development server              |
| `bun run build`            | Type-check and create a production build       |
| `bun run ts:check`         | Run TypeScript without emitting files          |
| `bun run lint`             | Run Oxlint                                     |
| `bun run lint:fix`         | Apply safe lint fixes                          |
| `bun run fmt:check`        | Check formatting with Oxfmt                    |
| `bun run fmt`              | Format the repository with Oxfmt               |
| `bun run test`             | Run Bun unit, component, and integration tests |
| `bun run test:e2e:install` | Install Playwright's Chromium browser          |
| `bun run test:e2e`         | Run the Playwright end-to-end suite            |
| `bun run test:e2e:ui`      | Open Playwright's interactive test UI          |

## Routes and test states

| URL                     | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `/`                     | Operations overview                                      |
| `/orders`               | Searchable and filterable order management               |
| `/orders/:orderId`      | Order list with the requested order's detail drawer open |
| `/login`                | Staff sign-in page                                       |
| `/?apiError=true`       | Dashboard API error and recovery state                   |
| `/orders?apiError=true` | Order-list API error and recovery state                  |

The simulated error pages include **Restore data**, which removes the error flag and reloads the successful state.

## Project structure

```text
src/
├── app/                 # Providers, shell, configuration, and route registry
├── components/          # Shared UI and feedback components
├── features/
│   ├── dashboard/       # Dashboard data derivation, hooks, and views
│   └── orders/          # Order model, policy, API, hooks, and views
├── hooks/               # Shared application hooks
├── lib/                 # API, formatting, pagination, and URL utilities
├── mocks/               # MSW handlers and in-memory order data
└── pages/               # Route-level page components
```

End-to-end tests live under `e2e/`. Unit and API integration tests are colocated with their source modules.

## Production build and Docker

Create the static Vite build with:

```bash
bun run build
```

The output is written to `dist/`. A multi-stage Bun and Nginx image is also available:

```bash
docker compose up --build
```

Nginx is configured with SPA fallback routing so direct navigation to order detail URLs resolves to the React application.
