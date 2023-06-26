export class RouteUtil {
  
  static async PageRoute(page, pageRouteUrl, cheatPages) {
    await page.route(
      pageRouteUrl,
      async (route) => {
        const response = await route.fetch()
        let body = await response.text()
        const bookBody = JSON.parse(body)
  
        body = body.replace(bookBody.pages, cheatPages) //подменяем кол-во страниц на случайное число
  
        route.fulfill({
          response,
          body,
          headers: {
            ...response.headers(),
          }
        })
      }
    )
   }

  static async WaitResponse(response, page, bookStoreUrl, bookStoreBtn) {
    response = await Promise.all([
      page.waitForResponse(
        (resp) =>
          resp.url().includes(bookStoreUrl) &&
          resp.request().method() === 'GET'
      ),
     bookStoreBtn.click() //в меню слева кликнуть Book Store
    ])
    return response
   }

   static async BlockImages(page) {
    page.route('**/*.{png,jpg,jpeg,webp,gif,svg}', (route) =>
      route.abort()
    )
   }
}