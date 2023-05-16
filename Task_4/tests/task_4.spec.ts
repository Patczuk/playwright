import { test, expect } from '@playwright/test';
import { login } from '../Config/credentials.json';

test('Login', async ({ page, request }) => {
  await page.goto('https://demoqa.com/login/');
    
  await test.step('Log in', async () => {
    page.fill('#userName', login.username);
    page.fill('#password', login.password);
    page.click('#login');
    page.waitForSelector('#submit');
  });

  const cookies = await page.context().cookies();// get all cookies

  await test.step('Cookies not empty', async () => {
    expect(cookies.length).toBeGreaterThan(0);
  });
  
  await test.step('Checking userID', async () => {
    const userID = cookies.find((c) => c.name == 'userID');
    expect(userID).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
    expect(userID.value).toBe('98137e29-ddb8-420d-bdcb-d4fe9ec6b5ce');
  });
  
  const userName = cookies.find((c) => c.name == 'userName');

  await test.step('Checking userName', async () => {
    expect(userName).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
    expect(userName.value).toBe('Misha');
  });
  
  const expires = cookies.find((c) => c.name == 'expires');
  
  await test.step('Expires', async () => {
    expect(expires).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
  });

  const token = cookies.find((c) => c.name == 'token');

  await test.step('Token', async () => {
    expect(token).toBeTruthy(); // Проверяем, что значение не является пустым или не определенным
  });

  await test.step('Блокировка загрузки изображений', async () => {
    page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) => route.abort());
  });
  
  // через page.waitForResponse создать ожидание для перехвата GET запроса
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes('https://demoqa.com/BookStore/v1/Books') && resp.request().method() === 'GET'
    ),
    page.locator('//span[text()="Book Store"]').click(), //в меню слева кликнуть Book Store
  ]);

  await test.step('Дождаться загрузки, сделать скриншот страницы и сохранить', async () => {
    page.waitForLoadState();
    page.screenshot({ path: __dirname + '\\screenshots\\bookstore.png' });
  });
  
  await test.step('проверить перехваченный GET запрос', async () => {
    expect(response.status()).toBe(200); //status = 200
  });
  
  const responseBody = await response.json(); // парсим ответ в JSON

  await test.step('количество books в body = количеству books через UI', async () => {
    expect(responseBody.books).toHaveLength(8);
  });


  //через page.route модифицировать ответ от GET
  let cheatPages = (Math.floor(Math.random() * 999) + 1).toString(); //переменная в которую будем сохранять случайное число страниц

  await test.step('подмена страниц', async () => {
    page.route('https://demoqa.com/BookStore/v1/Book?ISBN=*', async (route) => {
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
  });

  
  // Кликнуть на любую книгу в списке
  const books = await page.$$('.action-buttons'); // получаем все книги со страницы
  const randomIndex = Math.floor(Math.random() * (books.length - 1)); // генерируем рандомное число в рамках количества книг на странице

  await test.step('кликаем по рандомной книге', async () => {
    books[randomIndex].click(); 
  });
  
  //убедиться, что на UI отображается именно то число страниц, которое указано ранее
  const pagesCount = await page.locator("//div[@id='pages-wrapper']//label[@id='userName-value']"); // значение количества страниц, видимых через UI

  await test.step('случайное число страниц на UI равно случайно заданному числу страниц', async () => {
    expect(pagesCount).toHaveText(cheatPages);
  });
  
  //выполнить API запрос (await request.get(…))
  const getUserInfo = await request.get(`https://demoqa.com/Account/v1/User/${userID.value}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  const infoBody = JSON.parse(await getUserInfo.text()); // парсим тело ответа и сохраняем в переменную

  await test.step('Проверка ответа', async () => {
    expect(infoBody.username).toBe('Misha'); // проверяем имя в ответе
    expect(infoBody.books).toHaveLength(0); //проверяем массив книг в ответе
  });
});


