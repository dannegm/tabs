# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Chrome/Edge browser extension (Manifest V3) that replaces the new tab page with a tab manager. Built with React + Vite using `@crxjs/vite-plugin`.

## Commands

```sh
yarn dev      # dev server (browser preview, not loaded as extension)
yarn build    # production build → dist/
yarn lint     # ESLint
```

To install as an extension: build, then load the `dist/` folder as an unpacked extension at `chrome://extensions/` with Developer Mode on.

There is no test suite.

## Architecture

The app renders as a two-column layout:
- **Left pane (`Main`)** — saved tab collections + header/settings/changelogs
- **Right pane (`Tabs`)** — live Chrome tabs grouped by window

### Project structure (`src/`)

| Folder | Purpose |
|---|---|
| `components/layout/` | App shell — Main, Header, Settings, Changelogs, Debugger |
| `components/tabs/` | Live tab viewer — Tabs, TabsGroup, TabItem |
| `components/collections/` | Collections UI — list, cards, dialogs for create/edit/import/export |
| `components/system/` | Generic shared components — Loader, Zelda, ErrorBoundary, ConfirmDialog |
| `ui/` | Primitive UI components — shadcn/Radix wrappers (Button, Input, Dialog, etc.) |
| `providers/` | React context providers — BusProvider, DndProvider, Providers |
| `services/` | Data services — collections store, settings, chrome-storage middleware, migration |
| `helpers/` | Pure utility functions and i18n config |
| `locales/` | i18n translation files (one JSON per language) |
| `hooks/` | Shared React hooks — useDarkMode, useSettings, useDocumentTitle, useDelayedState |
| `routes/` | TanStack Router routes — `__root.jsx`, `index.jsx`, `settings.jsx` |
| `queries/` | TanStack Query factory functions — one file per domain (e.g. `chrome.js`) |
| `constants/` | Static config — defaultSettings |

### State (`src/store/`)

Zustand v5 with a single `collections` slice persisted via a custom `chromeStorage` middleware (`src/lib/chrome-storage.js`):
- **Dev**: uses `localStorage` + `BroadcastChannel('collections')` for cross-tab sync
- **Prod**: uses `chrome.storage.local` + `chrome.storage.onChanged` for cross-tab sync

Access state exclusively through the co-located hooks: `useCollections()` and `useCollectionsActions()` from `@/store/collections`. Always wrap object selectors with `useShallow` (Zustand v5 requirement).

### Routing (`src/router.js` + `src/routes/`)

TanStack Router with hash history (`createHashHistory`) — required for Chrome extensions. Routes:
- `/` → main two-column layout (collections + tabs)
- `/settings` → settings view (Phase 4)

nuqs (`nuqs/adapters/tanstack-router`) is mounted in `__root.jsx` for URL search-param state. Use `useQueryState` from `nuqs` for any search/filter state that should survive navigation.

### Async data (`src/queries/`)

TanStack Query (`@tanstack/react-query`) with factory pattern:
```js
export const myQuery = (opts = {}) => ({
    queryKey: ['domain', 'key'],
    queryFn: async () => { ... },
    ...opts,
})
```
Use `useQuery(myQuery())` at call sites. Chrome tab events trigger `queryClient.invalidateQueries` instead of local state updates.

### Providers (`src/providers/`)

Providers are composed in `providers.jsx` and consumed in `App.jsx` as `<Providers>`:

| Provider | File | Purpose |
|---|---|---|
| `BusProvider` | `bus-provider.jsx` | App-wide event bus (pub/sub) |
| `DndProvider` | `dnd-provider.jsx` | dnd-kit context + all drag-end logic |

`App.jsx` is a pure layout shell — no business logic.

### Event bus (`BusProvider`)

Use `useEvents()`, `useListener(event, handler)`, and `useEmitter(event, ...args)` from `bus-provider.jsx` to decouple cross-module communication. DnD is the primary use case: `DndProvider` emits events; listeners live in the modules that own the affected state.

| Event | Payload | Listener |
|---|---|---|
| `collections:sort` | `{ items: id[] }` | `collections.jsx` |
| `items:sort` | `{ collectionId, items: id[] }` | `collections.jsx` |
| `items:move` | `{ id, from, to, index? }` | `collections.jsx` |
| `tab:save` | `{ collectionId, id, payload }` | `collections.jsx` |

### Drag and drop (`DndProvider`)

Uses `@dnd-kit/core` + `@dnd-kit/sortable`. A single `DndContext` at the provider level handles all 5 DnD scenarios via `handleDragEnd`. Draggable types are identified by `data.current.type`: `'collection'`, `'card'`, `'tab'`. `DndProvider` reads collections state (read-only) to compute indices, then emits bus events — it does not call store actions directly.

### Settings (`src/services/settings.js`)

Path-based settings service backed by `localStorage` with `BroadcastChannel` for cross-tab sync. Use `useSettings(path, defaultValue)` from `src/modules/common/hooks/use-settings.js`. Default values live in `src/constants/default-settings.js`.

```js
const [theme, setTheme] = useSettings('theme', null);
const [debug, setDebug] = useSettings('debug', false);
```

### Chrome API

All `chrome.*` calls are centralized in `src/modules/common/helpers/chrome.js`. In development (`NODE_ENV=development`), `getAllTabs()` returns hardcoded sample tabs instead of calling the real API — this is how the dev server runs without being loaded as an extension. All chrome calls use optional chaining (`chrome?.tabs?.query?.()`) so they fail silently in dev.

### Data migration

`src/lib/migration.js` runs once on startup (prod only) to migrate collections from the old `persist:root` redux-persist format in `localStorage` to `chrome.storage.local`.

### Aliases & conventions

- `@/` resolves to `src/`
- `cn()` from `@/modules/common/helpers/utils` — always use for className merging
- `styled()` from the same file — wraps a component with a base Tailwind class, accepting className overrides
- `__APP_VERSION__` and `__CHANGELOGS__` are injected at build time from `package.json` and `changelogs.json`

### i18n

13 languages configured in `src/helpers/i18next.js`. All user-facing strings must use `useTranslation()` with keys defined in each locale file under `src/locales/`. The `en.json` file is the source of truth — add new keys there first.

### Adding a new locale string

1. Add the key to `src/locales/en.json`
2. Add the same key to all other locale files
3. Use `const { t } = useTranslation()` and call `t('your.key')`
