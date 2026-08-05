# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e.spec.mjs >> el filtro de provincia reduce el listado
- Location: tests/e2e.spec.mjs:24:1

# Error details

```
Error: page.goto: net::ERR_INTERNET_DISCONNECTED at https://domus-frontend-production-f950.up.railway.app/login
Call log:
  - navigating to "https://domus-frontend-production-f950.up.railway.app/login", waiting until "load"

```

# Test source

```ts
  1  | // Tests E2E de Domus con Playwright.
  2  | // Ejecutar: npm run test:e2e (usa producción por defecto; BASE_URL para otro entorno)
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | const BASE = process.env.BASE_URL || 'https://domus-frontend-production-f950.up.railway.app';
  6  | const EMAIL = process.env.E2E_EMAIL || 'test.claudia@example.com';
  7  | const PASSWORD = process.env.E2E_PASSWORD || 'Test1234!';
  8  | 
  9  | test('la portada muestra el listado público sin iniciar sesión', async ({ page }) => {
  10 |   await page.goto(BASE);
  11 |   await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
  12 | });
  13 | 
  14 | test('login lleva al MainView y lista viviendas', async ({ page }) => {
  15 |   await page.goto(`${BASE}/login`);
  16 |   await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  17 |   await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  18 |   await page.getByRole('button', { name: /ingresar/i }).click();
  19 |   await page.waitForURL(/MainView/i);
  20 |   // hay tarjetas de viviendas con su botón "Ver más"
  21 |   await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
  22 | });
  23 | 
  24 | test('el filtro de provincia reduce el listado', async ({ page }) => {
> 25 |   await page.goto(`${BASE}/login`);
     |              ^ Error: page.goto: net::ERR_INTERNET_DISCONNECTED at https://domus-frontend-production-f950.up.railway.app/login
  26 |   await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  27 |   await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  28 |   await page.getByRole('button', { name: /ingresar/i }).click();
  29 |   await page.waitForURL(/MainView/i);
  30 |   await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
  31 |   const total = await page.getByRole('button', { name: /ver más/i }).count();
  32 | 
  33 |   await page.locator('div.MuiSelect-select').first().click();
  34 |   await page.getByRole('option', { name: 'BARCELONA' }).click();
  35 |   await expect
  36 |     .poll(async () => page.getByRole('button', { name: /ver más/i }).count())
  37 |     .toBeLessThan(total);
  38 | });
  39 | 
  40 | test('sin scroll horizontal en móvil', async ({ browser }) => {
  41 |   const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  42 |   await page.goto(`${BASE}/login`);
  43 |   await page.locator('input[name="email"], input[type="email"]').first().fill(EMAIL);
  44 |   await page.locator('input[name="password"], input[type="password"]').first().fill(PASSWORD);
  45 |   await page.getByRole('button', { name: /ingresar/i }).click();
  46 |   await page.waitForURL(/MainView/i);
  47 |   await expect(page.getByRole('button', { name: /ver más/i }).first()).toBeVisible({ timeout: 15000 });
  48 |   const overflow = await page.evaluate(
  49 |     () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  50 |   );
  51 |   expect(overflow).toBe(0);
  52 | });
  53 | 
```