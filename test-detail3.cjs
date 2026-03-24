const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5175/players/magic-johnson', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);
  
  const root = await page.$eval('#root', el => el.innerHTML);
  console.log('Root内容:', root.slice(0, 2000));
  
  await browser.close();
})();
