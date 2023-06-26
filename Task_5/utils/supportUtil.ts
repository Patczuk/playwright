import { Page } from '@playwright/test'

export class SupportUtil {
  readonly page: Page
  randomNumber: number

  constructor(page: Page) {
    this.page = page
    this.randomNumber = Math.random()
  }

  static async TakeScreenshot(page, pathToFile) {
    await page.screenshot({ path: pathToFile })
  }

  static async GetRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}