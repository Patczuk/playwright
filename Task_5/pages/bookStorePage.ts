import { Locator, Page } from '@playwright/test'

export class BookStorePage {
  readonly page: Page

  readonly pagesCount: Locator
 
  books: any[]
  randomIndex: number
  
 
  constructor(page: Page) {
    this.page = page;
   
   
    
    this.books = []
    this.pagesCount = page.locator(
      "//div[@id='pages-wrapper']//label[@id='userName-value']")
    }

  async randomBookClick() {
    this.books = await this.page.$$('.action-buttons') // получаем все книги со страницы
    this.randomIndex = Math.floor(Math.random() * (this.books.length - 1))
    await this.books[this.randomIndex].click()
   }       
 }