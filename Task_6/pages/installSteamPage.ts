import { Locator, Page } from '@playwright/test'

export class InstallSteamPage {
  readonly page: Page
  readonly installSteamBtn: Locator
  readonly pathToSave: string

  constructor(page: Page) {
    this.page = page;
    this.installSteamBtn = page.locator("(//a[@class='about_install_steam_link'])[1]")
  }
}