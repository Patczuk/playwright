import { Page } from '@playwright/test'

export class SupportUtil {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  static async Scroll(page) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight / 2);
    });
  }
}