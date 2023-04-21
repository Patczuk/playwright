const { test, expect } = require('@playwright/test');
import { login } from '../Config/credentials.json';

test('Login', async ({ page }) => {
  await page.goto('https://demoqa.com/login/');
  // await page.pause(); // using for debug

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

  //Блокировка загрузки изображений
  await page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) => route.abort());

  // через page.waitForResponse создать ожидание для перехвата GET запроса
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('https://demoqa.com/BookStore/v1/Books') && resp.request().method() === 'GET'
    ),
    page.locator('//span[text()="Book Store"]').click(), //в меню слева кликнуть Book Store
  ]);

  //дождаться загрузки, сделать скриншот страницы и сохранить
  await page.waitForLoadState();
  await page.screenshot({ path: __dirname + '\\screenshots\\bookstore.png' });

  //проверить перехваченный GET запроc
  await expect(response.status()).toBe(200); //status = 200

  //количество books в body = количеству books через UI
  const responseBody = await response.json(); // парсим ответ в JSON
  await expect(responseBody.books).toHaveLength(8);

  // console.log(books);
});
