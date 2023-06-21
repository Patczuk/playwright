import { Page } from '@playwright/test'
import path from 'path'

export class SupportUtil {
  readonly page: Page
  cheatPages: string
  randomNumberInDiapazon: number

  constructor(page: Page) {
    this.page = page
    this.randomNumberInDiapazon = Math.floor(Math.random() * 999) + 1
    this.cheatPages = this.randomNumberInDiapazon.toString()
  }

  async takeScreenshot() {
    await this.page.screenshot({ path: path.join(__dirname, '..', 'screenshots', 'bookstore.png') })
   }
}