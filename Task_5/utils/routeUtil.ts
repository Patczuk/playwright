import { Locator, Page } from '@playwright/test'
import {SupportUtil} from './supportUtil'

export class RouteUtil {
  
  readonly page: Page
  cheatPages: string
  pageRouteUrl: string
  bookStoreUrl: string
  response: any[]
  readonly bookStoreBtn: Locator
  supportUtil: SupportUtil

  constructor(page: Page) {
    this.page = page;
    this.supportUtil = new SupportUtil(page)
    this.cheatPages = this.supportUtil.cheatPages
    this.pageRouteUrl = 'https://demoqa.com/BookStore/v1/Book?ISBN=*'
    this.bookStoreUrl = 'https://demoqa.com/BookStore/v1/Books'
    this.response = []
    this.bookStoreBtn = page.locator('//span[text()="Book Store"]')
  }

  async pageRoute() {
    await this.page.route(
      this.pageRouteUrl,
      async (route) => {
        const response = await route.fetch()
        let body = await response.text()
        const bookBody = JSON.parse(body)
  
        body = body.replace(bookBody.pages, this.cheatPages) //подменяем кол-во страниц на случайное число
  
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