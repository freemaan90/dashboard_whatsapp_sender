// Feature: whatsapp-official-api-integration, Property 16: Official session form validation
// Validates: Requirements 8.3
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import OfficialSessionForm from './OfficialSessionForm';

jest.mock('@/app/actions/createOfficialSession', () => ({
  createOfficialSession: jest.fn().mockResolvedValue({ success: true }),
}));
jest.mock('@/components/ui/Toast/ToastContext', () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));
jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, type, disabled, loading, onClick }: any) => (
    <button type={type} disabled={disabled || loading} onClick={onClick}>
      {children}
    </button>
  ),
}));
jest.mock('@/components/ui/Input', () => ({
  Input: ({ id, label, value, onChange, errorMessage, type }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type ?? 'text'}
        value={value}
        onChange={onChange}
        aria-describedby={errorMessage ? `${id}-error` : undefined}
      />
      {errorMessage && <span id={`${id}-error`} role="alert">{errorMessage}</span>}
    </div>
  ),
}));

function fillForm(overrides: Partial<Record<string, string>> = {}) {
  const defaults = {
    phoneNumber: '5491112345678',
    phoneNumberId: '123456789012345',
    wabaId: '987654321098765',
    accessToken: 'EAAxxxxxxxxxxxxxxxxxxxxxxxx',
  };
  const values = { ...defaults, ...overrides };

  fireEvent.change(screen.getByLabelText('Número de Teléfono'), {
    target: { value: values.phoneNumber },
  });
  fireEvent.change(screen.getByLabelText('Phone Number ID'), {
    target: { value: values.phoneNumberId },
  });
  fireEvent.change(screen.getByLabelText('WABA ID'), {
    target: { value: values.wabaId },
  });
  fireEvent.change(screen.getByLabelText('Access Token'), {
    target: { value: values.accessToken },
  });
}

describe('OfficialSessionForm — validation', () => {
  it('shows errors when submitting empty form', async () => {
    render(<OfficialSessionForm />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it('does not show errors with valid data', async () => {
    render(<OfficialSessionForm />);
    fillForm();
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('shows error for non-numeric phoneNumberId', async () => {
    render(<OfficialSessionForm />);
    fillForm({ phoneNumberId: 'abc123' });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Solo dígitos')).toBeInTheDocument();
    });
  });

  it('shows error for non-numeric wabaId', async () => {
    render(<OfficialSessionForm />);
    fillForm({ wabaId: 'not-a-number' });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Solo dígitos')).toBeInTheDocument();
    });
  });

  it('shows error for accessToken shorter than 20 chars', async () => {
    render(<OfficialSessionForm />);
    fillForm({ accessToken: 'short' });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('Mínimo 20 caracteres')).toBeInTheDocument();
    });
  });

  it('shows error for invalid phone number format', async () => {
    render(<OfficialSessionForm />);
    fillForm({ phoneNumber: '123' }); // too short
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/Formato inválido/)).toBeInTheDocument();
    });
  });

  // Property 16: Official session form validation
  it('Property 16 — non-numeric phoneNumberId always triggers error', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => /[^0-9]/.test(s)),
        (phoneNumberId) => {
          const { unmount } = render(<OfficialSessionForm />);
          fillForm({ phoneNumberId });
          fireEvent.click(screen.getByRole('button'));
          // Validation is synchronous — errors appear immediately
          const alerts = screen.queryAllByRole('alert');
          unmount();
          return alerts.length > 0;
        },
      ),
    );
  });

  it('Property 16 — accessToken < 20 chars always triggers error', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 19 }),
        (accessToken) => {
          const { unmount } = render(<OfficialSessionForm />);
          fillForm({ accessToken });
          fireEvent.click(screen.getByRole('button'));
          const alerts = screen.queryAllByRole('alert');
          unmount();
          return alerts.length > 0;
        },
      ),
    );
  });
});
