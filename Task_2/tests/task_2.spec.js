const { test, expect } = require('@playwright/test');

test('task_2', async ({ page }) => {
  await page.goto('https://demoqa.com/');
  await expect(page).toHaveTitle(/DEMOQA/); // check title
});
