import { Locator, Page } from '@playwright/test'

export class ActionPage {
  readonly page: Page
  readonly newAndTrending: Locator
  
  constructor(page: Page) {
    this.page = page
    this.newAndTrending = page.locator('//div[text()="New & Trending"]')
  }
}