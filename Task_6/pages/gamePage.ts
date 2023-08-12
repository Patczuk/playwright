import { Page } from '@playwright/test'

export class GamePage {
  readonly page: Page
  installSteamBtn: string
  price: string
  discount: string
  discountValue: number

  constructor(page: Page) {
    this.page = page
    this.installSteamBtn = 'Install Steam'
    this.price = "div.game_purchase_price"
    this.discount = "div.discount_pct"
  }
}