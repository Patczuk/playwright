import { Page } from '@playwright/test'

export class CookiesUtil {
  readonly page: Page
  cookies: any[]
  
  constructor(page: Page) {
    this.page = page;
    this.cookies = []
  }

  async getCookieValue(cookieName) {
    this.cookies = await this.page.context().cookies()
    const userCookie = this.cookies.find((c) => c.name === cookieName)
    return userCookie ? userCookie.value : null
   }
}