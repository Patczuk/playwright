import { test, expect } from '@playwright/test'
import { login } from '../Config/credentials.json'
import axios from 'axios'
import { loginPage } from '../PageObject/loginPage'
import { profilePage } from '../PageObject/profilePage'
import { bookStorePage } from '../PageObject/bookStorePage'

test('Task_5', async ({ page }) => {
  const loginP = new loginPage(page)
  const profileP = new profilePage(page)
  const bookstoreP = new bookStorePage(page)
  let response
  let userID
  let token
  let responseBody
  let cheatPages //переменная в которую будем сохранять случайное число страниц
  
  await test.step('Log in', async () => {
    await loginP.login(login.username, login.password)
    await profileP.waitForLogoutBtn() // ждем logout btn
  })

  await test.step('Cookies', async () => {
    const cookies = await profileP.getCookies() // get all cookies
    expect(cookies.length).toBeGreaterThan(0)

    //проверка userID
    userID = await profileP.getUserID()
    expect(userID).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userID.value).toBe('98137e29-ddb8-420d-bdcb-d4fe9ec6b5ce')

    //проверка userName
    const userName = await profileP.getUserName()
    expect(userName).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userName).toBe('Misha')

    //проверка expires
    const expires = await profileP.getExpires()
    expect(expires).toBeTruthy() // Проверяем, что значение не является пустым или не определенным

    //проверка token
    token = await profileP.getToken()
    expect(token).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
  })

  await test.step('Block image loading', async () => {
    profileP.blockImages()
  })

  await test.step('Создание ожидания для перехвата GET запроса', async () => {
    [response] = await bookstoreP.blockImages()
  })

  await test.step('Делаем скриншот страницы', async () => {
    await page.waitForLoadState()
    bookstoreP.takeScreenshot()
  })

  await test.step('Проверка запросов', async () => {
    expect(response.status()).toBe(200) //status = 200

    //количество books в body = количеству books через UI
    responseBody = await response.json() // парсим ответ в JSON
    expect(responseBody.books).toHaveLength(8)
  })

  await test.step('Модификация ответа', async () => {
    cheatPages = bookstoreP.cheatPages
    bookstoreP.pageRoute()
  })

  await test.step('Кликаем по рандомной книге', async () => {
    bookstoreP.randomBookClick() //кликаем по рандомной книге
  })

  await test.step('Проверки ответов', async () => {
    //убедиться, что на UI отображается именно то число страниц, которое указано ранее
    const pagesCount = bookstoreP.pagesCount // значение количества страниц, видимых через UI

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
