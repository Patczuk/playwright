const { test, expect } = require('@playwright/test');
import { login } from '../Config/credentials.json';

test('Login', async ({ page }) => {
  await page.goto('https://demoqa.com/login/');
  //await page.pause(); // using for debug

  //Login
  await page.fill('#userName', login.username);
  await page.fill('#password', login.password);
  await page.click('#login');
  await page.waitForNavigation();

  await expect(page).toHaveTitle(/DEMOQA/); // check title

  //получаем cookies
  const cookies = await page.context().cookies(); // get all cookies
  expect(cookies.length).toBeGreaterThan(0);

  //вывожу в консоль полученные куки (была проблема, что не все получал)
  for (const cookie of cookies) {
    console.log(cookie);
  }

  //проверка userID
  const userID = cookies.find((c) => c.name == 'userID');
  await expect(userID).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
  await expect(userID.value).toBe('98137e29-ddb8-420d-bdcb-d4fe9ec6b5ce');

  //проверка userName
  const userName = cookies.find((c) => c.name == 'userName');
  await expect(userName).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
  await expect(userName.value).toBe('Misha');

  //проверка expires
  const expires = cookies.find((c) => c.name == 'expires');
  await expect(expires).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным

  //проверка token
  const token = cookies.find((c) => c.name == 'token');
  await expect(token).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
});
