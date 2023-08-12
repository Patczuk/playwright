import { Page } from '@playwright/test'

export class InstallSteamPage {
  readonly page: Page
  readonly installSteamBtn: string

  constructor(page: Page) {
    this.page = page
    this.installSteamBtn = "(//a[@class='about_install_steam_link'])[1]"
  }
}