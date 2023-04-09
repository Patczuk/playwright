const { test, expect } = require('@playwright/test');

test('task_2 part_1', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form/');
  //await page.pause(); // using for debug

  await page.waitForTimeout(2000);

  await expect(page).toHaveTitle(/DEMOQA/); // check title

  await page.locator('id=firstName').fill('Misha'); // locator.fill()
  await expect(page.locator('id=firstName')).toHaveValue('Misha'); // check the input value 'Misha'

  //await page.locator('id=gender-radio-1').check(); // locator.check()
  //await expect(page.locator('id=gender-radio-1')).toBeChecked(); // verify that radio button is marked

  //await page.locator('id=react-select-3-input').click();
  //await page.locator('xpath=//div[text()="select state"]').click();
  //await page.locator("//[@class='css-1uccc91-singleValue']").selectOption('Haryana'); // locator.selectOption()

  //await page.locator('id=hobbies-checkbox-1').check(); //locator.click()
  //await expect(page.locator('id=hobbies-checkbox-1')).toBeChecked(); // // verify that radio button is marked
});
