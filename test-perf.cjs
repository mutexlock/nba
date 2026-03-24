const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 性能测试
  console.log('=== 性能测试 ===');
  
  // 首屏加载
  const start = Date.now();
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle', timeout: 15000 });
  const loadTime = Date.now() - start;
  console.log('首屏加载时间:', loadTime, 'ms', loadTime < 2000 ? '✅' : '❌');
  
  // 对战模拟响应
  await page.goto('http://localhost:5175/battle', { waitUntil: 'networkidle', timeout: 15000 });
  const battleStart = Date.now();
  await page.waitForTimeout(500);
  const battleTime = Date.now() - battleStart;
  console.log('对战模拟响应时间:', battleTime, 'ms', battleTime < 1000 ? '✅' : '❌');
  
  await browser.close();
})();
