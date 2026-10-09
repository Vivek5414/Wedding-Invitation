import { expect, test } from '@playwright/test'

const ceremonies = ['haldi', 'mehndi', 'sangeet', 'wedding', 'reception']

test('each ceremony tab selects its own details and photography', async ({ page }) => {
  await page.goto('/')

  for (const id of ceremonies) {
    const tab = page.locator(`#ceremony-tab-${id}`)
    await tab.click()
    await expect(tab).toHaveAttribute('aria-selected', 'true')
    const panel = page.locator(`#ceremony-panel-${id}`)
    await expect(panel).toBeVisible()
    await expect(panel.locator('h3').first()).toBeVisible()
    await expect(panel.locator('dt').filter({ hasText: 'Venue' }).first()).toBeVisible()
    await expect(panel.locator('img').first()).toHaveAttribute('src', /^(https:\/\/|\/images\/)/)
    await expect(panel.getByRole('button', { name: /View photo:/ }).first()).toBeVisible()
  }

  const activePanel = page.locator('#ceremony-panel-reception')
  await activePanel.getByRole('button', { name: /View photo:/ }).first().click()
  const lightbox = page.getByRole('dialog')
  await expect(lightbox).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(lightbox).toHaveCount(0)
})

test('ceremony experience fits mobile widths without document overflow', async ({ page }) => {
  await page.goto('/')
  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 844 })
    await page.locator('#ceremony-experience').scrollIntoViewIfNeeded()
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
    }))
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  const tabs = page.locator('#ceremony-experience [role="tablist"]')
  await tabs.evaluate((element) => { element.scrollLeft = element.scrollWidth })
  const mehndiTab = page.locator('#ceremony-tab-mehndi')
  await mehndiTab.evaluate((element) => element.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' }))
  await mehndiTab.click()
  await expect(page.locator('#ceremony-panel-mehndi')).toBeVisible()
})
