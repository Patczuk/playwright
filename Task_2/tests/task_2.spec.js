const { test, expect } = require('@playwright/test');

test('task_2 part_1', async ({ page }) => {
  await page.goto('https://demoqa.com/automation-practice-form/');
  //await page.pause(); // using for debug

  //await page.waitForTimeout(2000);

  await expect(page).toHaveTitle(/DEMOQA/); // check title

  await page.locator('id=firstName').fill('Misha'); // locator.fill()
  await expect(page.locator('id=firstName')).toHaveValue('Misha'); // check the input value 'Misha'

  await page.locator('id=lastName').press('P'); // locator.press()
  await expect(page.locator('id=lastName')).toHaveValue('P'); // check the input value 'P'

  const male = page.locator('id=gender-radio-1'); // Male radio button
  await male.evaluateHandle((input) => input.click()); // locator.click()
  await expect(male).toBeChecked(); // male radio button is marked

  // Пример с использованием в точности документации PW - не работает
  //await page.getByLabel('Sports').check();
  //expect(await page.getByLabel('Sports').isChecked()).toBeTruthy();

  /*const sports = page.locator('#hobbies-checkbox-1'); //sports checkbox
  await sports.check(); //locator.check()
  await expect(male).toBeChecked(); //sports checkbox is marked*/

  await page.click('//div[text()="Select State"]');
  await page.locator('//div[@class="css-11unzgr"]').focus();
  await page.locator('#css-11unzgr').selectOption({ value: 'NCR' }); // locator.selectOption()
  await expect(page.locator('#css-1uccc91-singleValue')).toHaveValue('NCR');
});

test('task_2 part_2 - hover', async ({ page }) => {
  await page.goto('https://demoqa.com/menu#/');

  await page.locator('xpath=//a[contains(text(),"Main Item 2")]').hover(); // locator.hover()
  await expect(page.locator('(//ul[@id="nav"]//a)[3]')).toBeVisible(); // element is visible
});

test('task_2 part_3 - setInputFiles', async ({ page }) => {
  await page.goto('https://demoqa.com/upload-download/');

  await page.waitForSelector('#uploadFile'); // ожидание появления элемента на странице
  await page.locator('#uploadFile').setInputFiles('Misha.txt'); // locator.setInputFiles()
  await expect(page.locator('#uploadedFilePath')).toBeVisible(); // verify that the file was uploaded
});

test('task_2 part_4 - drag & drop', async ({ page }) => {
  await page.goto('https://demoqa.com/droppable/');

  await page.locator('id=draggable').dragTo(page.locator('(//div[@id="droppable"])[1]')); // - drag & drop
  await expect(page.getByText('Dropped')).toBeVisible(); // verify that the element was dragged
});
