import { Locator, Page } from '@playwright/test'
import {SupportUtil} from '../utils/supportUtil'

export class BookStorePage {
  readonly page: Page
  readonly pagesCount: Locator
  readonly bookStoreBtn: Locator
  books: any[]
  randomIndex: number
  randomNumber: number
  pageRouteUrl: string
  bookStoreUrl: string
   
  constructor(page: Page) {
    this.page = page
    this.bookStoreBtn = page.locator('//span[text()="Book Store"]')
    this.pageRouteUrl = 'https://demoqa.com/BookStore/v1/Book?ISBN=*'
    this.bookStoreUrl = 'https://demoqa.com/BookStore/v1/Books'
    this.books = []
    this.pagesCount = this.page.locator(
      "//div[@id='pages-wrapper']//label[@id='userName-value']")
    }

  async getRandomBook() {
    this.books = await this.page.$$('.action-buttons') // получаем все книги со страницы
    this.randomIndex = await SupportUtil.GetRandomNumberInRange(0,7)
    return this.books[this.randomIndex]
   }       
 }