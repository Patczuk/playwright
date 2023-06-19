import { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly userName: Locator
  readonly password: Locator
  readonly loginBtn: Locator

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator('#userName')
    this.password = page.locator('#password')
    this.loginBtn = page.locator('#login')

  }

  async goTo() {
    await this.page.goto('https://demoqa.com/login/')
  }

  async login(username, password) {
    await this.userName.fill(username)
    await this.password.fill(password)
    await this.loginBtn.click()
  }

}