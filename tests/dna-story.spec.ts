import { expect, test } from '@playwright/test'

test('Wedding DNA selection persists and updates its profile', async ({ page }) => {
  await page.goto('/')
  const palette = page.locator('#dna').getByRole('button', { name: /Sage/ })

  await palette.click()
  await expect(palette).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#dna aside')).toContainText('Botanical green & soft peach')

  await page.reload()
  await expect(page.locator('#dna').getByRole('button', { name: /Sage/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#dna aside')).toContainText('Botanical green & soft peach')
})

test('love story reveals the heading word by word and its timeline is selectable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const heading = page.locator('#journey-heading')
  await heading.scrollIntoViewIfNeeded()

  const words = heading.locator('span')
  await expect.poll(async () => {
    const opacity = await words.evaluateAll((elements) => elements.map((element) => Number(getComputedStyle(element).opacity)))
    return opacity[0] > opacity[1] && opacity[1] < 1
  }, { timeout: 6000 }).toBe(true)
  await expect.poll(async () => Number(await words.nth(5).evaluate((element) => getComputedStyle(element).opacity)), { timeout: 6000 }).toBe(1)
  await expect(heading).toHaveText(/One little moment\s*led us here\./)

  const timeline = page.getByRole('navigation', { name: 'Wedding story milestones' })
  const lastMilestone = timeline.getByRole('button').last()
  await lastMilestone.click()
  await expect(lastMilestone).toHaveAttribute('aria-current', 'step')
  await expect(page.getByRole('heading', { name: 'Forever' })).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(page.locator('#journey-heading span')).toHaveCount(6)
  await expect.poll(async () => page.locator('#journey-heading span').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).opacity === '1'))).toBe(true)
})
