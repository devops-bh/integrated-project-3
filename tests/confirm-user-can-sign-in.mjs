// optional: make these proper unit tests, for now I'm just automating the sign in for quickness + convienence 
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 300});
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/sign-in', );
  await page.type('#email', 'ross@ip3.com');
  await page.type('#password', 'lecturer');
  await page.click('#sign-in');
  await page.waitForNavigation();
})();