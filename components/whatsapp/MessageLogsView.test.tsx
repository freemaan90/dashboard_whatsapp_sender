// Feature: whatsapp-official-api-integration — MessageLogsView unit tests
// Validates: Requirements 8.7
import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageLogsView from './MessageLogsView';

jest.mock('@/app/actions/getMessageLogs', () => ({
  getMessageLogs: jest.fn(),
}));
jest.mock('@/app/actions/getFailedMessageLogs', () => ({
  getFailedMessageLogs: jest.fn(),
}));
jest.mock('@/components/ui/Spinner/Spinner', () => ({
  default: () => <div data-testid="spinner" />,
}));

import { getMessageLogs } from '@/app/actions/getMessageLogs';
import { getFailedMessageLogs } from '@/app/actions/getFailedMessageLogs';

const mockGetMessageLogs = getMessageLogs as jest.Mock;
const mockGetFailedMessageLogs = getFailedMessageLogs as jest.Mock;

const sentOfficial = {
  id: '1',
  phone: '5491112345678',
  messageText: 'Hola oficial',
  sentAt: new Date().toISOString(),
  channelType: 'OFFICIAL' as const,
};

const sentUnofficial = {
  id: '2',
  phone: '5499887766',
  messageText: 'Hola no oficial',
  sentAt: new Date().toISOString(),
  channelType: 'UNOFFICIAL' as const,
};

const failedOfficial = {
  id: '3',
  phone: '5491112345678',
  messageText: 'Fallo oficial',
  failureReason: 'Meta error',
  failedAt: new Date().toISOString(),
  channelType: 'OFFICIAL' as const,
};

describe('MessageLogsView — channelType column', () => {
  beforeEach(() => {
    mockGetMessageLogs.mockResolvedValue([sentOfficial, sentUnofficial]);
    mockGetFailedMessageLogs.mockResolvedValue([failedOfficial]);
  });

  it('shows "Oficial" badge for OFFICIAL sent messages', async () => {
    render(<MessageLogsView />);
    const badges = await screen.findAllByText('Oficial');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "No oficial" badge for UNOFFICIAL sent messages', async () => {
    render(<MessageLogsView />);
    const badges = await screen.findAllByText('No oficial');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "Oficial" badge for OFFICIAL failed messages', async () => {
    render(<MessageLogsView />);
    // Wait for all badges to render
    const badges = await screen.findAllByText('Oficial');
    // One from sent, one from failed
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });

  it('shows message text for sent messages', async () => {
    render(<MessageLogsView />);
    expect(await screen.findByText('Hola oficial')).toBeInTheDocument();
    expect(await screen.findByText('Hola no oficial')).toBeInTheDocument();
  });

  it('shows failure reason for failed messages', async () => {
    render(<MessageLogsView />);
    expect(await screen.findByText('Meta error')).toBeInTheDocument();
  });

  it('shows empty state when no sent messages', async () => {
    mockGetMessageLogs.mockResolvedValue([]);
    mockGetFailedMessageLogs.mockResolvedValue([]);
    render(<MessageLogsView />);
    expect(await screen.findByText('No hay mensajes enviados aún')).toBeInTheDocument();
  });
});
