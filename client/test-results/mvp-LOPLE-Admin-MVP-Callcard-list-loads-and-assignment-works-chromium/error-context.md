# Test info

- Name: LOPLE Admin MVP >> Callcard list loads and assignment works
- Location: /workspace/client/tests/mvp.spec.ts:21:7

# Error details

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:5173/login", waiting until "load"

    at login (/workspace/client/tests/mvp.spec.ts:7:14)
    at /workspace/client/tests/mvp.spec.ts:22:11
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | const USER = 'admin';
   4 | const PASS = 'admin123';
   5 |
   6 | async function login(page) {
>  7 |   await page.goto('/login');
     |              ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
   8 |   await page.getByLabel('Username').fill(USER);
   9 |   await page.getByLabel('Password').fill(PASS);
  10 |   await page.getByRole('button', { name: /login/i }).click();
  11 |   await expect(page).toHaveURL(/\/$/);
  12 | }
  13 |
  14 | test.describe('LOPLE Admin MVP', () => {
  15 |   test('Login flow and dashboard counts visible', async ({ page }) => {
  16 |     await login(page);
  17 |     await expect(page.getByText(/total callcards/i)).toBeVisible();
  18 |     await expect(page.getByText(/total drivers/i)).toBeVisible();
  19 |   });
  20 |
  21 |   test('Callcard list loads and assignment works', async ({ page }) => {
  22 |     await login(page);
  23 |     await page.goto('/callcards');
  24 |     // Wait for table
  25 |     await expect(page.getByRole('table')).toBeVisible();
  26 |     const firstRow = page.locator('tbody tr').first();
  27 |     const driverSelect = firstRow.locator('select');
  28 |     // assign first driver (value="1")
  29 |     await driverSelect.selectOption('1');
  30 |     await expect(firstRow.locator('td').nth(4)).toContainText('Driver Kim');
  31 |     // unassign
  32 |     await driverSelect.selectOption('');
  33 |     await expect(firstRow.locator('td').nth(4)).toContainText('-');
  34 |   });
  35 |
  36 |   test('Drivers page shows list', async ({ page }) => {
  37 |     await login(page);
  38 |     await page.goto('/drivers');
  39 |     await expect(page.getByRole('table')).toBeVisible();
  40 |     await expect(page.getByText('Driver Kim')).toBeVisible();
  41 |   });
  42 | });
```