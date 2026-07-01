import { createRouter, createHashHistory, createRootRoute, createRoute, Navigate, Outlet } from '@tanstack/react-router';

import { HomePage } from '@/pages/home';
import { SettingsPage } from '@/pages/settings';

const rootRoute = createRootRoute({
    component: () => <Outlet />,
    notFoundComponent: () => <Navigate to='/' />,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
});

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: SettingsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute]);

export const router = createRouter({
    routeTree,
    history: createHashHistory(),
});
