const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function main() {
  console.log('Capturing 3D Roadmap screenshot...');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1520, height: 960 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  // 1. Go to app
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 2. Login as student
  const studentBtn = page.locator('button:has-text("Student")').first();
  if (await studentBtn.count()) {
    await studentBtn.click();
    await page.waitForTimeout(400);
  }
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(2000);

  // 3. Go to Preparation & progress -> Roadmap
  const prepNavBtn = page.locator('button:has-text("Preparation & progress")');
  if (await prepNavBtn.count()) {
    await prepNavBtn.click();
    await page.waitForTimeout(1000);
  }

  const roadmapTab = page.locator('#diagnostic-tab-roadmap');
  if (await roadmapTab.count()) {
    await roadmapTab.click();
    await page.waitForTimeout(1500);
  }

  // Scroll to 3D canvas
  const canvas3d = page.locator('.roadmap-3d-viewport-container');
  if (await canvas3d.count()) {
    await canvas3d.scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000); // allow Three.js textures & scene to render

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'fig4_3d_zigzag_mountain_roadmap.png'),
      fullPage: false,
    });
    console.log('Saved fig4_3d_zigzag_mountain_roadmap.png');

    // Click milestone 2 to trigger walking along curve
    const milestone2Btn = page.locator('button.hud-milestone-item:has-text("Build Projects")');
    if (await milestone2Btn.count()) {
      await milestone2Btn.click();
      console.log('Clicked milestone 2 - walking in progress...');
      await page.waitForTimeout(1200); // capture mid-walk
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'fig4b_3d_walking_character_motion.png'),
        fullPage: false,
      });
      console.log('Saved fig4b_3d_walking_character_motion.png');
    }
  }

  await browser.close();
  console.log('3D Roadmap screenshots completed successfully!');
}

main().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
