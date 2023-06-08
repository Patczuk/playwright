import { Locator, Page } from '@playwright/test';

export class bookStorePage {
  readonly page: Page
  readonly bookStoreBtn: Locator
  response: any[]
  bookStoreUrl: string
 
  constructor(page: Page) {
    this.page = page;
    this.bookStoreBtn = page.locator('//span[text()="Book Store"]');
    this.response = []
    this.bookStoreUrl = 'https://demoqa.com/BookStore/v1/Books'
    }

   async blockImages() {
    this.response = await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          resp.url().includes(this.bookStoreUrl) &&
          resp.request().method() === 'GET'
      ),
     this.bookStoreBtn.click() //в меню слева кликнуть Book Store
    ])
    return this.response
   }
   
   async takeScreenshot() {
    await this.page.screenshot({ path: __dirname + '..\\screenshots\\bookstore.png' })
   }
      
 }