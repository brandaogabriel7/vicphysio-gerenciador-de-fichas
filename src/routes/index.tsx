import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ClientesListPage } from '../pages/clientes/ClientesListPage';
import { ClienteCreatePage } from '../pages/clientes/ClienteCreatePage';
import { ClienteDetailPage } from '../pages/clientes/ClienteDetailPage';
import { ClienteEditPage } from '../pages/clientes/ClienteEditPage';

export const router = createBrowserRouter([
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
