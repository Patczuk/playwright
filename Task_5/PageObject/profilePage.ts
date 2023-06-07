import { Locator, Page } from '@playwright/test';

export class profilePage {
  readonly page: Page
  readonly logoutBtn: Locator
 
  constructor(page: Page) {
    this.page = page;
    this.logoutBtn = page.locator('#submit');
    }

   async waitForLogoutBtn() {
    await this.page.waitForSelector('#submit')
   }

   async getCookies() {
    const cookies = await this.page.context().cookies()
    return cookies
   }
 }