export class CookiesUtil {
  
  static async GetCookieValue(page, cookieName) {
    const cookies = await page.context().cookies()
    const userCookie = cookies.find((c) => c.name === cookieName)
    return userCookie ? userCookie.value : null
   }
}