// Feature: whatsapp-official-api-integration — SessionCard unit tests
// Validates: Requirements 8.1
import React from 'react';
import { render, screen } from '@testing-library/react';
import SessionCard from './SessionCard';

// Mock dependencies
jest.mock('@/lib/api', () => ({ get: jest.fn() }));
jest.mock('@/app/actions/deleteSessionById', () => ({
  deleteSessionById: jest.fn(),
}));
jest.mock('@/components/ui/Toast/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));
jest.mock('@/components/ui/Modal', () => ({
  Modal: ({ children, isOpen }: any) => isOpen ? <div>{children}</div> : null,
}));
jest.mock('@/components/ui/Badge', () => ({
  Badge: ({ children, variant }: any) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
}));

const baseSession = {
  sessionId: 'sess-001',
  phoneNumber: '5491112345678',
  isActive: true,
  isReady: true,
  createdAt: new Date().toISOString(),
};

describe('SessionCard — channelType badge', () => {
  it('shows "Oficial" badge for OFFICIAL sessions', () => {
    render(
      <SessionCard
        session={{ ...baseSession, channelType: 'OFFICIAL', phoneNumberId: 'pnid-123' }}
        onUpdate={jest.fn()}
      />,
    );

    const badges = screen.getAllByTestId('badge');
    const channelBadge = badges.find((b) => b.textContent === 'Oficial');
    expect(channelBadge).toBeDefined();
    expect(channelBadge?.getAttribute('data-variant')).toBe('info');
  });

  it('shows "No oficial" badge for UNOFFICIAL sessions', () => {
    render(
      <SessionCard
        session={{ ...baseSession, channelType: 'UNOFFICIAL' }}
        onUpdate={jest.fn()}
      />,
    );

    const badges = screen.getAllByTestId('badge');
    const channelBadge = badges.find((b) => b.textContent === 'No oficial');
    expect(channelBadge).toBeDefined();
    expect(channelBadge?.getAttribute('data-variant')).toBe('default');
  });

  it('shows "No oficial" badge when channelType is undefined (legacy)', () => {
    render(
      <SessionCard
        session={{ ...baseSession }}
        onUpdate={jest.fn()}
      />,
    );

    const badges = screen.getAllByTestId('badge');
    const channelBadge = badges.find((b) => b.textContent === 'No oficial');
    expect(channelBadge).toBeDefined();
  });

  it('shows phoneNumberId as ID for OFFICIAL sessions', () => {
    render(
      <SessionCard
        session={{ ...baseSession, channelType: 'OFFICIAL', phoneNumberId: 'pnid-999' }}
        onUpdate={jest.fn()}
      />,
    );
    expect(screen.getByText('ID: pnid-999')).toBeInTheDocument();
  });

  it('shows sessionId as ID for UNOFFICIAL sessions', () => {
    render(
      <SessionCard
        session={{ ...baseSession, channelType: 'UNOFFICIAL' }}
        onUpdate={jest.fn()}
      />,
    );
    expect(screen.getByText('ID: sess-001')).toBeInTheDocument();
  });

  it('shows "Conectado" status badge when isReady=true', () => {
    render(
      <SessionCard
        session={{ ...baseSession, channelType: 'OFFICIAL', phoneNumberId: 'pnid-1' }}
        onUpdate={jest.fn()}
      />,
    );
    const badges = screen.getAllByTestId('badge');
    const statusBadge = badges.find((b) => b.textContent === 'Conectado');
    expect(statusBadge).toBeDefined();
    expect(statusBadge?.getAttribute('data-variant')).toBe('success');
  });
});
