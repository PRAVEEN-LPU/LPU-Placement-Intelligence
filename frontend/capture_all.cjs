const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function main() {
  console.log('Starting screenshot capture...');
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1520, height: 960 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();

  // Helper for range sliders
  const setSlider = async (selector, val) => {
    await page.evaluate(({ sel, v }) => {
      const el = document.querySelector(sel);
      if (el) {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { sel: selector, v: String(val) });
  };

  // Helper for numeric inputs
  const setNum = async (id, val) => {
    await page.evaluate(({ i, v }) => {
      const el = document.getElementById(i);
      if (el) {
        el.value = v;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { i: id, v: String(val) });
  };

  // 1. LOGIN SCREEN
  console.log('1. Loading login page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'fig0_tri_role_login.png'),
    fullPage: false,
  });
  console.log('Saved fig0_tri_role_login.png');

  // 2. LOGIN AS STUDENT
  console.log('2. Logging in as student.demo...');
  const studentBtn = page.locator('button:has-text("Student")').first();
  if (await studentBtn.count()) {
    await studentBtn.click();
    await page.waitForTimeout(400);
  }
  const submitBtn = page.locator('button[type="submit"]');
  await submitBtn.click();
  await page.waitForTimeout(2000);

  // 3. FILL ASSESSMENT FORM (7.0 CGPA, 30% comm, 50% coding, etc.)
  console.log('3. Adjusting student assessment form inputs...');
  await setSlider('#cgpa', '7.0');
  await setSlider('#coding-score', '50');
  await setSlider('#technical-score', '60');
  await setSlider('#aptitude-score', '55');
  await setSlider('#communication-score', '30');

  await setNum('projects', 1);
  await setNum('internships', 0);
  await setNum('certifications', 1);
  await setNum('backlogs', 0);

  await page.waitForTimeout(500);

  // Click submit / run diagnostic
  console.log('Submitting diagnostic form...');
  const runBtn = page.locator('button:has-text("Run Placement Diagnostic"), button[type="submit"]:has-text("Diagnostic"), button:has-text("Analyze")').first();
  if (await runBtn.count()) {
    await runBtn.click();
  } else {
    await page.locator('form').first().locator('button[type="submit"]').click();
  }
  await page.waitForTimeout(2500);

  // Capture student needs focus profile with readiness gauge
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, 'fig1_student_needs_focus.png'),
    fullPage: false,
  });
  console.log('Saved fig1_student_needs_focus.png');

  // Also capture the skill gap matrix on this tab
  const gapSection = page.locator('#diagnostic-panel, .results-container').first();
  if (await gapSection.count()) {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'fig3_skill_gap_matrix.png'),
      fullPage: false,
    });
    console.log('Saved fig3_skill_gap_matrix.png');
  }

  // 4. NAVIGATE TO ROADMAP SECTION
  console.log('4. Navigating to Preparation & progress -> Action Roadmap...');
  const prepNavBtn = page.locator('button:has-text("Preparation & progress")');
  if (await prepNavBtn.count()) {
    await prepNavBtn.click();
    await page.waitForTimeout(1000);
  }

  const roadmapTab = page.locator('#diagnostic-tab-roadmap');
  if (await roadmapTab.count()) {
    await roadmapTab.click();
    await page.waitForTimeout(1000);
  }

  // Scroll to roadmap
  const roadmapSection = page.locator('.road-master-wrapper');
  if (await roadmapSection.count()) {
    await roadmapSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'fig4_animated_highway_roadmap.png'),
      fullPage: false,
    });
    console.log('Saved fig4_animated_highway_roadmap.png');

    // 5. TRIGGER WALKING MAN
    console.log('5. Clicking stoppage tick to trigger walking man...');
    const tickBtn = page.locator('.btn-stoppage-tick').nth(1); // Click second stop
    if (await tickBtn.count()) {
      await tickBtn.click();
      await page.waitForTimeout(600); // Capture walking man while active
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'fig4b_walking_man_animation.png'),
        fullPage: false,
      });
      console.log('Saved fig4b_walking_man_animation.png');
    }
  } else {
    console.log('Warning: .road-master-wrapper not found');
  }

  // 6. MENTOR WORKSPACE
  console.log('6. Switching to Mentor Workspace...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const signOutBtn = page.locator('button:has-text("Sign out")');
  if (await signOutBtn.count()) {
    await signOutBtn.click();
    await page.waitForTimeout(1200);
  }

  const mentorRoleBtn = page.locator('button:has-text("Mentor / Faculty")');
  if (await mentorRoleBtn.count()) {
    await mentorRoleBtn.click();
    await page.waitForTimeout(400);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'fig5_mentor_cohort_roster.png'),
      fullPage: false,
    });
    console.log('Saved fig5_mentor_cohort_roster.png');

    // Mentee drilldown if row exists
    const drilldownRow = page.locator('tr:has-text("Demo Student"), tr:has-text("student")').first();
    if (await drilldownRow.count()) {
      await drilldownRow.click();
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'fig6_mentor_mentee_drilldown.png'),
        fullPage: false,
      });
      console.log('Saved fig6_mentor_mentee_drilldown.png');
    }
  }

  // 7. ADMIN WORKSPACE
  console.log('7. Switching to Admin Workspace...');
  const signOutBtn2 = page.locator('button:has-text("Sign out")');
  if (await signOutBtn2.count()) {
    await signOutBtn2.click();
    await page.waitForTimeout(1200);
  }

  const adminRoleBtn = page.locator('button:has-text("Placement Admin")');
  if (await adminRoleBtn.count()) {
    await adminRoleBtn.click();
    await page.waitForTimeout(400);
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2500);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'fig7_admin_placement_pipeline.png'),
      fullPage: false,
    });
    console.log('Saved fig7_admin_placement_pipeline.png');

    // Model monitoring tab
    const modelMonitoringTab = page.locator('button:has-text("Model Monitoring"), button:has-text("Registry"), [role="tab"]:has-text("Model")').first();
    if (await modelMonitoringTab.count()) {
      await modelMonitoringTab.click();
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'fig8_admin_model_monitoring.png'),
        fullPage: false,
      });
      console.log('Saved fig8_admin_model_monitoring.png');
    }
  }

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
