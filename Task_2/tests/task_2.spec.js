const { test, expect } = require('@playwright/test');

test('task_2', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form/');
  await expect(page).toHaveTitle(/DEMOQA/); // check title
  await page.getByPlaceholder('First Name').fill('Misha'); // locator.fill()
  //await expect(page.locator('//div[@class=]')).toHaveText('Misha'); check the input 'Misha'
  await page.locator('//label[for="hobbies-checkbox-2"].input[type="checkbox"]').check(); // locator.check()
  //await expect(page.getByTestId('gender-radio-1')).toBeChecked();
  // locator.selectOption()
});
