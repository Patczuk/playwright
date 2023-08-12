import { Locator, Page } from '@playwright/test'
import { AgeCheckPage } from './agecheckPage'

export class NewAndTrendingPage {
  readonly page: Page
  readonly discount: Locator
  readonly price: Locator
  readonly ageCheckPage: AgeCheckPage
  readonly ageGate: Locator
  readonly fillAge: () => Promise<void>
  discountValue: number
  priceWithoutDiscount: number

  constructor(page: Page) {
    this.page = page
    this.discount = page.locator('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSaleDiscountBox"]')
    this.price = page.locator('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSalePriceBox"]')
    this.ageCheckPage = new AgeCheckPage(page)
    this.ageGate = this.ageCheckPage.ageGate
    this.fillAge = this.ageCheckPage.fillAge
  }

  async gameSelection() {
    const discountElement = await this.discount
    if (discountElement) {
      
    // Если элемент скидки найден
    const maxDiscountValue = await this.page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSaleDiscountBox"]'))
      
      // Инициализируем переменную значением, гарантированно меньшим любого возможного значения
      let maxDiscountValue = Number.NEGATIVE_INFINITY
      let maxDiscountElement
      //находим максимальную скидку
      elements.forEach((currentElement) => {
        const currentValue = parseFloat(currentElement.textContent?.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
        if (currentValue > maxDiscountValue) {
          maxDiscountValue = currentValue
          maxDiscountElement = currentElement.textContent
        }
      })
        return maxDiscountElement
      })  
      
    // кликаем по игре с максимальной скидкой
    await this.page.locator(`(//div[@class='salepreviewwidgets_StoreSaleWidgetOuterContainer_38DqR Panel Focusable']//div[contains(text(), "${maxDiscountValue}")]//ancestor::div[@class='salepreviewwidgets_StoreSaleWidgetOuterContainer_38DqR Panel Focusable']//img)[1]`).click()
    
    const discountValueText = maxDiscountValue
    
    this.discountValue = parseFloat(discountValueText.replace(/[^0-9,]/g, '').replace(',', '.') || '0')

  } else {
  // Если элемент скидки не найден
  await this.price
  
  const maxPriceValue = await this.page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('div[class^="saleitembrowser_SaleItemBrowserContainer"] div[class^="salepreviewwidgets_StoreSalePriceBox"]'))
    
    // Инициализируем переменную значением, гарантированно меньшим любого возможного значения
    let maxPriceValue = Number.NEGATIVE_INFINITY
    let maxPriceElement
    //находим максимальную цену
    elements.forEach((currentElement) => {
      const currentValue = parseFloat(currentElement.textContent?.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
      if (currentValue > maxPriceValue) {
        maxPriceValue = currentValue
        maxPriceElement = currentElement.textContent
      }
    })
      return maxPriceElement
    })  
  
  // кликаем по игре с максимальной ценой
  await this.page.locator(`(//div[@class='salepreviewwidgets_StoreSaleWidgetOuterContainer_38DqR Panel Focusable']//div[contains(text(), "${maxPriceValue}")]//ancestor::div[@class='salepreviewwidgets_StoreSaleWidgetOuterContainer_38DqR Panel Focusable']//img)[1]`).click()

  const priceValueText = maxPriceValue
    
  this.priceWithoutDiscount = parseFloat(priceValueText.replace(/[^0-9,]/g, '').replace(',', '.') || '0')
  }
  
  // Проверяем если запрос на возраст пользователя
  const ageGateElement = await this.ageGate
  const isAgeGateVisible = await ageGateElement.isVisible()

  if (isAgeGateVisible) {
    // Вызываем функцию fillAge(), если элемент this.ageGate виден
    await this.fillAge()
  }
}
}