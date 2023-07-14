import { Locator, Page } from '@playwright/test'

export class NewAndTrendingPage {
  readonly page: Page
  readonly discount: Locator
  readonly price: Locator

  constructor(page: Page) {
    this.page = page
    this.discount = page.locator("//div[starts-with(@class, 'salepreviewwidgets_StoreSaleDiscountBox')]")
    this.price = page.locator("//div[starts-with(@class, 'salepreviewwidgets_StoreSalePriceBox')]")
  }

  async gameSelection() {
    const discountElement = await this.discount
    if (discountElement) {
      // Если элемент скидки найден
  const maxDiscountElement = await this.page.evaluateHandle(() => {
    const elements = Array.from(document.querySelectorAll('div[class^="salepreviewwidgets_StoreSaleDiscountBox"]'));
    return elements.reduce((maxElement, currentElement) => {
      const currentValue = parseFloat(currentElement.textContent?.replace(/[^0-9.]/g, '') || '0');
      const maxValue = parseFloat(maxElement.textContent?.replace(/[^0-9.]/g, '') || '0');
      return currentValue > maxValue ? currentElement : maxElement;
    });
  });

  await maxDiscountElement.click();
} else {
  // Если элемент скидки не найден
  await this.price
  const maxPriceElement = await this.page.evaluateHandle(() => {
    const elements = Array.from(document.querySelectorAll('div[class^="salepreviewwidgets_StoreSalePriceBox"]'))
    return elements.reduce((maxElement, currentElement) => {
      const currentValue = parseFloat(currentElement.textContent?.replace(/[^0-9.]/g, '') || '0')
      const maxValue = parseFloat(maxElement.textContent?.replace(/[^0-9.]/g, '') || '0')
      return currentValue > maxValue ? currentElement : maxElement
    })
  })

  await maxPriceElement.click();
    }
  }
}