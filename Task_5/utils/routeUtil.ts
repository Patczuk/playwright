import { Locator, Page } from '@playwright/test'
import {SupportUtil} from './supportUtil'
import {BookStorePage} from '../pages/bookStorePage'

export class RouteUtil {
  
  readonly page: Page
  cheatPages: string
  pageRouteUrl: string
  bookStoreUrl: string
  response: any[]
  // supportUtil: SupportUtil
  bookStorePage: BookStorePage
  bookStoreBtn: Locator

  constructor(page: Page) {
    this.page = page;
    // this.supportUtil = new SupportUtil(page)
    this.bookStorePage = new BookStorePage(page)
    // this.cheatPages = this.supportUtil.cheatPages
    this.pageRouteUrl = 'https://demoqa.com/BookStore/v1/Book?ISBN=*'
    this.bookStoreUrl = 'https://demoqa.com/BookStore/v1/Books'
    this.response = []
    this.bookStoreBtn = this.bookStorePage.bookStoreBtn
  }

  async pageRoute(cheatPages) {
    await this.page.route(
      this.pageRouteUrl,
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
          }
        })
      }
    )
   }

  async waitResponse() {
    this.response = await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          resp.url().includes(this.bookStoreUrl) &&
          resp.request().method() === 'GET'
      ),
     this.bookStoreBtn.click() //в меню слева кликнуть Book Store
    ])
    return this.response
   }

   async blockImages() {
    this.page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) =>
      route.abort()
    )
   }
}