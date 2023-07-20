import { Locator, Page } from '@playwright/test'
import path from 'path'

export class InstallSteamPage {
  readonly page: Page
  readonly installSteamBtn: Locator
  readonly pathToSave: string

  constructor(page: Page) {
    this.page = page;
    this.installSteamBtn = page.locator("(//a[@class='about_install_steam_link'])[1]")
  }

  async downloadSteam() {
    const downloadPromise = this.page.waitForEvent('download')
    await this.installSteamBtn.click()
    const download = await downloadPromise
    // Wait for the download process to complete
    console.log('Steam setup was downloaded to the following directory: ', await download.path())
  }
}