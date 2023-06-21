import { Page } from '@playwright/test'

export class ProfilePage {
  readonly page: Page
     
  constructor(page: Page) {
    this.page = page;
   }

   async waitForLogoutBtn() {
    await this.page.waitForSelector('#submit')
   }
}