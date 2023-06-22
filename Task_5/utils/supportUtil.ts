import { Page } from '@playwright/test'

export class SupportUtil {
  readonly page: Page
  cheatPages: string
  randomNumberInDiapazon: number
  randomNumber: number

  constructor(page: Page) {
    this.page = page
    this.randomNumber = Math.random()
  }

  async takeScreenshot(pathToFile) {
    await this.page.screenshot({ path: pathToFile })
  }

  async getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}