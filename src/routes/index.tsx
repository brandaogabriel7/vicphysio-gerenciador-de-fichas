import { createBrowserRouter, createHashRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ClientesListPage } from '../pages/clientes/ClientesListPage';
import { ClienteCreatePage } from '../pages/clientes/ClienteCreatePage';
import { ClienteDetailPage } from '../pages/clientes/ClienteDetailPage';
import { ClienteEditPage } from '../pages/clientes/ClienteEditPage';

// Use HashRouter for Electron (file:// protocol doesn't work with BrowserRouter)
const createRouter = import.meta.env.VITE_BUILD_TARGET === 'electron'
  ? createHashRouter
  : createBrowserRouter;

export const router = createRouter([
  {
    path: '/',
    element: <MainLayout><Navigate to="/clientes" replace /></MainLayout>,
  },
  {
    path: '/clientes',
    element: <MainLayout><ClientesListPage /></MainLayout>,
  },
  {
    path: '/clientes/novo',
    element: <MainLayout><ClienteCreatePage /></MainLayout>,
  },
  {
    path: '/clientes/:id',
    element: <MainLayout><ClienteDetailPage /></MainLayout>,
  },
  {
    path: '/clientes/:id/editar',
    element: <MainLayout><ClienteEditPage /></MainLayout>,
  },
]);
