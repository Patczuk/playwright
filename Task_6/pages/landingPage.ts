import { Locator, Page } from '@playwright/test'

export class LandingPage {
  readonly page: Page
  readonly categories: Locator

  constructor(page: Page) {
    this.page = page;
    this.categories = page.locator("(//a[@class='pulldown_desktop'])[3]")
  }
  
  async goTo() {
    await this.page.goto('https://store.steampowered.com/')
  }

  async clickCategory(categoryName) {
    await this.categories.hover()
    const categoryLink = await this.page.waitForSelector(`a[href*="${categoryName}"]`)
    await categoryLink.click()
  }
}