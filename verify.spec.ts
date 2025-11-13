import { test, expect } from '@playwright/test';

test('Giscus comments toggle', async ({ page }) => {
  await page.goto('http://localhost:4321/vi/explore/personal-notes/');

  await page.locator('button[aria-label="Settings"]').click();

  await expect(page.locator('#giscus-container')).toBeVisible();

  await page.locator('label[for="comments-toggle"]').click();
  await expect(page.locator('#giscus-container')).toBeHidden();

  await page.locator('label[for="comments-toggle"]').click();
  await expect(page.locator('#giscus-container')).toBeVisible();
});
