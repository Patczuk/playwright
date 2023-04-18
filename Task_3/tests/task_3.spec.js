const { test, expect } = require('@playwright/test');
const credentials = require('./config/credentials.json');

test('Login', async ({ page }) => {
  await page.goto('https://demoqa.com/login/');

  await page.fill('#userName', credentials.username);
  await page.fill('#password', credentials.password);
  await page.click('#login');
});
