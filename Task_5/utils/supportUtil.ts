import { Page } from '@playwright/test'

export class SupportUtil {
  readonly page: Page
  cheatPages: string
  randomNumberInDiapazon: number
  randomNumber: number

  constructor(page: Page) {
    this.page = page
    this.randomNumber = Math.random()
    // this.randomNumberInDiapazon = Math.floor(Math.random() * 999) + 1
    // this.cheatPages = this.randomNumberInDiapazon.toString()
  }

  async takeScreenshot(pathToFile) {
    await this.page.screenshot({ path: pathToFile })
  }

  async getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}