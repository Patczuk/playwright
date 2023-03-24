const { test, expect } = require('@playwright/test');

test('task_1', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(page).toHaveTitle(/Onlíner/); // check title
  //await expect(page.locator('b-main-navigation__text :text("Каталог")')).toHaveCount(1); // by CSS
  await expect(page.locator("//input[@name='query']")).toHaveCount(1); // by XPATH
  await expect(page.getByPlaceholder('Поиск в Каталоге.')).toHaveCount(1); // by placeholder
  await expect(page.getByRole('listitem').filter({ has: page.getByText('Мыши') })).toHaveCount(1); //filter by another locator
  // await expect(page.getByText('наши соцсети')).toBeVisible(); // filter by text
  //локатор, который вернёт список элементов
  //n-й элемент из списка
});
