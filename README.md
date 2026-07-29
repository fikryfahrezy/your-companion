# Your Companion

A responsive hotel operations dashboard for monitoring guest service requests, spotting SLA and payment issues, and moving orders through their lifecycle.

**Live deployment:** [your-companion.fahrezy.work](https://your-companion.fahrezy.work)

## AI assistance

This project was developed with AI assistance from OpenAI Codex using **GPT-5.6-Sol** with **high reasoning effort**.

## Features

- Operational dashboard showing guest, order, revenue, and service-demand metrics
- Search, filter, and sort orders by guest, room, status, service, or date
- Detailed order view with guest, request, payment, and lifecycle information
- Validated order workflow from `New` through `Completed`, including cancellation
- SLA monitoring for requests left unacknowledged for more than 15 minutes
- Extra Bed approval workflow with room-capacity context
- Simulated real-time order arrivals and dashboard notifications
- Mock staff authentication with protected dashboard access
- Responsive desktop and mobile layouts with light and dark themes

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

## Technical decisions

### Component structure

- The codebase is organized by product feature so authentication, dashboard, and
  order code can evolve independently.
- Each feature owns its domain types, business rules, API integration, hooks, and
  interface components.
- Route-level pages only compose feature modules.
- Code moves to the shared `components`, `hooks`, or `lib` directories only when
  multiple features need it.

### State management and data

- TanStack Query manages remote and asynchronous state, including the staff
  session, order queries, cache invalidation, and mutations.
- Transient interaction state stays local to the component that owns it.
- Search, filters, sorting, pagination, and the selected order are encoded in the
  URL so views are bookmarkable and survive navigation.
- A typed fetch wrapper provides a consistent API error contract.
- MSW implements the same REST boundary intended for a future backend.
- Order mutations update relevant caches optimistically, restore a snapshot on
  failure, reconcile successful responses, and invalidate affected queries.

### Loading and error handling

- Initial route and query loads render accessible skeleton states instead of an
  empty layout.
- Existing list data remains visible during background refetches; busy indicators
  and disabled pagination prevent conflicting actions.
- Query failures show the server-provided message and an explicit retry action.
  The documented error-demo URLs also provide **Restore data**.
- Server errors are retried up to two times, while client errors are not retried.
- Mutations never retry automatically because repeating a write may be unsafe.
- Failed optimistic updates restore the previous cache snapshot and display an
  error toast.
- Empty results and unknown order IDs have dedicated states.

### Assumptions

- The dashboard represents one Jakarta hotel and one staff role; multi-property
  access control is outside the take-home scope.
- Order timestamps are valid ISO dates. Hotel-day calculations use
  `Asia/Jakarta`, while amounts are total order values displayed in USD.
- An order breaches its SLA only while it remains `New` for more than 15 minutes.
- Payment status is supplied for operational visibility; payment collection and
  reconciliation happen outside this frontend.
- Authentication is a frontend demonstration, not a security boundary. The
  demo credentials are intentionally fixed.
- MSW is the source of truth during the demo. Order changes are held in memory
  and reset on a full reload, while theme and authentication state use local
  storage.
- The mock API validates lifecycle transitions to approximate server behavior,
  but a production server must enforce authorization and business rules.

### With another day

1. Replace mock authentication and MSW storage with an authenticated backend and
   persistent database, including server-owned authorization, lifecycle
   validation, and audit history.
2. Replace the incoming-order timer with an SSE or WebSocket channel and define
   reconnection, deduplication, and conflict behavior for concurrent staff.
3. Run a focused accessibility and cross-browser pass, then extend Playwright
   coverage across mobile navigation, keyboard-only workflows, and degraded
   network conditions.

## Prerequisites

- [Bun](https://bun.com/) 1.3.14 or newer

No separate Node.js installation is required.

Sign in with the demo staff account:

- Email: `manager@cmpnion.test`
- Password: `companion123`

Authentication is intentionally frontend-only for now. A production implementation must validate sessions and authorize order APIs on a trusted server.

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

| URL                     | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `/`                     | Operations overview                                        |
| `/orders`               | Searchable and filterable order management                 |
| `/orders/:orderId`      | Order list with the requested order's detail drawer open   |
| `/login`                | Staff sign-in page                                         |
| `/?apiError=true`       | Test-only flag for the dashboard API error/recovery state  |
| `/orders?apiError=true` | Test-only flag for the order-list API error/recovery state |

`apiError` is a test-only query flag that simulates an API failure; it does not indicate a real API error. The simulated error pages include **Restore data**, which removes the flag and reloads the successful state.

## Project structure

```text
.
├── e2e/                         # Playwright tests grouped by product area
│   ├── auth/                    # Protected-route and sign-in journeys
│   ├── dashboard/               # Dashboard, recovery, and real-time journeys
│   └── orders/                  # Order lifecycle and management journeys
├── public/                      # Files copied directly into the production build
│   ├── favicon.svg
│   └── mockServiceWorker.js     # Browser worker generated for MSW
├── src/
│   ├── app/                     # Application-wide composition and configuration
│   │   ├── app-config.ts        # Brand, navigation, and SLA configuration
│   │   ├── app-shell.tsx        # Shared authenticated page layout
│   │   ├── providers.tsx        # Query, auth, tooltip, and toast providers
│   │   ├── query-client.ts      # TanStack Query defaults
│   │   └── route-registry.ts    # Routes, navigation metadata, and page titles
│   ├── components/              # Reusable, domain-independent components
│   │   ├── feedback/            # Loading, error, empty, and toast feedback
│   │   ├── navigation/          # Shared pagination controls
│   │   └── ui/                  # Base UI/shadcn-style design primitives
│   ├── features/                # Product domains with their own vertical slices
│   │   ├── auth/                # Session API, auth context, model, and route guard
│   │   ├── dashboard/           # Metrics derivation, dashboard hook, and widgets
│   │   └── orders/              # Order API, cache, policy, model, hooks, and views
│   │       ├── api/             # Requests, query keys, query options, and cache updates
│   │       ├── components/      # Order-specific interface components
│   │       ├── config/          # Lifecycle and approval business rules
│   │       ├── hooks/           # Page orchestration and incoming-order simulation
│   │       ├── lib/             # Order-specific utility functions
│   │       ├── model/           # Order domain types
│   │       └── routes/          # Order paths and route registration
│   ├── hooks/                   # Cross-feature React hooks
│   ├── lib/                     # Cross-feature API, analytics, formatting, and URL utilities
│   ├── mocks/                   # MSW bootstrap, request handlers, and seeded data
│   │   ├── data/                # In-memory order fixtures
│   │   └── handlers/            # Mock REST endpoint implementations
│   ├── pages/                   # Thin route-level feature composition
│   ├── types/                   # Shared application TypeScript types
│   ├── index.css                # Tailwind setup, tokens, themes, and global styles
│   ├── index.tsx                # Browser entry point and mock API startup
│   └── root.tsx                 # Router and top-level route boundaries
├── test/
│   └── setup.ts                 # Shared Happy DOM and Testing Library setup
├── Dockerfile                    # Multi-stage Bun build and Nginx runtime image
├── compose.yaml                 # Local container orchestration
├── nginx.conf                   # Static hosting and SPA fallback configuration
├── playwright.config.ts         # End-to-end browser and development-server setup
├── vite.config.ts               # Vite, Tailwind, aliases, and React Compiler setup
├── tsconfig.json                # TypeScript options and `~/` source alias
├── package.json                 # Dependencies and development commands
└── bunfig.toml                  # Bun test preload configuration
```

The source code follows a feature-first architecture. A feature owns its domain
types, business rules, API integration, cache behavior, hooks, and UI. Code moves
to the top-level `components`, `hooks`, or `lib` directories only when it is
genuinely shared across features. Route-level files under `pages` remain small:
they compose feature components instead of containing domain logic.

Unit, component, and API integration tests use the `*.test.ts` or `*.test.tsx`
naming convention and are colocated with the module they verify. Cross-page user
journeys use `*.e2e.ts` files under `e2e/`.

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
