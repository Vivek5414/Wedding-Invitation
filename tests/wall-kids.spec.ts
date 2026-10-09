import { expect, test } from '@playwright/test'

test('wedding wall reactions toggle and local guest messages appear', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { name: 'Share your favorite moments with us.' }).scrollIntoViewIfNeeded()
  const reaction = page.getByRole('button', { name: 'Add ❤️ reaction' }).first()

  await expect(reaction).toContainText('18')
  await reaction.click()
  const selectedReaction = page.getByRole('button', { name: 'Remove ❤️ reaction' }).first()
  await expect(selectedReaction).toHaveAttribute('aria-pressed', 'true')
  await expect(selectedReaction).toContainText('19')
  await page.getByRole('button', { name: 'Remove ❤️ reaction' }).first().click()
  await expect(page.getByRole('button', { name: 'Add ❤️ reaction' }).first()).toContainText('18')

  await page.getByRole('button', { name: 'Add your message' }).first().click()
  await page.getByLabel('Your name').fill('Audit Guest')
  await page.getByLabel('Your message').fill('We cannot wait to celebrate!')
  await page.getByRole('button', { name: 'Post locally' }).click()
  await expect(page.getByText('Audit Guest', { exact: true })).toBeVisible()
  await expect(page.getByText('We cannot wait to celebrate!')).toBeVisible()
  await expect(page.getByText(/Local preview/)).toBeVisible()
})

test('Kids Corner games complete and reset', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { name: 'The Kids’ Corner' }).scrollIntoViewIfNeeded()

  const cards = page.locator('#kids-corner article')
  await cards.nth(0).getByRole('button', { name: /Let’s play/ }).click()
  const game = page.locator('#kids-game')
  for (let index = 0; index < 12; index += 1) await game.locator('button[aria-label^="Search flower"]').first().click()
  await expect(game).toContainText('4 / 4 hearts')
  await expect(game).toContainText('You found every heart')

  await game.getByRole('button', { name: 'All games' }).click()
  await cards.nth(2).getByRole('button', { name: /Let’s play/ }).click()
  for (const moment of ['First hello', 'First trip', 'The proposal', 'Forever']) {
    await game.getByRole('button', { name: new RegExp(moment) }).click()
  }
  await expect(game).toContainText('4 / 4 moments')
  await game.getByRole('button', { name: 'Play again' }).click()
  await expect(game).toContainText('0 / 4 moments')

  await game.getByRole('button', { name: 'All games' }).click()
  await cards.nth(1).getByRole('button', { name: /Let’s play/ }).click()
  const tiles = game.locator('button[aria-pressed]')
  const pairs = new Map<string, number[]>()
  for (let index = 0; index < 12; index += 1) {
    const tile = tiles.nth(index)
    if (!await tile.isDisabled()) await tile.click()
    const face = (await tile.getAttribute('aria-label'))?.replace('Memory tile ', '') ?? ''
    pairs.set(face, [...(pairs.get(face) ?? []), index])
    await page.waitForTimeout(900)
  }
  for (const indices of pairs.values()) {
    if (indices.length !== 2) continue
    if (await tiles.nth(indices[0]).isDisabled()) continue
    await tiles.nth(indices[0]).click()
    await tiles.nth(indices[1]).click()
  }
  await expect(game).toContainText('6 / 6 pairs')
  await expect(game).toContainText('memory star')
})
