import { test, expect } from '@playwright/test';

const USER = 'admin';
const PASS = 'admin123';

async function login(page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(USER);
  await page.getByLabel('Password').fill(PASS);
  await page.getByRole('button', { name: /login/i }).click();
  await expect(page).toHaveURL(/\/$/);
}

test.describe('LOPLE Admin MVP', () => {
  test('Login flow and dashboard counts visible', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/total callcards/i)).toBeVisible();
    await expect(page.getByText(/total drivers/i)).toBeVisible();
  });

  test('Callcard list loads and assignment works', async ({ page }) => {
    await login(page);
    await page.goto('/callcards');
    // Wait for table
    await expect(page.getByRole('table')).toBeVisible();
    const firstRow = page.locator('tbody tr').first();
    const driverSelect = firstRow.locator('select');
    // assign first driver (value="1")
    await driverSelect.selectOption('1');
    await expect(firstRow.locator('td').nth(4)).toContainText('Driver Kim');
    // unassign
    await driverSelect.selectOption('');
    await expect(firstRow.locator('td').nth(4)).toContainText('-');
  });

  test('Drivers page shows list', async ({ page }) => {
    await login(page);
    await page.goto('/drivers');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByText('Driver Kim')).toBeVisible();
  });
});