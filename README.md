# HomeVision houses explorer

Take-home UI: infinite-scrolling house listings from the HomeVision staging API, with resilient error handling, client-side search and filters, favorites (local storage), and a responsive detail view.

## Live demo

[https://home-vision-th.onrender.com/](https://home-vision-th.onrender.com/)

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query) (`useInfiniteQuery` for pagination)
- Feature-based folders under `src/features`, shared UI under `src/shared`

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

## Run locally

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Build & preview (production bundle)

```bash
pnpm build
pnpm preview
```

`pnpm build` runs TypeScript checking then Vite’s production build.

## Environment

Copy `.env.example` to `.env` if you need to override the API base in **production** builds:

- `VITE_API_BASE_URL` — full base including `/api_project`, no trailing slash (e.g. `https://staging.homevision.co/api_project`).

**Development:** requests go to `/api/...` and Vite proxies to `https://staging.homevision.co/api_project/...` (see `vite.config.ts`) so the browser avoids cross-origin issues.

## API behavior

The staging endpoint is intentionally flaky. The app handles this in three layers:

- **Automatic retries:** TanStack Query retries failed requests with exponential backoff.
- **Graceful UI fallbacks:** feed-level error states render actionable alerts instead of breaking the page.
- **User recovery actions:** users can trigger **Refetch** / **Try again** directly from the UI when transient failures occur.

## Scripts

| Command        | Description                |
| -------------- | -------------------------- |
| `pnpm dev`     | Start dev server + HMR     |
| `pnpm build`   | Typecheck + production build |
| `pnpm preview` | Serve the `dist` folder    |
| `pnpm lint`    | ESLint                     |
