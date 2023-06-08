import { Locator, Page } from '@playwright/test';

export class profilePage {
  readonly page: Page
  readonly logoutBtn: Locator
  cookies: any[]
 
  constructor(page: Page) {
    this.page = page;
    this.logoutBtn = page.locator('#submit');
    this.cookies = []
    }

   async waitForLogoutBtn() {
    await this.page.waitForSelector('#submit')
   }

   async getCookies() {
    this.cookies = await this.page.context().cookies()
    return this.cookies
   }

   async blockImages() {
    this.page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) =>
      route.abort()
    )
   }
 }