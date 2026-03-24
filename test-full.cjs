const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const results = { passed: [], failed: [], errors: [] };
  
  // 1. 首页测试
  console.log('=== 测试1: 首页 ===');
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const homeContent = await page.content();
  if (homeContent.includes('1996芝加哥公牛') && homeContent.includes('2017金州勇士')) {
    results.passed.push('首页-显示经典球队');
  } else {
    results.failed.push('首页-未显示经典球队');
  }
  
  // 2. 球员库测试
  console.log('=== 测试2: 球员库 ===');
  await page.goto('http://localhost:5175/players', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const playersContent = await page.content();
  if (playersContent.includes('魔术师') || playersContent.includes('LeBron') || playersContent.includes('库里')) {
    results.passed.push('球员库-显示球员列表');
  } else {
    results.failed.push('球员库-未显示球员列表');
  }
  
  // 搜索功能
  const searchInput = await page.$('input[placeholder*="搜索"], input[type="search"]');
  if (searchInput) {
    await searchInput.fill('LeBron');
    await page.waitForTimeout(1000);
    const searchContent = await page.content();
    if (searchContent.includes('勒布朗') || searchContent.includes('LeBron')) {
      results.passed.push('球员库-搜索功能');
    } else {
      results.failed.push('球员库-搜索无结果');
    }
  }
  
  // 3. 球员详情
  console.log('=== 测试3: 球员详情 ===');
  await page.goto('http://localhost:5175/player/magic-johnson', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const detailContent = await page.content();
  if (detailContent.includes('魔术师') || detailContent.includes('Magic')) {
    results.passed.push('球员详情-显示球员信息');
  } else {
    results.failed.push('球员详情-未显示');
  }
  
  // 4. 球队页面
  console.log('=== 测试4: 球队页面 ===');
  await page.goto('http://localhost:5175/teams', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const teamsContent = await page.content();
  if (teamsContent.includes('公牛') || teamsContent.includes('Lakers') || teamsContent.includes('Warriors')) {
    results.passed.push('球队页面-显示球队列表');
  } else {
    results.failed.push('球队页面-未显示球队');
  }
  
  // 5. 对战模拟
  console.log('=== 测试5: 对战模拟 ===');
  await page.goto('http://localhost:5175/battle', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(2000);
  
  const battleContent = await page.content();
  if (battleContent.includes('选择') || battleContent.includes('球队')) {
    results.passed.push('对战模拟-页面可访问');
  } else {
    results.failed.push('对战模拟-页面异常');
  }
  
  // 6. 边界测试 - 搜索无结果
  console.log('=== 测试6: 边界测试 ===');
  await page.goto('http://localhost:5175/players', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1000);
  
  const emptySearchInput = await page.$('input[placeholder*="搜索"], input[type="search"]');
  if (emptySearchInput) {
    await emptySearchInput.fill('xyznotexist123');
    await page.waitForTimeout(1000);
    const emptyContent = await page.content();
    if (emptyContent.includes('空') || emptyContent.includes('无') || emptyContent.includes('没有')) {
      results.passed.push('边界-搜索无结果显示空状态');
    } else {
      results.failed.push('边界-搜索无结果未处理');
    }
  }

  console.log('\n=== 测试结果 ===');
  console.log('✅ 通过:', results.passed.length);
  console.log('❌ 失败:', results.failed.length);
  console.log('\n通过项:', results.passed);
  console.log('\n失败项:', results.failed);
  
  await browser.close();
})();
