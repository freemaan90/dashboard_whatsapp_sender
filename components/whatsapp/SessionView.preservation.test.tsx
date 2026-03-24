/**
 * Preservation Property Tests — SessionView
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 *
 * **Property 2: Preservation** — Comportamiento UNOFFICIAL y sin sesión no cambia
 *
 * IMPORTANT: These tests MUST PASS on UNFIXED code.
 * They encode the baseline behavior that the fix must NOT break.
 *
 * Observations on unfixed code:
 * - Con sesión UNOFFICIAL activa → muestra número de teléfono + botón "Cerrar Sesión"
 * - Sin sesión activa → muestra formulario con label "Número de Teléfono" + MetaOnboardingFlow
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SessionView from './SessionView';

// ── Mock server actions ──────────────────────────────────────────────────────

jest.mock('@/app/actions/getSessions', () => ({
  getSessions: jest.fn(),
}));

jest.mock('@/app/actions/createSessionById', () => ({
  createWhatsappSession: jest.fn(),
}));

jest.mock('@/app/actions/deleteSessionById', () => ({
  deleteSessionById: jest.fn(),
}));

// ── Mock MetaOnboardingFlow (renders a recognizable stub) ────────────────────

jest.mock('@/components/whatsapp/MetaOnboarding', () => ({
  MetaOnboardingFlow: ({ onCompleted }: { onCompleted?: () => void }) => (
    <div data-testid="meta-onboarding-flow">
      <button onClick={onCompleted}>Conectar con Meta</button>
    </div>
  ),
}));

// ── Mock UI sub-components ────────────────────────────────────────────────────

jest.mock('@/lib/api', () => ({
  default: { get: jest.fn() },
}));

jest.mock('@/components/ui/Spinner/Spinner', () => {
  const SpinnerMock = ({ label }: { label?: string }) => (
    <div data-testid="spinner">{label}</div>
  );
  SpinnerMock.displayName = 'Spinner';
  return { __esModule: true, default: SpinnerMock, Spinner: SpinnerMock };
});

// ── Import mocked getSessions ─────────────────────────────────────────────────

import { getSessions } from '@/app/actions/getSessions';
const mockGetSessions = getSessions as jest.Mock;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SessionView — Preservation Tests (Property 2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * PRESERVATION TEST 1: Sesión UNOFFICIAL activa
   *
   * Given: activeSession con channelType === 'UNOFFICIAL' e isReady: true
   * Expected (baseline): número de teléfono visible + botón "Cerrar Sesión" en el DOM
   *
   * This test PASSES on unfixed code → confirms the baseline to preserve.
   * This test MUST ALSO PASS after the fix → confirms no regression for UNOFFICIAL sessions.
   */
  it('muestra número de teléfono y botón "Cerrar Sesión" con sesión UNOFFICIAL activa', async () => {
    // Arrange: sesión UNOFFICIAL activa
    mockGetSessions.mockResolvedValue([
      {
        sessionId: '+549111234567',
        isReady: true,
        channelType: 'UNOFFICIAL',
        isActive: true,
      },
    ]);

    // Act
    render(<SessionView />);

    // Assert: número de teléfono visible
    await waitFor(() => {
      expect(screen.getByText('+549111234567')).toBeInTheDocument();
    });

    // Assert: botón "Cerrar Sesión" visible
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  /**
   * PRESERVATION TEST 2: Sin sesión activa
   *
   * Given: getSessions retorna []
   * Expected (baseline): formulario con label "Número de Teléfono" + MetaOnboardingFlow en el DOM
   *
   * This test PASSES on unfixed code → confirms the baseline to preserve.
   * This test MUST ALSO PASS after the fix → confirms no regression for no-session state.
   */
  it('muestra formulario de teléfono y MetaOnboardingFlow cuando no hay sesión activa', async () => {
    // Arrange: sin sesiones
    mockGetSessions.mockResolvedValue([]);

    // Act
    render(<SessionView />);

    // Assert: label del formulario visible
    await waitFor(() => {
      expect(screen.getByText('Número de Teléfono')).toBeInTheDocument();
    });

    // Assert: MetaOnboardingFlow visible ("Conectar con Meta")
    expect(screen.getByText('Conectar con Meta')).toBeInTheDocument();
  });
});
