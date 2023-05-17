import { test, expect } from '@playwright/test';
import { login } from '../Config/credentials.json';
import axios from 'axios';


test('Login', async ({ page, request }) => {
  await page.goto('https://demoqa.com/login/');
  // await page.pause();

  //Login
  await page.fill('#userName', login.username);
  await page.fill('#password', login.password);
  await page.click('#login');
  await page.waitForSelector('#submit'); // ждем logout btn

  // await page.locator('#submit').toBeVisible(); // logout btn

  //получаем cookies
  const cookies = await page.context().cookies(); // get all cookies
  expect(cookies.length).toBeGreaterThan(0);

  //вывод в консоль полученных куки
  // for (const cookie of cookies) {
  //   console.log(cookie);
  // }

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

  //через page.route модифицировать ответ от GET
  let cheatPages = (Math.floor(Math.random() * 999) + 1).toString(); //переменная в которую будем сохранять случайное число страниц

  await page.route('https://demoqa.com/BookStore/v1/Book?ISBN=*', async (route) => {
    const response = await route.fetch();
    let body = await response.text();
    const bookBody = JSON.parse(body);

    body = body.replace(bookBody.pages, cheatPages); //подменяем кол-во страниц на случайное число

    route.fulfill({
      response,
      body,
      headers: {
        ...response.headers(),
      },
    });
  });

  // Кликнуть на любую книгу в списке
  const books = await page.$$('.action-buttons'); // получаем все книги со страницы
  const randomIndex = Math.floor(Math.random() * (books.length - 1)); // генерируем рандомное число в рамках количества книг на странице
  await books[randomIndex].click(); //кликаем по рандомной книге

  //убедиться, что на UI отображается именно то число страниц, которое указано ранее
  const pagesCount = await page.locator("//div[@id='pages-wrapper']//label[@id='userName-value']"); // значение количества страниц, видимых через UI

  //проверяем, что случайное число страниц на UI равно случайно заданному числу страниц
  await expect(pagesCount).toHaveText(cheatPages);

  //выполнить API запрос (await request.get(…))
  const getUserInfo = await axios.get(`https://demoqa.com/Account/v1/User/${userID.value}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const infoBody = getUserInfo.data; // парсим тело ответа и сохраняем в переменную

  await expect(infoBody.username).toBe('Misha'); // проверяем имя в ответе
  await expect(infoBody.books).toHaveLength(0); // проверяем массив книг в ответе
  console.log(infoBody);
});
