import { expect, test } from '@playwright/test'

test('wedding website remains within requested responsive viewports and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect.poll(() => page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)

  for (const width of [320, 360, 375, 390, 414, 430, 600, 768, 820, 912, 1024, 1280, 1366, 1440, 1600, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 })
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))

    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
    expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport)
  }

  await expect(page.locator('#story')).toBeAttached()
})

test('mobile navigation opens, follows links, and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const toggle = page.locator('nav button[aria-controls="mobile-site-navigation"]')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  const menu = page.locator('#mobile-site-navigation')
  await expect(menu.getByRole('link', { name: 'Our Story' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(menu).toHaveCount(0)

  await toggle.click()
  await page.locator('#mobile-site-navigation').getByRole('link', { name: 'Our Story' }).click()
  await expect(page.locator('#story')).toBeInViewport()
  await expect(page.locator('#mobile-site-navigation')).toHaveCount(0)
})

test('Our Little World experience is no longer part of the website', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#our-little-world')).toHaveCount(0)
  await expect(page.locator('[aria-labelledby="wedding-world-exit-heading"]')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Our World' })).toHaveCount(0)
})

test('story chapters lead to the restored, matching ceremony world', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Haldi, 16 December 2026/ }).click()
  await page.locator('#story').getByRole('button', { name: 'Explore this ceremony' }).click()
  await expect(page.locator('#ceremony-experience')).toBeInViewport()
  await expect(page.locator('#ceremony-tab-haldi')).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('#ceremony-panel-haldi')).toBeVisible()
})
