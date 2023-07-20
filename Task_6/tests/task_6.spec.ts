import { test } from '@playwright/test'
import { LandingPage } from '../pages/landingPage'
import { ActionPage } from '../pages/actionPage'
import {SupportUtil} from '../utils/supportUtil'
import { NewAndTrendingPage } from '../pages/newAndTrending'
import { GamePage } from '../pages/gamePage'
import { InstallSteamPage } from '../pages/installSteamPage'

test('Task_6', async ({page}) => {
  await page.pause()
  const landingPage = new LandingPage(page)
  const actionPage = new ActionPage(page)
  const newAndTrending = new NewAndTrendingPage(page)
  const gamePage = new GamePage(page)
  const installSteamPage = new InstallSteamPage(page)

  await test.step('Visit Landing page', async () => {
    await landingPage.goTo()
  })

  await test.step('Click Action', async () => {
    await landingPage.clickCategory('Action')
  })

  await test.step('Game selection based on given conditions', async () => {
    await SupportUtil.Scroll(page)
    await actionPage.newAndTrending.click()
    await newAndTrending.gameSelection()
    await actionPage.newAndTrending.isVisible()
  })
 
  await test.step('Checking game price and discount', async () => {
    //
  })

  await test.step('Click Steam button', async () => {
    await gamePage.installSteamBtn.click()
  })
  
  await test.step('Downloading the setup file', async () => {
    await installSteamPage.downloadSteam()
  })

})

