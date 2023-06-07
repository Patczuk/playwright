import { test, expect } from '@playwright/test'
import { login } from '../Config/credentials.json'
import axios from 'axios'
import { loginPage } from '../PageObject/loginPage'
import { profilePage } from '../PageObject/profilePage'

test('Task_5', async ({ page }) => {
  await test.step('Log in', async () => {
    const loginP = new loginPage(page)
    const profileP = new profilePage(page)
    await loginP.login(login.username, login.password)
    await profileP.waitForLogoutBtn() // ждем logout btn
  })

  let userID
  let token

  await test.step('Cookies', async () => {
    const profileP = new profilePage(page)
    const cookies = await profileP.getCookies() // get all cookies
    expect(cookies.length).toBeGreaterThan(0)

    //проверка userID
    userID = cookies.find((c) => c.name === 'userID')
    expect(userID).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userID.value).toBe('98137e29-ddb8-420d-bdcb-d4fe9ec6b5ce')

    //проверка userName
    const userName = cookies.find((c) => c.name === 'userName')
    expect(userName).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userName?.value).toBe('Misha')

    //проверка expires
    const expires = cookies.find((c) => c.name === 'expires')
    expect(expires).toBeTruthy() // Проверяем, что значение не является пустым или не определенным

    //проверка token
    token = cookies.find((c) => c.name === 'token')
    expect(token).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
  })

  await test.step('Block image loading', async () => {
    await page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) =>
      route.abort()
    )
  })

  let response

  await test.step('Создание ожидания для перехвата GET запроса', async () => {
    ;[response] = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes('https://demoqa.com/BookStore/v1/Books') &&
          resp.request().method() === 'GET'
      ),
      page.locator('//span[text()="Book Store"]').click(), //в меню слева кликнуть Book Store
    ])
  })

  await test.step('Делаем скриншот страницы', async () => {
    await page.waitForLoadState()
    await page.screenshot({ path: __dirname + '\\screenshots\\bookstore.png' })
  })

  let responseBody

  await test.step('Проверка запросов', async () => {
    expect(response.status()).toBe(200) //status = 200

    //количество books в body = количеству books через UI
    responseBody = await response.json() // парсим ответ в JSON
    expect(responseBody.books).toHaveLength(8)
  })

  let cheatPages //переменная в которую будем сохранять случайное число страниц

  await test.step('Модификация ответа', async () => {
    cheatPages = (Math.floor(Math.random() * 999) + 1).toString()

    await page.route(
      'https://demoqa.com/BookStore/v1/Book?ISBN=*',
      async (route) => {
        const response = await route.fetch()
        let body = await response.text()
        const bookBody = JSON.parse(body)

        body = body.replace(bookBody.pages, cheatPages) //подменяем кол-во страниц на случайное число

        route.fulfill({
          response,
          body,
          headers: {
            ...response.headers(),
          },
        })
      }
    )
  })

  await test.step('Кликаем по рандомной книге', async () => {
    const books = await page.$$('.action-buttons') // получаем все книги со страницы
    const randomIndex = Math.floor(Math.random() * (books.length - 1)) // генерируем рандомное число в рамках количества книг на странице
    await books[randomIndex].click() //кликаем по рандомной книге
  })

  await test.step('Проверки ответов', async () => {
    //убедиться, что на UI отображается именно то число страниц, которое указано ранее
    const pagesCount = page.locator(
      "//div[@id='pages-wrapper']//label[@id='userName-value']"
    ) // значение количества страниц, видимых через UI

    //проверяем, что случайное число страниц на UI равно случайно заданному числу страниц
    await expect(pagesCount).toHaveText(cheatPages)

    //выполнить API запрос (await request.get(…))
    const getUserInfo = await axios.get(
      `https://demoqa.com/Account/v1/User/${userID.value}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )

    const infoBody = getUserInfo.data // парсим тело ответа и сохраняем в переменную

    expect(infoBody.username).toBe('Misha') // проверяем имя в ответе
    expect(infoBody.books).toHaveLength(0) // проверяем массив книг в ответе

    console.log(infoBody)
  })
})
