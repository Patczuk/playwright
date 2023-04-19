const { test, expect } = require('@playwright/test');
import { login } from '../Config/credentials.json';

test('Login', async ({ page }) => {
  await page.goto('https://demoqa.com/login/');
  //await page.pause(); // using for debug

  //Login
  // await page.fill('#userName', 'Misha');
  // await page.fill('#password', 'Misha1test!');
  await page.fill('#userName', login.username);
  await page.fill('#password', login.password);
  await page.click('#login');

  await expect(page).toHaveTitle(/DEMOQA/); // check title

  //checking cookies
  const cookies = await page.cookies(); // get all cookies

  await expect(cookies.userName.value).toBeDefined(); // проверяем, что значение определено
  await expect(cookies.userName).toBeTruthy(); // Проверяем, что значение не является пустым

  await expect(cookies.userID).toBeDefined(); // проверяем, что значение определено
  await expect(cookies.userID).toBeTruthy(); // Проверяем, что значение не является пустым

  await expect(cookies.expires).toBeDefined(); // проверяем, что значение определено
  await expect(cookies.expires).toBeTruthy(); // Проверяем, что значение не является пустым

  await expect(cookies.token).toBeDefined(); // проверяем, что значение определено
  await expect(cookies.token).toBeTruthy(); // Проверяем, что значение не является пустым
});
