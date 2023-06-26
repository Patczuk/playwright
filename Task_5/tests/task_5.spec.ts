import { test, expect } from '@playwright/test'
import path from 'path'
import { login } from '../config/credentials.json'
import { LoginPage } from '../pages/loginPage'
import { ProfilePage } from '../pages/profilePage'
import { BookStorePage } from '../pages/bookStorePage'
import {SupportUtil} from '../utils/supportUtil'
import {RouteUtil} from '../utils/routeUtil'
import {CookiesUtil} from '../utils/cookiesUtil'
import {ApiUtil} from '../utils/apiUtil'

test('Task_5', async ({ page }) => {
  const loginPage = new LoginPage(page)
  const profilePage = new ProfilePage(page)
  const bookstorePage = new BookStorePage(page)
  let response
  let userID
  let userName
  let token
  let responseBody
  const cheatPages = (await SupportUtil.GetRandomNumberInRange(1, 1000)).toString()
  const pathToScreenshotFile = path.join(__dirname, '..', 'screenshots', 'bookstore.png')
  
  await test.step('Log in', async () => {
    await loginPage.goTo()
    await loginPage.login(login.username, login.password)
    await profilePage.waitForLogoutBtn() // ждем logout btn
  })

  await test.step('Cookies', async () => {
    //проверка userID
    userID = await CookiesUtil.GetCookieValue(page, 'userID')
    expect(userID).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userID).toBe('98137e29-ddb8-420d-bdcb-d4fe9ec6b5ce')

    //проверка userName
    userName = await CookiesUtil.GetCookieValue(page, 'userName')
    expect(userName).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
    expect(userName).toBe('Misha')

    //проверка expires
    const expires = await CookiesUtil.GetCookieValue(page,'expires')
    expect(expires).toBeTruthy() // Проверяем, что значение не является пустым или не определенным

    //проверка token
    token = await CookiesUtil.GetCookieValue(page,'token')
    expect(token).toBeTruthy() // Проверяем, что значение не является пустым или не определенным
  })

  await test.step('Block image loading', async () => {
    RouteUtil.BlockImages(page)
  })

  await test.step('Создание ожидания для перехвата GET запроса', async () => {
    [response] = await RouteUtil.WaitResponse(response, page, bookstorePage.bookStoreUrl, bookstorePage.bookStoreBtn)
  })

  await test.step('Делаем скриншот страницы', async () => {
    await page.waitForLoadState()
    await SupportUtil.TakeScreenshot(page, pathToScreenshotFile)
  })

  await test.step('Проверка запросов', async () => {
    expect(response.status()).toBe(200) //status = 200

    //количество books в body = количеству books через UI
    responseBody = await response.json() // парсим ответ в JSON
    expect(responseBody.books).toHaveLength(8)
  })

  await test.step('Модификация ответа', async () => {
    RouteUtil.PageRoute(page,bookstorePage.pageRouteUrl,cheatPages)
  })

  await test.step('Кликаем по рандомной книге', async () => {
    const randomBookElement = await bookstorePage.getRandomBook() //получаем рандомную книгу
    await randomBookElement.click()// кликаем по рандомной книге
  })
  
  await test.step('Проверки ответов', async () => {
    //проверяем, что случайное число страниц на UI равно случайно заданному числу страниц
   await expect(bookstorePage.pagesCount).toHaveText(cheatPages)

    //выполнить API запрос (await request.get(…))
    const userInfo = await ApiUtil.GetUserInfo(userID,token) // получаем тело ответа и сохраняем в переменную

    expect(userInfo.username).toBe('Misha') // проверяем имя в ответе
    expect(userInfo.books).toHaveLength(0) // проверяем массив книг в ответе

    console.log(userInfo)
  })
})