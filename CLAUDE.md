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

### Module structure (`src/modules/`)

| Module | Purpose |
|---|---|
| `collections/` | Collections UI — list, items, dialogs for create/edit/import/export |
| `tabs/` | Live tab viewer — reads from Chrome API, updates on tab events |
| `main/` | Shell — header, settings menu, dark mode, lang selector, changelogs |
| `common/` | Shared helpers, hooks, providers, and i18n locales |
| `shadcn/` | Radix UI / shadcn wrappers (treat as a local component library) |

### State (`src/store/`)

Redux Toolkit with two slices:
- `collections` — persisted to `localStorage` via `redux-persist`, synced across extension tabs via `redux-state-sync` (channel `channel:store`)
- `dragAndDrop` — ephemeral, not persisted

Access state exclusively through the co-located hooks: `useCollections()` and `useCollectionsActions()` from `@/store/collections`.

### Chrome API

All `chrome.*` calls are centralized in `src/modules/common/helpers/chrome.js`. In development (`NODE_ENV=development`), `getAllTabs()` returns hardcoded sample tabs instead of calling the real API — this is how the dev server runs without being loaded as an extension.

### Aliases & conventions

- `@/` resolves to `src/`
- `cn()` from `@/modules/common/helpers/utils` — always use for className merging
- `styled()` from the same file — wraps a component with a base Tailwind class, accepting className overrides
- `__APP_VERSION__` and `__CHANGELOGS__` are injected at build time from `package.json` and `changelogs.json`

### i18n

13 languages configured in `src/modules/common/helpers/i18next.js`. All user-facing strings must use `useTranslation()` with keys defined in each locale file under `src/modules/common/locales/`. The `en.json` file is the source of truth — add new keys there first.

### Adding a new locale string

1. Add the key to `src/modules/common/locales/en.json`
2. Add the same key to all other locale files
3. Use `const { t } = useTranslation()` and call `t('your.key')`
