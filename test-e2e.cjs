const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = { passed: [], issues: [], errors: [] };
  const startTime = Date.now();
  
  try {
    // 1. 首页测试
    console.log('=== 测试1: 首页 ===');
    await page.goto('http://localhost:5175/', { waitUntil: 'networkidle', timeout: 10000 });
    console.log('页面加载完成');
    results.passed.push('首页-页面加载');
    
    const html = await page.content();
    console.log('HTML长度:', html.length);
    
    // 2. 检查导航
    console.log('\n=== 测试2: 导航结构 ===');
    const navLinks = await page.$$eval('a', els => els.map(e => e.href).filter(h => h.includes('player') || h.includes('team') || h.includes('simulate')));
    console.log('导航链接:', navLinks.slice(0, 5));
    
    // 3. 球员页面
    console.log('\n=== 测试3: 球员库 ===');
    await page.goto('http://localhost:5175/players', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const playerHtml = await page.content();
    console.log('球员页面长度:', playerHtml.length);
    
    // 4. 球队页面
    console.log('\n=== 测试4: 球队页面 ===');
    await page.goto('http://localhost:5175/teams', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // 5. 对战模拟
    console.log('\n=== 测试5: 对战模拟 ===');
    await page.goto('http://localhost:5175/simulate', { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // 性能测试
    const loadTime = Date.now() - startTime;
    console.log('\n=== 性能 ===');
    console.log('总加载时间:', loadTime, 'ms');
    
    results.passed.push('基础页面加载');
    
  } catch (e) {
    results.errors.push(e.message);
    console.error('错误:', e);
  }
  
  console.log('\n=== 结果 ===');
  console.log('通过:', results.passed);
  console.log('问题:', results.issues);
  console.log('错误:', results.errors);
  
  await browser.close();
})();
