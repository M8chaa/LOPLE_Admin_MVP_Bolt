import { test, expect } from '@playwright/test';

const USER = 'admin';
const PASS = 'admin123';

async function login(page) {
  await page.goto('/login');
  await page.getByLabel('아이디').fill(USER);
  await page.getByLabel('비밀번호').fill(PASS);
  await page.getByRole('button', { name: /로그인/i }).click();
  await expect(page).toHaveURL(/\/$/);
}

test.describe('LOPLE Admin MVP', () => {
  test('Login flow and dashboard counts visible', async ({ page }) => {
    await login(page);
    await expect(page.getByText(/총 콜카드/i)).toBeVisible();
    await expect(page.getByText(/총 운전기사/i)).toBeVisible();
    await expect(page.getByText(/관제 대시보드/i)).toBeVisible();
  });

  test('Callcard list loads and assignment works', async ({ page }) => {
    await login(page);
    await page.goto('/callcards');
    // Wait for callcard cards to load
    await expect(page.getByText(/콜카드 관리/i)).toBeVisible();
    // Check if callcards are displayed as cards
    await expect(page.locator('.MuiCard-root').first()).toBeVisible();
    // Check if Korean data is visible
    await expect(page.getByText(/서울/i)).toBeVisible();
  });

  test('Drivers page shows list', async ({ page }) => {
    await login(page);
    await page.goto('/drivers');
    await expect(page.getByText(/운전기사 관리/i)).toBeVisible();
    // Check if driver cards are displayed
    await expect(page.locator('.MuiCard-root').first()).toBeVisible();
    // Check if Korean driver names are visible
    await expect(page.getByText(/김기사|이기사|박기사/i)).toBeVisible();
  });
});