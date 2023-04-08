const { test, expect } = require('@playwright/test');

test('task_2', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form/');

  await page.waitForTimeout(2000);

  await expect(page).toHaveTitle(/DEMOQA/); // check title

  await page.locator('id=firstName').fill('Misha'); // locator.fill()
  await expect(page.locator('id=firstName')).toHaveValue('Misha'); // check the input value 'Misha'

  await page.locator('id=gender-radio-1').check(); // locator.click()
  await expect(page.locator('id=gender-radio-1')).toBeChecked(); // verify that radio button is clicked
  // locator.selectOption()
});
