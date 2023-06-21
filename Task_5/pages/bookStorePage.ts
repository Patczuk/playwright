import { Locator, Page } from '@playwright/test'
import {SupportUtil} from '../utils/supportUtil'

export class BookStorePage {
  readonly page: Page
  readonly pagesCount: Locator
  books: any[]
  randomIndex: number
  supportUtil: SupportUtil
   
  constructor(page: Page) {
    this.page = page;
    this.supportUtil = new SupportUtil(page)
    this.books = []
    this.pagesCount = this.page.locator(
      "//div[@id='pages-wrapper']//label[@id='userName-value']")
    }

  async getRandomBook() {
    this.books = await this.page.$$('.action-buttons') // получаем все книги со страницы
    this.randomIndex = Math.floor(Math.random() * this.books.length)
    return this.books[this.randomIndex]
   }       
 }