import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router';
import { Footer } from '../Footer';

describe('Footer Component', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should display copyright information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(/Zestio/i)).toBeInTheDocument();
  });

  it('should have proper footer structure', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should display quick links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('should display contact information', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('support@zestio.com')).toBeInTheDocument();
  });

  it('should display social media links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });
});
