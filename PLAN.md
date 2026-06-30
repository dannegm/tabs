# Tabs. v2 — Plan de Modernización

## Context

La v1 funciona pero arrastra deuda técnica que dificulta añadir features nuevas: Redux con persistencia manual, cross-tab sync via BroadcastChannel casero, DnD nativo con bugs conocidos, una sola vista sin routing, y settings dispersos en localStorage.

El objetivo de v2 es reescribir la arquitectura interna sin cambiar el comportamiento visible para el usuario, añadiendo routing, async query patterns, y un sistema de temas más completo, manteniendo el modelo anónimo.

**Antes de iniciar el desarrollo, el usuario debe compartir:**
1. La nueva versión de `useSettings`
2. El patrón de queries/mutations de TanStack Query

---

## Fase 0 — Migración de datos (invisible al usuario)

**Problema:** Datos actuales en `localStorage['persist:root']` en formato redux-persist (doble-stringificado).

**Flujo:**
```
app startup
  ├─ chrome.storage.local.get('migration:v2') → si existe, skip
  ├─ localStorage.getItem('persist:root') → si no existe, marcar done y skip
  ├─ try:
  │   ├─ parse: JSON.parse(JSON.parse(raw).collections)
  │   ├─ validate estructura básica
  │   ├─ chrome.storage.local.set({ collections, 'migration:v2': true })
  │   └─ localStorage.removeItem('persist:root')
  └─ catch: chrome.storage.local.set({ 'migration:v2': true }) — start fresh silently
```

**Archivo nuevo:** `src/lib/migration.js`

---

## Fase 1 — Foundation (sin cambios visibles)

### 1.1 Redux → Zustand + chrome.storage.local

**Remover:** `redux`, `react-redux`, `@reduxjs/toolkit`, `redux-persist`, `redux-state-sync`

**Añadir:** `zustand`

- Middleware custom que persiste en `chrome.storage.local` (dev fallback: localStorage)
- Cross-tab sync via `chrome.storage.onChanged` — reemplaza `redux-state-sync`
- API de hooks compatible: `useCollections()` / `useCollectionsActions()` se mantienen

### 1.2 Native DnD → dnd-kit

**Añadir:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

**Remover:** `src/store/dragAndDrop.js`

**Arquitectura — único DndContext en `app.jsx`:**
```
DndContext (root — onDragStart/Over/End según active.data.current.type)
  SortableContext (collections)
    CollectionItem [useSortable — type: 'collection']
      SortableContext (cards)
        CardItem [useSortable — type: 'card', collectionId]
  TabItem [useDraggable — type: 'tab']  ← source, no sortable
```

**Bonus:** KeyboardSensor gratis → accesibilidad

### 1.3 useSettings (nueva versión del usuario)

Unificar `useLocalStorage` + `useSettings` + `useDarkMode` en el nuevo sistema.

### 1.4 Bug fixes y deuda técnica

| Fix | Archivo |
|---|---|
| `sortBy` muta array | `src/modules/common/helpers/arrays.js` |
| typo `expandAllColections` | `src/store/collections.js` |
| `handleAddCollection` duplicado en header + collections | mover nanoid al action creator |
| mock dev sin `windowId` (solo una ventana visible) | `src/modules/common/helpers/chrome.js` |
| `@tanstack/react-virtual` instalado pero sin uso | `package.json` |
| `SettingsMenu` con open state manual innecesario | `src/modules/main/components/settings-menu.jsx` |
| Error Boundaries ausentes | nuevo `src/modules/common/components/error-boundary.jsx` |
| `collection-item.jsx` (485 líneas) | split en `CollectionHeader` + `CollectionCardList` |

---

## Fase 2 — Routing + Async patterns

### 2.1 TanStack Router (hash mode)

**Añadir:** `@tanstack/react-router`

Rutas:
- `/` → vista principal (colecciones + tabs sidebar)
- `/settings` → nueva vista de configuración

```
src/routes/
  __root.jsx    → layout con header
  index.jsx     → contenido actual de app.jsx
  settings.jsx  → nueva vista
```

### 2.2 nuqs

**Añadir:** `nuqs` con adapter de TanStack Router

Usar selectivamente — en contexto de extensión cada nueva pestaña es URL fresca, así que el valor principal es preservar estado de búsqueda durante la sesión (ej: query de búsqueda en colecciones).

### 2.3 TanStack Query

**Añadir:** `@tanstack/react-query`

Esperar el patrón del usuario. Casos de uso identificados:
- Chrome tabs: `useQuery` (reemplaza `useEffect` manual en `tabs.jsx`) con refetch on window focus
- chrome.storage.local reads al init: `useQuery`
- Operaciones de write: `useMutation` con optimistic updates

---

## Fase 3 — Settings view + Sistema de temas

### 3.1 Vista `/settings`

Secciones:
- **Apariencia:** tema, color de acento, idioma, dirección RTL
- **Datos:** importar, exportar, limpiar colecciones
- **Acerca de:** migrar contenido de `AboutDialog`
- **Desarrollador:** debug mode

### 3.2 Sistema de temas extendido

Base actual (OKLCH vars en `index.css`) es sólida. Extender con presets:

```css
[data-theme="light-rose"]  { /* actual */ }
[data-theme="light-blue"]  { --primary: ...; }
[data-theme="dark-rose"]   { /* actual dark */ }
[data-theme="dark-blue"]   { --primary: ...; }
/* etc */
```

Aplicar via `data-theme` en el root en lugar de solo clase `dark`.

---

## Fase 4 — Radix UI → Base UI (shadcn migration)

> ⚠️ Esta fase va al final. Base UI + shadcn está en curso y la paridad no es completa aún.

Migrar componente a componente en `src/modules/shadcn/components/`.  
Verificar a11y, focus trap y keyboard navigation en cada uno antes de continuar.

---

## Archivos críticos

| Archivo | Cambio |
|---|---|
| `src/store/store.js` | Eliminar |
| `src/store/collections.js` | → Zustand |
| `src/store/dragAndDrop.js` | Eliminar |
| `src/app.jsx` | DndContext + router outlet |
| `src/modules/common/providers/store-provider.jsx` | Eliminar |
| `src/modules/common/hooks/use-settings.js` | Nueva versión del usuario |
| `src/modules/common/hooks/use-local-storage.js` | Unificar |
| `src/modules/common/helpers/chrome.js` | Fix dev mock windowId |
| `src/modules/common/helpers/arrays.js` | Fix sortBy |
| `src/modules/collections/components/collection-item.jsx` | dnd-kit + split |
| `src/modules/collections/components/card-item.jsx` | dnd-kit |
| `src/modules/tabs/components/tab-item.jsx` | dnd-kit |
| `src/index.css` | Theme presets |
| `package.json` | Add/remove deps |

**Nuevos:**
- `src/lib/migration.js`
- `src/lib/chrome-storage.js`
- `src/routes/__root.jsx`, `index.jsx`, `settings.jsx`
- `src/modules/settings/`
- `src/modules/common/components/error-boundary.jsx`

---

## Verificación por fase

1. **Migración:** v1 con datos → update → colecciones intactas, `migration:v2` en chrome.storage, sin `persist:root` en localStorage
2. **DnD:** tab→collection, card→otra collection, reordenar collections, reordenar cards, soltar fuera de target
3. **Cross-tab sync:** crear colección en tab A, aparece en tab B sin reload
4. **Routing:** navegar a /settings y volver, estado preservado
5. **Temas:** cambiar tema, abrir nueva pestaña, persiste
6. **Error boundary:** componente que tira error, resto de la app sigue
7. **Dev mode:** `yarn dev` muestra múltiples ventanas en el mock
