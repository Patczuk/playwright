import { test, expect } from '@playwright/test'
import { LandingPage } from '../pages/landingPage'
import { ActionPage } from '../pages/actionPage'
import { SupportUtil } from '../utils/supportUtil'
import { NewAndTrendingPage } from '../pages/newAndTrending'
import { GamePage } from '../pages/gamePage'

test('Task_6', async ({ page, context }) => {
  await page.pause()
  const landingPage = new LandingPage(page)
  const actionPage = new ActionPage(page)
  const newAndTrending = new NewAndTrendingPage(page)
  const gamePage = new GamePage(page)
  const supportUtil = new SupportUtil(page)
  let downloadResult
  let newPage

  await test.step('Visit Landing page', async () => {
    await landingPage.goTo()
    // await landingPage.acceptAllButton.click()
  })

  await test.step('Click Action', async () => {
    await landingPage.clickCategory('Action')
  })

  await test.step('Game selection based on given conditions', async () => {
    await page.waitForLoadState('domcontentloaded')
    // await supportUtil.scroll(page,0.3)
    await supportUtil.scroll(page, 0.5)
    await actionPage.newAndTrending.click()
    const newPagePromise = new Promise((resolve) =>
      context.once('page', resolve),
    )
    await newAndTrending.gameSelection()
    newPage = await newPagePromise
    await newPage.waitForLoadState('domcontentloaded')
    await newPage.bringToFront()
  })

  await test.step('Checking game price and discount', async () => {
    await supportUtil.scroll(newPage, 0.15)
    const discountOnGamePage = await newPage.locator(gamePage.discount).first()

    if (discountOnGamePage) {
      // Получаем текстовое содержимое
      const discountText = await discountOnGamePage.innerText()
      // Получаем числовое содержимое
      const discountValueOnGamePage = await supportUtil.getNumber(discountText)
      // проверяем корректность скидки
      const discountValueOnNewAndTrending = await newAndTrending.discountValue
      expect(discountValueOnGamePage).toEqual(discountValueOnNewAndTrending)
    } else {
      const priceOnGamePage = await newPage.locator(gamePage.price).first()
      // Получаем текстовое содержимое
      const priceText = await priceOnGamePage.innerText()
      // Получаем числовое содержимое
      const priceValueOnGamePage = await supportUtil.getNumber(priceText)
      // проверяем корректность цены
      const priceValueOnNewAndTrending =
        await newAndTrending.priceWithoutDiscount
      expect(priceValueOnGamePage).toEqual(priceValueOnNewAndTrending)
    }
  })

  await test.step('Click Steam button', async () => {
    await newPage.getByText(gamePage.installSteamBtn).click()
  })

  await test.step('Downloading the setup file', async () => {
    downloadResult = await supportUtil.downloadSteam(newPage)
  })

  await test.step('Renaming the downloaded file', async () => {
    const timeStamp = await supportUtil.generateTimeStamp()
    const renamedFile = await supportUtil.renameFileWithTimeStamp(
      downloadResult.path,
      downloadResult.filename,
      timeStamp,
    )
    console.log('Renamed file name:', renamedFile)
  })
})
