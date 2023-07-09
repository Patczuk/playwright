import { test } from '@playwright/test'
import { LandingPage } from '../pages/landingPage'

test('Task_6', async ({page}) => {
  const landingPage = new LandingPage(page)

  await test.step('Visit Landing page', async () => {
    await landingPage.goTo()
  })

  // await test.step('Visit Landing page', async () => {
  //   await landingPage.goTo()
  // })

 
})
