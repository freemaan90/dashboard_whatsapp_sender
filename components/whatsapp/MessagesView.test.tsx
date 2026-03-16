// Feature: whatsapp-official-api-integration — MessagesView unit tests
// Validates: Requirements 8.4, 8.5, 8.6
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessagesView from './MessagesView';

// Mock server actions
jest.mock('@/app/actions/getSessions', () => ({
  getSessions: jest.fn(),
}));
jest.mock('@/app/actions/sendMessage', () => ({
  sendMessage: jest.fn(),
}));
jest.mock('@/app/actions/sendOfficialMessage', () => ({
  sendOfficialMessage: jest.fn(),
}));

// Mock child components
jest.mock('@/components/ui/Spinner/Spinner', () => ({
  default: ({ label }: any) => <div data-testid="spinner">{label}</div>,
}));
jest.mock('@/components/whatsapp/TemplatesPanel/TemplatesPanel', () => ({
  default: () => <div data-testid="templates-panel" />,
}));
jest.mock('@/components/whatsapp/BulkUpload/BulkUpload', () => ({
  BulkUpload: () => <div data-testid="bulk-upload" />,
}));
jest.mock('@/components/whatsapp/CSVBulkUpload/CSVBulkUpload', () => ({
  CSVBulkUpload: () => <div data-testid="csv-bulk-upload" />,
}));

import { getSessions } from '@/app/actions/getSessions';
const mockGetSessions = getSessions as jest.Mock;

const unofficialSession = {
  sessionId: 'sess-unofficial',
  phoneNumber: '5491112345678',
  channelType: 'UNOFFICIAL',
  isReady: true,
};

const officialSession = {
  id: 'sess-official-db',
  sessionId: null,
  phoneNumber: '5499887766',
  channelType: 'OFFICIAL',
  isReady: true,
};

describe('MessagesView — channel selector', () => {
  beforeEach(() => {
    mockGetSessions.mockResolvedValue([unofficialSession, officialSession]);
  });

  it('renders channel toggle buttons', async () => {
    render(<MessagesView />);
    expect(await screen.findByText('No oficial')).toBeInTheDocument();
    expect(await screen.findByText('Oficial (Meta)')).toBeInTheDocument();
  });

  it('defaults to UNOFFICIAL channel', async () => {
    render(<MessagesView />);
    await screen.findByText('No oficial');
    // TemplatesPanel only shows for unofficial
    expect(screen.getByTestId('templates-panel')).toBeInTheDocument();
  });

  it('shows unofficial session in dropdown when UNOFFICIAL selected', async () => {
    render(<MessagesView />);
    await screen.findByText('No oficial');
    expect(screen.getByText('5491112345678')).toBeInTheDocument();
  });

  it('switches to OFFICIAL channel when clicking Oficial button', async () => {
    render(<MessagesView />);
    await screen.findByText('Oficial (Meta)');

    fireEvent.click(screen.getByText('Oficial (Meta)'));

    await waitFor(() => {
      expect(screen.getByText('5499887766')).toBeInTheDocument();
    });
  });

  it('hides TemplatesPanel when OFFICIAL channel is selected', async () => {
    render(<MessagesView />);
    await screen.findByText('Oficial (Meta)');

    fireEvent.click(screen.getByText('Oficial (Meta)'));

    await waitFor(() => {
      expect(screen.queryByTestId('templates-panel')).not.toBeInTheDocument();
    });
  });

  it('shows warning when no session available for selected channel', async () => {
    mockGetSessions.mockResolvedValue([unofficialSession]); // no official session
    render(<MessagesView />);
    await screen.findByText('Oficial (Meta)');

    fireEvent.click(screen.getByText('Oficial (Meta)'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

describe('MessagesView — HSM template toggle', () => {
  beforeEach(() => {
    mockGetSessions.mockResolvedValue([officialSession]);
  });

  async function switchToOfficial() {
    render(<MessagesView />);
    await screen.findByText('Oficial (Meta)');
    fireEvent.click(screen.getByText('Oficial (Meta)'));
    await screen.findByText('5499887766');
  }

  it('HSM checkbox is not visible for UNOFFICIAL channel', async () => {
    mockGetSessions.mockResolvedValue([unofficialSession]);
    render(<MessagesView />);
    await screen.findByText('No oficial');
    expect(screen.queryByText('Enviar como template HSM')).not.toBeInTheDocument();
  });

  it('HSM checkbox appears when OFFICIAL channel is selected', async () => {
    await switchToOfficial();
    expect(screen.getByText('Enviar como template HSM')).toBeInTheDocument();
  });

  it('template fields appear when HSM checkbox is checked', async () => {
    await switchToOfficial();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre del template')).toBeInTheDocument();
      expect(screen.getByLabelText('Código de idioma')).toBeInTheDocument();
      expect(screen.getByLabelText('Template Components (JSON)')).toBeInTheDocument();
    });
  });

  it('template fields disappear when HSM checkbox is unchecked', async () => {
    await switchToOfficial();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox); // check
    fireEvent.click(checkbox); // uncheck

    await waitFor(() => {
      expect(screen.queryByLabelText('Nombre del template')).not.toBeInTheDocument();
    });
  });

  it('submit button shows "Enviar Template" when HSM mode is active', async () => {
    await switchToOfficial();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(screen.getByText('Enviar Template')).toBeInTheDocument();
    });
  });

  it('submit button shows "Enviar Mensaje" when HSM mode is inactive', async () => {
    await switchToOfficial();
    expect(screen.getByText('Enviar Mensaje')).toBeInTheDocument();
  });
});
