const { test, expect } = require('@playwright/test');

// See here how to get started:
// https://playwright.dev/docs/intro
test('should display the Reports component initially', async ({ page }) => {
  await page.goto('http://localhost:3001');
  const reportsComponent = await page.$('header');
  expect(reportsComponent).not.toBeNull();
})
