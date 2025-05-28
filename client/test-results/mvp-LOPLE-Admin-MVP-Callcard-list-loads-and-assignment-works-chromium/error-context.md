# Test info

- Name: LOPLE Admin MVP >> Callcard list loads and assignment works
- Location: /workspace/client/tests/mvp.spec.ts:22:7

# Error details

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByLabel('아이디')

    at login (/workspace/client/tests/mvp.spec.ts:8:32)
    at /workspace/client/tests/mvp.spec.ts:23:5
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | const USER = 'admin';
   4 | const PASS = 'admin123';
   5 |
   6 | async function login(page) {
   7 |   await page.goto('/login');
>  8 |   await page.getByLabel('아이디').fill(USER);
     |                                ^ Error: locator.fill: Test timeout of 60000ms exceeded.
   9 |   await page.getByLabel('비밀번호').fill(PASS);
  10 |   await page.getByRole('button', { name: /로그인/i }).click();
  11 |   await expect(page).toHaveURL(/\/$/);
  12 | }
  13 |
  14 | test.describe('LOPLE Admin MVP', () => {
  15 |   test('Login flow and dashboard counts visible', async ({ page }) => {
  16 |     await login(page);
  17 |     await expect(page.getByText(/총 콜카드/i)).toBeVisible();
  18 |     await expect(page.getByText(/총 운전기사/i)).toBeVisible();
  19 |     await expect(page.getByText(/관제 대시보드/i)).toBeVisible();
  20 |   });
  21 |
  22 |   test('Callcard list loads and assignment works', async ({ page }) => {
  23 |     await login(page);
  24 |     await page.goto('/callcards');
  25 |     // Wait for callcard cards to load
  26 |     await expect(page.getByText(/콜카드 관리/i)).toBeVisible();
  27 |     // Check if callcards are displayed as cards
  28 |     await expect(page.locator('.MuiCard-root').first()).toBeVisible();
  29 |     // Check if Korean data is visible
  30 |     await expect(page.getByText(/서울/i)).toBeVisible();
  31 |   });
  32 |
  33 |   test('Drivers page shows list', async ({ page }) => {
  34 |     await login(page);
  35 |     await page.goto('/drivers');
  36 |     await expect(page.getByText(/운전기사 관리/i)).toBeVisible();
  37 |     // Check if driver cards are displayed
  38 |     await expect(page.locator('.MuiCard-root').first()).toBeVisible();
  39 |     // Check if Korean driver names are visible
  40 |     await expect(page.getByText(/김기사|이기사|박기사/i)).toBeVisible();
  41 |   });
  42 | });
```