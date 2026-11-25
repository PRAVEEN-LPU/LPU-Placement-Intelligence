const { chromium } = require('@playwright/test');
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function main() {
  console.log('Capturing Clean Zigzag Highway screenshot...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  // 1. Go to app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // 2. Login as student
  const studentBtn = page.locator('button:has-text("Student")').first();
  if (await studentBtn.count()) {
    await studentBtn.click();
    await page.waitForTimeout(300);
  }
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(1800);

  // 3. Go to Preparation & progress -> Roadmap
  const prepNavBtn = page.locator('button:has-text("Preparation & progress")');
  if (await prepNavBtn.count()) {
    await prepNavBtn.click();
    await page.waitForTimeout(800);
  }

  const roadmapTab = page.locator('#diagnostic-tab-roadmap');
  if (await roadmapTab.count()) {
    await roadmapTab.click();
    await page.waitForTimeout(1200);
  }

  // Scroll to highway container
  const highwaySection = page.locator('.highway-clean-container');
  if (await highwaySection.count()) {
    await highwaySection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'fig4_clean_zigzag_highway.png'),
      fullPage: false,
    });
    console.log('Saved fig4_clean_zigzag_highway.png');

    // Click Stop 2 tick button to trigger walking character motion
    const stop2TickBtn = page.locator('#checkpoint-2 .btn-clean-tick');
    if (await stop2TickBtn.count()) {
      await stop2TickBtn.click();
      console.log('Clicked Stop 2 tick - character walking along highway...');
      await page.waitForTimeout(900); // capture mid-stride walking

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'fig4b_walking_student_in_action.png'),
        fullPage: false,
      });
      console.log('Saved fig4b_walking_student_in_action.png');
    }
  } else {
    console.log('Error: .highway-clean-container not found');
  }

  await browser.close();
  console.log('Capture completed successfully!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
