const { test, expect } = require('@playwright/test');

test('task_1', async ({ page }) => {
  await page.goto('https://www.onliner.by/');
  await expect(page).toHaveTitle(/Onlíner/); // check title
  await expect(page.locator('div.auth-bar__item.auth-bar__item--text')).toHaveCount(1); // by CSS кнопка "Вход"
  await expect(page.locator("//*[@title='Facebook']")).toHaveCount(1); // by XPATH Facebook button
  await expect(page.getByPlaceholder('Поиск в Каталоге.')).toHaveCount(1); // by placeholder in the search field
  await expect(page.getByRole('listitem').filter({ has: page.getByText('Мыши') })).toHaveCount(1); //filter by another locator - tab "Мыши"
  await expect(page.getByText('наши соцсети')).toHaveCount(1); // filter by text, button 'Наши соцсети'
  await expect(page.locator('//*[@class="b-main-page-news-2__forum-news-list"]/ol/li')).toHaveCount(7); //локатор, который вернёт список элементов - список самых обсуждаемых тем
  await expect(page.locator('//*[@class="b-main-navigation"]/li').locator('nth=2')).toHaveCount(1); //n-й элемент из списка - вкладка "Автобарахолка", третий элемент в списке
});
