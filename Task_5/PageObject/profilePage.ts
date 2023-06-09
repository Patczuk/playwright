import { Locator, Page } from '@playwright/test'

export class profilePage {
  readonly page: Page
  readonly logoutBtn: Locator
  cookies: any[]
  userID: string
  token: string
  userName: string
  expires: string
   
  constructor(page: Page) {
    this.page = page;
    this.logoutBtn = page.locator('#submit');
    this.cookies = []
   }

   async waitForLogoutBtn() {
    await this.page.waitForSelector('#submit')
   }

   async getCookies() {
    this.cookies = await this.page.context().cookies()
    return this.cookies
   }

   async getUserID() {
    this.userID = this.cookies.find((c) => c.name === 'userID')
    return this.userID
   }

   async getUserName() {
    const userCookie = this.cookies.find((c) => c.name === 'userName')
    this.userName = userCookie ? userCookie.value : null
    return this.userName
   }

   async getExpires() {
    const userCookie = this.cookies.find((c) => c.name === 'expires')
    this.expires = userCookie ? userCookie.value : null
    return this.expires
   }

   async getToken() {
    const userCookie = this.cookies.find((c) => c.name === 'token')
    this.token = userCookie ? userCookie.value : null
    return this.token
   }
  
    async blockImages() {
    this.page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) =>
      route.abort()
    )
   }
 }