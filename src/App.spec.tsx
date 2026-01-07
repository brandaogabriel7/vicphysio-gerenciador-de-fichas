import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the App component with navigation', () => {
    render(<App />);

    expect(screen.getByText('VicPhysio')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
  });
});
