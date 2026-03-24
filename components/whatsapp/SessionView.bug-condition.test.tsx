/**
 * Bug Condition Exploration Test — SessionView
 *
 * Validates: Requirements 2.1, 2.2
 *
 * **Property 1: Bug Condition** — MetaOnboardingFlow visible con sesión OFFICIAL activa
 *
 * CRITICAL: This test MUST FAIL on unfixed code.
 * Failure confirms the bug exists: when activeSession has channelType === 'OFFICIAL'
 * and isReady: true, SessionView does NOT render MetaOnboardingFlow.
 *
 * When the fix is applied, this test WILL PASS, confirming the bug is resolved.
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

// ── Bug condition session fixture ─────────────────────────────────────────────

const officialActiveSession = {
  sessionId: '+549111234567',
  isReady: true,
  channelType: 'OFFICIAL',
  isActive: true,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SessionView — Bug Condition Exploration (Property 1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * BUG CONDITION TEST
   *
   * Given: activeSession with channelType === 'OFFICIAL' and isReady: true
   * Expected (correct behavior): MetaOnboardingFlow IS rendered
   * Actual (buggy behavior): MetaOnboardingFlow is NOT rendered
   *
   * This test FAILS on unfixed code → confirms the bug exists.
   * This test PASSES after the fix → confirms the bug is resolved.
   *
   * Counterexample: { sessionId: '+549111234567', isReady: true, channelType: 'OFFICIAL', isActive: true }
   */
  it('renders MetaOnboardingFlow ("Conectar con Meta") when activeSession has channelType OFFICIAL', async () => {
    // Arrange: mock getSessions to return an OFFICIAL active session (bug condition)
    mockGetSessions.mockResolvedValue([officialActiveSession]);

    // Act: render SessionView
    render(<SessionView />);

    // Assert: MetaOnboardingFlow should be visible (button "Conectar con Meta")
    // On UNFIXED code this assertion FAILS — MetaOnboardingFlow is hidden by the
    // `if (activeSession && !loading)` branch that returns early without rendering it.
    await waitFor(() => {
      expect(screen.getByText('Conectar con Meta')).toBeInTheDocument();
    });
  });
});
