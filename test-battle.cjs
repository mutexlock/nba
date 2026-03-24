const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 对战模拟测试
  console.log('=== 对战模拟测试 ===');
  await page.goto('http://localhost:5175/battle', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  // 点击选择球队
  const teamButtons = await page.$$('button, select, [class*="select"]');
  console.log('找到交互元素:', teamButtons.length);
  
  // 检查页面内容
  const content = await page.content();
  console.log('页面包含对战相关内容:', content.includes('对战') || content.includes('选择球队'));
  
  // 检查球员详情
  console.log('\n=== 球员详情测试 ===');
  await page.goto('http://localhost:5175/player/1', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  const detailContent = await page.content();
  console.log('球员详情页内容长度:', detailContent.length);
  console.log('包含球员关键词:', detailContent.includes('球员') || detailContent.includes('能力'));
  
  await browser.close();
})();
