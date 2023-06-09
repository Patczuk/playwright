import { Locator, Page } from '@playwright/test';
import path from 'path';

export class bookStorePage {
  readonly page: Page
  readonly bookStoreBtn: Locator
  response: any[]
  books: any[]
  bookStoreUrl: string
  cheatPages: string
  pageRouteUrl: string
  randomIndex: number
  
 
  constructor(page: Page) {
    this.page = page;
    this.bookStoreBtn = page.locator('//span[text()="Book Store"]')
    this.response = []
    this.bookStoreUrl = 'https://demoqa.com/BookStore/v1/Books'
    this.pageRouteUrl = 'https://demoqa.com/BookStore/v1/Book?ISBN=*'
    this.cheatPages = (Math.floor(Math.random() * 999) + 1).toString()
    this.books = []

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
    await this.page.screenshot({ path: path.join(__dirname, '..', 'screenshots', 'bookstore.png') })
   }
  
   async pageRoute() {
    await this.page.route(
      this.pageRouteUrl,
      async (route) => {
        const response = await route.fetch()
        let body = await response.text()
        const bookBody = JSON.parse(body)
  
        body = body.replace(bookBody.pages, this.cheatPages) //подменяем кол-во страниц на случайное число
  
        route.fulfill({
          response,
          body,
          headers: {
            ...response.headers(),
          }
        })
      }
    )
   }

   async randomBookClick() {
    this.books = await this.page.$$('.action-buttons') // получаем все книги со страницы
    this.randomIndex = Math.floor(Math.random() * (this.books.length - 1))
    await this.books[this.randomIndex].click()
   }     

    

 }