/**
 * Bug Condition Exploration Test — Task 1
 * Preservation Property Tests — Task 2
 *
 * Validates: Requirements 1.1, 1.3 (Task 1)
 *            Requirements 3.1, 3.2, 3.4 (Task 2)
 *
 * EXPECTED OUTCOME (Task 1): This test FAILS on unfixed code.
 * Failure confirms the bug: sendMessage receives the raw template "hola {{nombre}}"
 * instead of the interpolated message "hola Juan".
 *
 * EXPECTED OUTCOME (Task 2): These tests PASS on unfixed code.
 * They establish the baseline behavior that must be preserved after the fix.
 *
 * isBugCondition: extractTemplateFields(message).length > 0 AND row.fields["nombre"] IS NOT EMPTY
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import { BulkUpload } from './BulkUpload';

// Mock sendMessage
jest.mock('@/app/actions/sendMessage', () => ({
  sendMessage: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock parseExcelPhones to return a row with telefono + nombre
jest.mock('@/lib/parseExcelPhones', () => ({
  ...jest.requireActual('@/lib/parseExcelPhones'),
  parseExcelPhones: jest.fn().mockResolvedValue({
    headers: ['telefono', 'nombre'],
    hasHeaders: true,
    rows: [
      {
        rowIndex: 2,
        fields: { telefono: '1122334455', nombre: 'Juan' },
      },
    ],
  }),
}));

// Mock normalizeArgPhone to return the phone as-is (it's already normalized)
jest.mock('@/lib/validatePhone', () => ({
  normalizeArgPhone: jest.fn((val: string) => val || null),
}));

import { sendMessage } from '@/app/actions/sendMessage';

describe('BulkUpload — Bug Condition Exploration (Task 1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call sendMessage with interpolated message "hola Juan" instead of raw template "hola {{nombre}}"', async () => {
    /**
     * Bug Condition: message has {{nombre}} placeholder AND row.fields["nombre"] = "Juan" (not empty)
     * Expected (correct): sendMessage receives "hola Juan"
     * Actual (buggy):     sendMessage receives "hola {{nombre}}"
     *
     * This test MUST FAIL on unfixed code — failure confirms the bug exists.
     */

    let triggerSend: (() => void) | undefined;

    const { unmount } = render(
      <BulkUpload
        onPhonesLoaded={() => {}}
        sessionId="test-session"
        message="hola {{nombre}}"
        registerSend={(fn) => { triggerSend = fn; }}
      />
    );

    // Simulate processFile by dropping a fake xlsx file
    const fakeFile = new File([''], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Trigger file processing via the drop zone
    const { parseExcelPhones } = await import('@/lib/parseExcelPhones');

    // We need to trigger processFile — simulate it by calling the internal logic
    // by dispatching a change event on the hidden file input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).not.toBeNull();

    await act(async () => {
      Object.defineProperty(input, 'files', {
        value: [fakeFile],
        configurable: true,
      });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait for processFile to complete (parseExcelPhones is async)
    await act(async () => {
      await Promise.resolve();
    });

    // Now trigger handleBulkSend
    expect(triggerSend).toBeDefined();
    await act(async () => {
      await triggerSend!();
    });

    // Assert: sendMessage should have been called with the INTERPOLATED message
    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith(
      'test-session',
      '1122334455',
      'hola Juan'  // Expected interpolated value — FAILS on buggy code (receives "hola {{nombre}}")
    );
  });
});

// ---------------------------------------------------------------------------
// Task 2 — Preservation Property Tests (BEFORE implementing fix)
//
// Validates: Requirements 3.1, 3.2, 3.4
//
// EXPECTED OUTCOME: ALL tests in this describe block MUST PASS on unfixed code.
// They establish the baseline behavior that must be preserved after the fix.
// ---------------------------------------------------------------------------

import { interpolateMessage, extractTemplateFields } from '@/lib/parseExcelPhones';
import { parseExcelPhones as parseExcelPhonesMock } from '@/lib/parseExcelPhones';

describe('BulkUpload — Preservation Property Tests (Task 2)', () => {
  // -------------------------------------------------------------------------
  // Property 1: Plain message preservation
  //
  // For any message where extractTemplateFields(message).length === 0
  // (no {{...}} tokens), interpolateMessage(message, anyFields) === message.
  //
  // Validates: Requirements 3.1
  // -------------------------------------------------------------------------
  describe('Property 2: Plain message preservation — interpolateMessage leaves plain text unchanged', () => {
    /**
     * Validates: Requirements 3.1
     *
     * For any message without {{...}} placeholders,
     * interpolateMessage(message, fields) must return the exact same string.
     */

    const plainMessages = [
      'hola mundo',
      'tu turno está confirmado',
      'Recordatorio: cita mañana a las 10:00',
      '',
      '   ',
      'Mensaje con números: 12345',
      'Mensaje con símbolos: !@#$%^&*()',
      'Mensaje con saltos\nde línea',
      'Mensaje con "comillas" y \'apóstrofes\'',
      'Mensaje con emojis 🎉🚀',
      'Mensaje con URL: https://example.com/path?q=1',
      'Solo { una llave } sin dobles',
      'Llave simple {campo} sin dobles',
    ];

    const fieldSets = [
      {},
      { nombre: 'Juan' },
      { nombre: 'Juan', apellido: 'Pérez' },
      { nombre: 'Ana', ciudad: 'Buenos Aires', turno: '10:00' },
    ];

    test.each(plainMessages)(
      'message "%s" has no template fields',
      (msg) => {
        expect(extractTemplateFields(msg)).toHaveLength(0);
      }
    );

    test.each(
      plainMessages.flatMap((msg) =>
        fieldSets.map((fields) => ({ msg, fields }))
      )
    )(
      'interpolateMessage("$msg", fields) === "$msg" (plain message unchanged)',
      ({ msg, fields }) => {
        expect(interpolateMessage(msg, fields)).toBe(msg);
      }
    );
  });

  // -------------------------------------------------------------------------
  // Property 2: Legacy mode — Excel without headers sends message unchanged
  //
  // When the Excel has no "telefono" header (legacy mode, only phone column),
  // sendMessage receives the message exactly as provided.
  //
  // Validates: Requirements 3.2
  // -------------------------------------------------------------------------
  describe('Legacy mode — Excel without headers sends message unchanged', () => {
    /**
     * Validates: Requirements 3.2
     *
     * Excel in legacy mode (no headers, only phone column) → sendMessage
     * receives the message string without any modification.
     */

    beforeEach(() => {
      jest.clearAllMocks();
      // Override parseExcelPhones mock for legacy mode
      (parseExcelPhonesMock as jest.Mock).mockResolvedValue({
        headers: ['telefono'],
        hasHeaders: false,
        rows: [
          { rowIndex: 1, fields: { telefono: '1122334455' } },
          { rowIndex: 2, fields: { telefono: '2233445566' } },
        ],
      });
    });

    it('sends the plain message unchanged in legacy mode (no headers)', async () => {
      const { sendMessage: mockSendMessage } = await import('@/app/actions/sendMessage');
      const plainMessage = 'Recordatorio: tu turno está confirmado';

      let triggerSend: (() => void) | undefined;

      render(
        <BulkUpload
          onPhonesLoaded={() => {}}
          sessionId="test-session"
          message={plainMessage}
          registerSend={(fn) => { triggerSend = fn; }}
        />
      );

      const fakeFile = new File([''], 'legacy.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        Object.defineProperty(input, 'files', { value: [fakeFile], configurable: true });
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await act(async () => { await Promise.resolve(); });

      expect(triggerSend).toBeDefined();
      await act(async () => { await triggerSend!(); });

      expect(mockSendMessage).toHaveBeenCalledTimes(2);
      expect(mockSendMessage).toHaveBeenNthCalledWith(1, 'test-session', '1122334455', plainMessage);
      expect(mockSendMessage).toHaveBeenNthCalledWith(2, 'test-session', '2233445566', plainMessage);
    });

    it('sends a message with special characters unchanged in legacy mode', async () => {
      const { sendMessage: mockSendMessage } = await import('@/app/actions/sendMessage');
      const specialMessage = 'Hola! Tu cita es mañana a las 10:00 hs. 🎉';

      let triggerSend: (() => void) | undefined;

      render(
        <BulkUpload
          onPhonesLoaded={() => {}}
          sessionId="test-session"
          message={specialMessage}
          registerSend={(fn) => { triggerSend = fn; }}
        />
      );

      const fakeFile = new File([''], 'legacy2.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        Object.defineProperty(input, 'files', { value: [fakeFile], configurable: true });
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await act(async () => { await Promise.resolve(); });

      expect(triggerSend).toBeDefined();
      await act(async () => { await triggerSend!(); });

      expect(mockSendMessage).toHaveBeenCalledTimes(2);
      // Every call must receive the exact same message string
      (mockSendMessage as jest.Mock).mock.calls.forEach((call: unknown[]) => {
        expect(call[2]).toBe(specialMessage);
      });
    });
  });

  // -------------------------------------------------------------------------
  // Property 3: Invalid phones excluded
  //
  // When the Excel contains some invalid phone numbers, only valid phones
  // are sent; invalid ones are excluded and counted.
  //
  // Validates: Requirements 3.4
  // -------------------------------------------------------------------------
  describe('Invalid phones excluded — only valid phones are sent', () => {
    /**
     * Validates: Requirements 3.4
     *
     * Excel with a mix of valid and invalid phone numbers:
     * - Valid phones → sendMessage is called for each
     * - Invalid phones → excluded from sending, counted as invalid
     */

    beforeEach(() => {
      jest.clearAllMocks();
      // Override parseExcelPhones mock: 2 valid + 2 invalid phones
      (parseExcelPhonesMock as jest.Mock).mockResolvedValue({
        headers: ['telefono'],
        hasHeaders: true,
        rows: [
          { rowIndex: 2, fields: { telefono: '1122334455' } },   // valid
          { rowIndex: 3, fields: { telefono: 'not-a-phone' } },  // invalid
          { rowIndex: 4, fields: { telefono: '3344556677' } },   // valid
          { rowIndex: 5, fields: { telefono: 'abc' } },          // invalid
        ],
      });

      // normalizeArgPhone: return null for non-numeric strings
      const { normalizeArgPhone } = require('@/lib/validatePhone');
      (normalizeArgPhone as jest.Mock).mockImplementation((val: string) => {
        return /^\d{10}$/.test(val) ? val : null;
      });
    });

    it('only calls sendMessage for valid phones, excluding invalid ones', async () => {
      const { sendMessage: mockSendMessage } = await import('@/app/actions/sendMessage');
      const message = 'Hola, tu turno está confirmado';

      let triggerSend: (() => void) | undefined;
      let loadedPhones: string[] = [];

      render(
        <BulkUpload
          onPhonesLoaded={(phones) => { loadedPhones = phones; }}
          sessionId="test-session"
          message={message}
          registerSend={(fn) => { triggerSend = fn; }}
        />
      );

      const fakeFile = new File([''], 'mixed.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        Object.defineProperty(input, 'files', { value: [fakeFile], configurable: true });
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await act(async () => { await Promise.resolve(); });

      // Only 2 valid phones should have been reported
      expect(loadedPhones).toEqual(['1122334455', '3344556677']);

      expect(triggerSend).toBeDefined();
      await act(async () => { await triggerSend!(); });

      // sendMessage called exactly twice — once per valid phone
      expect(mockSendMessage).toHaveBeenCalledTimes(2);
      expect(mockSendMessage).toHaveBeenCalledWith('test-session', '1122334455', message);
      expect(mockSendMessage).toHaveBeenCalledWith('test-session', '3344556677', message);

      // Invalid phones must NOT have been sent
      const calledPhones = (mockSendMessage as jest.Mock).mock.calls.map((c: unknown[]) => c[1]);
      expect(calledPhones).not.toContain('not-a-phone');
      expect(calledPhones).not.toContain('abc');
    });

    it('sends nothing when all phones are invalid', async () => {
      const { sendMessage: mockSendMessage } = await import('@/app/actions/sendMessage');

      (parseExcelPhonesMock as jest.Mock).mockResolvedValue({
        headers: ['telefono'],
        hasHeaders: true,
        rows: [
          { rowIndex: 2, fields: { telefono: 'bad1' } },
          { rowIndex: 3, fields: { telefono: 'bad2' } },
        ],
      });

      let triggerSend: (() => void) | undefined;

      render(
        <BulkUpload
          onPhonesLoaded={() => {}}
          sessionId="test-session"
          message="Hola"
          registerSend={(fn) => { triggerSend = fn; }}
        />
      );

      const fakeFile = new File([''], 'all-invalid.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      await act(async () => {
        Object.defineProperty(input, 'files', { value: [fakeFile], configurable: true });
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await act(async () => { await Promise.resolve(); });

      // triggerSend may be registered but handleBulkSend exits early when phones.length === 0
      if (triggerSend) {
        await act(async () => { await triggerSend!(); });
      }

      expect(mockSendMessage).not.toHaveBeenCalled();
    });
  });
});
