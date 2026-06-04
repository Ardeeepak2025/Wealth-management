# Wealth Management Workspace

This repository contains the Finova wealth-management application as a small multi-service workspace:

- `finova_vite`: React/Vite frontend for dashboards, stocks, mutual funds, real estate, profile, and admin screens.
- `main_server`: Express gateway that handles auth, JWT-protected proxying, audit logging, rate limiting, and real-estate routes.
- `M_F_server`: Mutual-fund API backed by Supabase.
- `Stocks_Server`: Stock/equity API backed by Supabase.

## Local Services

| Service | Folder | Default port | Notes |
| --- | --- | --- | --- |
| Frontend | `finova_vite` | Vite default, usually `5173` | Reads API URLs from `VITE_*` environment variables. |
| Gateway | `main_server` | `4000` | Proxies to the mutual-fund and stock services. |
| Mutual-fund API | `M_F_server` | `3000` in code | Set `PORT=3001` locally when running beside the stock API. |
| Stock API | `Stocks_Server` | `3000` | Exposes stock, user sync, and admin routes. |

## Setup Order

Run each command from the matching service folder.

```powershell
npm install
```

Create local `.env` files from the `.env.example` files and set service-specific secrets. The frontend expects:

```env
VITE_STOCK_API_URL=http://localhost:3000
VITE_MUTUAL_FUND_API_URL=http://localhost:3001
VITE_GATEWAY_API_URL=http://localhost:4000
```

Start the backend services before the frontend:

```powershell
# Stocks_Server
npm run dev

# M_F_server
npm run dev

# main_server
npm run dev

# finova_vite
npm run dev
```

## Folder Guide

### `finova_vite`

- `src/components`: Reusable UI grouped by domain.
- `src/components/admin`: Admin tables, analytics, add/delete forms.
- `src/components/auth`: Login, register, role selection, and auth wrappers.
- `src/components/common`: Shared UI primitives such as buttons, modals, tables, loaders, and empty states.
- `src/components/dashboard`: Dashboard cards, charts, widgets, and recent activity.
- `src/components/layout`: Sidebar, navbar, topbar, mobile navigation, and profile menu.
- `src/components/mutualfunds`: Mutual-fund cards, charts, holdings, buy/sell forms, and SIP calculator.
- `src/components/realestate`: Property, rental, valuation, and analytics components.
- `src/components/stocks`: Stock cards, charts, filters, holdings, buy/sell forms, and leaderboard views.
- `src/context`: React context providers for auth, theme, sidebar, stocks, mutual funds, and real estate.
- `src/hooks`: Feature hooks for auth, protected routes, debounce, sidebar, stocks, mutual funds, and real estate.
- `src/pages`: Route-level page components.
- `src/pages/admin`: Admin pages, split into `stocks` and `mutualfunds`.
- `src/pages/auth`: Login and registration pages.
- `src/pages/dashboard`: Main portfolio dashboard page.
- `src/pages/errors`: Not found and unauthorized pages.
- `src/pages/mutualfunds`: Mutual-fund user pages.
- `src/pages/profile`: Profile, settings, notifications, and password pages.
- `src/pages/realestate`: Real-estate user pages.
- `src/pages/stocks`: Stock user pages.
- `src/providers`: App-level provider composition.
- `src/routes`: Route definitions and route guards.
- `src/services`: Axios clients and API service modules.
- `src/types`: Shared TypeScript types.
- `src/utils`: Constants, route metadata, formatting, tokens, validation, role helpers, and chart helpers.

### `main_server`

- `src`: Gateway entry point, auth routes, proxy code, Redis/Supabase clients, and real-estate modules.
- `src/middleware`: JWT, HMAC helper, audit logging, request IDs, request logging, rate limiting, validation, and error handling.
- `logs`: Local audit log output.

### `M_F_server`

- `src`: Express app/server entry point and Supabase client.
- `src/controllers`: Request handlers for users, auth, mutual funds, holdings, transactions, summary, and admin actions.
- `src/middleware`: CORS, auth, request IDs, request logging, rate limiting, validation, and error handling.
- `src/models`: Supabase data-access modules.
- `src/routes`: API route definitions.

### `Stocks_Server`

- `Controller`: Request handlers for stock, admin, and user sync actions.
- `Database`: Supabase database initialization/client code.
- `Middleware`: Auth, CORS, request IDs, request logging, rate limiting, validation, and error handling.
- `Router`: Stock, admin, and user route definitions.
- `Stocks_Server`: Nested copy of the stock server entry/package files. It references folders that are present in the parent service, so prefer the parent `Stocks_Server` folder for development.

## Notes

- Both backend feature services default to port `3000`; use `PORT=3001` for `M_F_server` when running all services together.
- `main_server` issues JWTs after authenticating against `M_F_server` and syncs new users to `Stocks_Server`.
- Keep real secrets out of git. Use `.env` locally and `.env.example` for safe placeholders.
