import { test } from '@playwright/test'
import { LandingPage } from '../pages/landingPage'
import { ActionPage } from '../pages/actionPage'
import {SupportUtil} from '../utils/supportUtil'

test('Task_6', async ({page}) => {
  await page.pause()
  const landingPage = new LandingPage(page)
  const actionPage = new ActionPage(page)

  await test.step('Visit Landing page', async () => {
    await landingPage.goTo()
  })

  await test.step('Click Action', async () => {
    await landingPage.clickCategory('Action')
  })

  await test.step('Game selection based on given conditions', async () => {
    await SupportUtil.Scroll(page)
    await actionPage.newAndTrending.click()
  })
 
})
