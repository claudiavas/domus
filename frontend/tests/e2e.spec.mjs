// Tests E2E de Domus con Playwright.
// Ejecutar: npm run test:e2e (usa producción por defecto; BASE_URL para otro entorno)
import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://domus-frontend-production-f950.up.railway.app';
const EMAIL = process.env.E2E_EMAIL || 'test.claudia@example.com';
const PASSWORD = process.env.E2E_PASSWORD || 'Test1234!';

test('la portada muestra el listado público sin iniciar sesión', async ({ page }) => {
  await page.goto(BASE);
  await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
});

test('login lleva al MainView y lista viviendas', async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /ingresar/i }).click();
  await page.waitForURL(/MainView/i);
  // hay tarjetas de viviendas con su botón "Ver más"
  await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
});

test('el filtro de provincia reduce el listado', async ({ page }) => {
  await page.goto(`${BASE}/login`);
  await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /ingresar/i }).click();
  await page.waitForURL(/MainView/i);
  await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
  const total = await page.getByRole('button', { name: /ver más/i }).count();

  await page.locator('div.MuiSelect-select').first().click();
  await page.getByRole('option', { name: 'BARCELONA' }).click();
  await expect
    .poll(async () => page.getByRole('button', { name: /ver más/i }).count())
    .toBeLessThan(total);
});

test('sin scroll horizontal en móvil', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`${BASE}/login`);
  await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  await page.getByRole('button', { name: /ingresar/i }).click();
  await page.waitForURL(/MainView/i);
  await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBe(0);
});
