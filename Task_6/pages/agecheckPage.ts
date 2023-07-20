import { Locator, Page } from '@playwright/test'

export class AgeCheckPage {
  readonly page: Page
  readonly ageGate: Locator
  readonly ageDay: Locator
  readonly ageMonth: Locator
  readonly ageYear: Locator
  readonly viewPageBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.ageGate = page.locator('#app_agegate')
    this.ageDay = page.locator('#ageDay')
    this.ageMonth = page.locator('#ageMonth')
    this.ageYear = page.locator('#ageYear')
    this.viewPageBtn = page.locator('#view_product_page_btn')

  }

  async fillAge() {
    await this.ageDay.selectOption('25')
    await this.ageMonth.selectOption('November')
    await this.ageYear.selectOption('1987')
    await this.viewPageBtn.click()
  }
}