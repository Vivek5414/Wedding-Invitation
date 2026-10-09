import { expect, test } from '@playwright/test'

test('ceremony navigation and photo viewer work from the keyboard without browser errors', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('pageerror', (error) => browserErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text())
  })

  await page.goto('/')

  const haldiTab = page.locator('#ceremony-tab-haldi')
  await haldiTab.focus()
  await page.keyboard.press('ArrowRight')
  const mehndiTab = page.locator('#ceremony-tab-mehndi')
  await expect(mehndiTab).toHaveAttribute('aria-selected', 'true')

  const photoButton = page.locator('#ceremony-panel-mehndi').getByRole('button', { name: /View photo:/ }).first()
  await photoButton.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Close photo viewer' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(photoButton).toBeFocused()

  expect(browserErrors).toEqual([])
})
