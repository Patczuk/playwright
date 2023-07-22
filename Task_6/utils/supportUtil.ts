import { Locator, Page } from '@playwright/test'
import { InstallSteamPage } from '../pages/installSteamPage'
import path from 'path'
import fs from 'fs'

export class SupportUtil {
  readonly page: Page
  readonly installSteamPage: InstallSteamPage
  readonly installSteamBtn: Locator

  constructor(page: Page) {
    this.page = page
    this.installSteamPage = new InstallSteamPage(page)
    this.installSteamBtn = this.installSteamPage.installSteamBtn
  }

  async scroll(page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight*0.65)
    })
  }

  async downloadSteam() {
    const downloadPromise = this.page.waitForEvent('download')
    await this.installSteamBtn.click()
    
    // Wait for the download process to complete
    const download = await downloadPromise
        
    const originalPath = await download.path()

    if (originalPath === null) {
      console.log('Failed to get the file path.');
      return null
    }

    const downloadedFileName = path.basename(originalPath)
    
    return {
      path: originalPath,
      filename: downloadedFileName
    }
  }

  async generateTimeStamp() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${day}${month}${year}_${hours}${minutes}${seconds}`
  }

  async renameFileWithTimeStamp(originalPath: string, downloadedFileName: string, timeStamp: string) {
    return new Promise((resolve, reject) => {
      const directory = path.dirname(originalPath)
      const newFileName = `${downloadedFileName}_${timeStamp}`
      const newPath = path.join(directory, newFileName)
  
      // Переименовываем файл
      fs.rename(originalPath, newPath, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(newPath)
        }
      })
    })
  }
}