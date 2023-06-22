import { Locator, Page } from '@playwright/test'
import {SupportUtil} from '../utils/supportUtil'

export class BookStorePage {
  readonly page: Page
  readonly pagesCount: Locator
  readonly bookStoreBtn: Locator
  books: any[]
  randomIndex: number
  randomNumber: number
  supportUtil: SupportUtil
   
  constructor(page: Page) {
    this.page = page
    this.bookStoreBtn = page.locator('//span[text()="Book Store"]')
    this.supportUtil = new SupportUtil(page)
    this.randomNumber = this.supportUtil.randomNumber
    this.books = []
    this.pagesCount = this.page.locator(
      "//div[@id='pages-wrapper']//label[@id='userName-value']")
    }

  async getRandomBook() {
    this.books = await this.page.$$('.action-buttons') // получаем все книги со страницы
    this.randomIndex = Math.floor(this.randomNumber*this.books.length)
    return this.books[this.randomIndex]
   }       
 }