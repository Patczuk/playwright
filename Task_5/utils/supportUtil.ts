import { Locator, Page } from '@playwright/test'
import path from 'path'

export class SupportUtil {
  readonly page: Page
  cheatPages: string

  constructor(page: Page) {
    this.page = page;
    this.cheatPages = (Math.floor(Math.random() * 999) + 1).toString()
  }

  async takeScreenshot() {
    await this.page.screenshot({ path: path.join(__dirname, '..', 'screenshots', 'bookstore.png') })
   }
}