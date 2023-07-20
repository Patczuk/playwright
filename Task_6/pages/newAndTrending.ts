import { Locator, Page } from '@playwright/test'
import { AgeCheckPage } from './agecheckPage'

export class NewAndTrendingPage {
  readonly page: Page
  readonly discount: Locator
  readonly price: Locator
  readonly ageCheckPage: AgeCheckPage
  readonly ageGate: Locator
  readonly fillAge: () => Promise<void>

  constructor(page: Page) {
    this.page = page
    this.discount = page.locator('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSaleDiscountBox"]')
    this.price = page.locator('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSalePriceBox"]')
    this.ageCheckPage = new AgeCheckPage(page)
    this.ageGate = this.ageCheckPage.ageGate
    this.fillAge = this.ageCheckPage.fillAge
  }

  async clickNearestParentUp(givenElement, levels) {
  const element = givenElement

  let parentElement = element;
  for (let i = 0; i < levels; i++) {
    // Найти родительский элемент (на один уровень выше) с помощью evaluateHandle
    const newParentElement = await parentElement.evaluateHandle((el) => el.parentElement)
    if (!newParentElement) {
      console.error(`Родительский элемент не найден на уровне ${i + 1}.`)
      return;
    }
    parentElement = newParentElement
  }
  const siblingElements = await parentElement.evaluateHandle((el) => {
    return Array.from(el.parentElement.children)
  });

  // Если смежный элемент всего один, выполнить клик по нему
  if (siblingElements.length === 1) {
    await siblingElements[0].click()
    return
  }
  }

  async gameSelection() {
    const discountElement = await this.discount
    if (discountElement) {
      // Если элемент скидки найден
  const maxDiscountElement = await this.page.evaluateHandle(() => {
    const elements = Array.from(document.querySelectorAll('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSaleDiscountBox"]'))
    return elements.reduce((maxElement, currentElement) => {
      const currentValue = parseFloat(currentElement.textContent?.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
      const maxValue = parseFloat(maxElement.textContent?.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
      return currentValue > maxValue ? currentElement : maxElement
    })
  })
  await this.clickNearestParentUp(maxDiscountElement,4)
} else {
  // Если элемент скидки не найден
  await this.price
  const maxPriceElement = await this.page.evaluateHandle(() => {
    const elements = Array.from(document.querySelectorAll('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSalePriceBox"]'))
    return elements.reduce((maxElement, currentElement) => {
      const currentValue = parseFloat(currentElement.textContent?.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
      const maxValue = parseFloat(maxElement.textContent?.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
      return currentValue > maxValue ? currentElement : maxElement
    })
  })
  await this.clickNearestParentUp(maxPriceElement,4)
    }
    // Проверяем видимость элемента this.ageGate
  const ageGateElement = await this.ageGate
  const isAgeGateVisible = await ageGateElement.isVisible();

  if (isAgeGateVisible) {
    // Вызываем функцию fillAge(), если элемент this.ageGate виден
    await this.fillAge();
  }
  }


}