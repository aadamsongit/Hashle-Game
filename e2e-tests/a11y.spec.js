import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('has no accessibility violations in a real browser', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.getbyRole('heading', { level: 1, name: 'Hashle' }).tobeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toHaveLength(0);
  });
});