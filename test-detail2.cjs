const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 使用正确的路由
  await page.goto('http://localhost:5175/players/magic-johnson', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  console.log('内容包含:', content.slice(0, 500));
  
  await browser.close();
})();
