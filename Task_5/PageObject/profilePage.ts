import { Locator, Page } from '@playwright/test'
import axios from 'axios'

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
    this.token = this.cookies.find((c) => c.name === 'token')
    this.userID = this.cookies.find((c) => c.name === 'userID')
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
  
   async getUsersInfo() {
    try {
      const response = await axios.get(
        `https://demoqa.com/Account/v1/User/${this.userID}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
  
      return response.data; // Return the response data
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

   async blockImages() {
    this.page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) =>
      route.abort()
    )
   }
 }