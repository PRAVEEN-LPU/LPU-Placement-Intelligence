const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('file:///C:/Users/Dell/Desktop/supervised/test_motion_path.html');
  const support = await page.evaluate(() => CSS.supports('offset-path', "path('M 0 0 L 10 10')"));
  console.log('CSS offset-path support in Chrome:', support);
  await browser.close();
})();
