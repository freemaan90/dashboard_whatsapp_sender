import { test, expect } from '@playwright/test';

/**
 * Smoke test: verifies the login page loads correctly across all browsers.
 * Validates Requirements: 20.1, 20.2, 20.3, 20.4, 20.7
 */
test('login page loads correctly', async ({ page }) => {
  await page.goto('/login');

  // Page title / heading is visible
  await expect(page.getByRole('heading', { name: /WhatsApp Manager/i })).toBeVisible();

  // Email and password fields are present
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Contraseña')).toBeVisible();

  // Submit button is present
  await expect(page.getByRole('button', { name: /Iniciar Sesión/i })).toBeVisible();

  // Link to register page exists
  await expect(page.getByRole('link', { name: /Regístrate/i })).toBeVisible();
});
