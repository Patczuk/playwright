import { Page } from '@playwright/test'
import axios from 'axios'

export class ApiUtil {
  readonly page: Page

  constructor(page: Page) {
    this.page = page;
  }

  async getUserInfo(userID,token) {
    const response = await axios.get(
    `https://demoqa.com/Account/v1/User/${userID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
  }
}