import { screen } from '@testing-library/react';
import { renderWithRouter } from '../../test-utils';
import { MainLayout } from './MainLayout';

describe('MainLayout', () => {
  it('renders VicPhysio branding', () => {
    renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    expect(screen.getByText('VicPhysio')).toBeInTheDocument();
  });

  it('renders navigation link for Clientes', () => {
    renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    expect(screen.getByRole('link', { name: /clientes/i })).toBeInTheDocument();
  });

  it('renders children in main area', () => {
    renderWithRouter(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('has correct href for Clientes link', () => {
    renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    const clientesLink = screen.getByRole('link', { name: /clientes/i });
    expect(clientesLink).toHaveAttribute('href', '/clientes');
  });

  it('has correct href for VicPhysio branding link', () => {
    renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>
    );
    const brandingLink = screen.getByRole('link', { name: /vicphysio/i });
    expect(brandingLink).toHaveAttribute('href', '/');
  });

  it('marks Clientes link as current page when on clientes route', () => {
    renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
      { route: '/clientes' }
    );
    const clientesLink = screen.getByRole('link', { name: /clientes/i });
    expect(clientesLink).toHaveAttribute('aria-current', 'page');
  });

  it('does not mark Clientes link as current page when on different route', () => {
    renderWithRouter(
      <MainLayout>
        <div>Content</div>
      </MainLayout>,
      { route: '/' }
    );
    const clientesLink = screen.getByRole('link', { name: /clientes/i });
    expect(clientesLink).not.toHaveAttribute('aria-current');
  });
});
