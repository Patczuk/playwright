import { test, expect } from '@playwright/test'
import { login } from '../config/credentials.json'
import axios from 'axios'
import { LoginPage } from '../pages/loginPage'
import { ProfilePage } from '../pages/profilePage'
import { BookStorePage } from '../pages/bookStorePage'
import {SupportUtil} from '../utils/supportUtil'
import {RouteUtil} from '../utils/routeUtil'
import {CookiesUtil} from '../utils/cookiesUtil'

test('Task_5', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const profilePage = new ProfilePage(page)
  const bookstorePage = new BookStorePage(page)
  const supportUtil = new SupportUtil(page)
  const routeUtil = new RouteUtil(page)
  const cookiesUtil = new CookiesUtil(page)
  let response
  let userID
  let userName
  let token
  let responseBody
  let cheatPages //переменная в которую будем сохранять случайное число страниц
  
  await test.step('Log in', async () => {
    await loginPage.goTo()
    await loginPage.login(login.username, login.password)
    await profilePage.waitForLogoutBtn() // ждем logout btn
  })

  await test.step('Cookies', async () => {
    // const cookies = await profilePage.getCookies() // get all cookies
    // expect(cookies.length).toBeGreaterThan(0)

    //проверка userID
    userID = await cookiesUtil.getCookieValue('userID')
    expect(userID).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userID).toBe('98137e29-ddb8-420d-bdcb-d4fe9ec6b5ce')

    //проверка userName
    userName = await cookiesUtil.getCookieValue('userName')
    expect(userName).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userName).toBe('Misha')

    //проверка expires
    const expires = await cookiesUtil.getCookieValue('expires')
    expect(expires).toBeTruthy() // Проверяем, что значение не является пустым или не определенным

    //проверка token
    token = await cookiesUtil.getCookieValue('token')
    expect(token).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
  })

  await test.step('Block image loading', async () => {
    profilePage.blockImages()
  })

  await test.step('Создание ожидания для перехвата GET запроса', async () => {
    [response] = await routeUtil.blockImages()
  })

  await test.step('Делаем скриншот страницы', async () => {
    await page.waitForLoadState()
    await supportUtil.takeScreenshot()
  })

  await test.step('Проверка запросов', async () => {
    expect(response.status()).toBe(200) //status = 200

    //количество books в body = количеству books через UI
    responseBody = await response.json() // парсим ответ в JSON
    expect(responseBody.books).toHaveLength(8)
  })

  await test.step('Модификация ответа', async () => {
    cheatPages = routeUtil.cheatPages
    routeUtil.pageRoute()
  })

  await test.step('Кликаем по рандомной книге', async () => {
   await bookstorePage.randomBookClick() //кликаем по рандомной книге
  })

  await test.step('Проверки ответов', async () => {
    //убедиться, что на UI отображается именно то число страниц, которое указано ранее
    const pagesCount = bookstorePage.pagesCount // значение количества страниц, видимых через UI

    //проверяем, что случайное число страниц на UI равно случайно заданному числу страниц
    await expect(pagesCount).toHaveText(cheatPages)

    //выполнить API запрос (await request.get(…))
    const getUserInfo = await axios.get(
      `https://demoqa.com/Account/v1/User/${userID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const infoBody = getUserInfo.data // парсим тело ответа и сохраняем в переменную

    expect(infoBody.username).toBe('Misha') // проверяем имя в ответе
    expect(infoBody.books).toHaveLength(0) // проверяем массив книг в ответе

    console.log("значение айди:", userID)
  })
})
