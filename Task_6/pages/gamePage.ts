import { Locator, Page } from '@playwright/test'

export class GamePage {
  readonly page: Page
  readonly installSteamBtn: Locator

  constructor(page: Page) {
    this.page = page;
    this.installSteamBtn = page.getByText('Install Steam')
  }
}