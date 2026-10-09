import { expect, test } from '@playwright/test'

test('gallery photos open in an accessible viewer and return focus to the photo', async ({ page }) => {
  await page.goto('/')
  const gallery = page.locator('#gallery')
  const firstPhoto = gallery.getByRole('button', { name: /View photo:/ }).first()
  await firstPhoto.scrollIntoViewIfNeeded()
  await firstPhoto.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const closeButton = dialog.getByRole('button', { name: 'Close photo viewer' })
  await expect(closeButton).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(firstPhoto).toBeFocused()

  await gallery.getByRole('button', { name: 'Friends', exact: true }).click()
  await expect(gallery.getByRole('button', { name: 'Friends', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(gallery.getByRole('button', { name: 'View photo: Friends sitting together by the water with their arms around one another' })).toBeVisible()
  const friendPhotos = gallery.getByRole('button', { name: /View photo:/ })
  await expect(friendPhotos).toHaveCount(1)
  const imageHeights = await friendPhotos.locator('img').evaluateAll((images) =>
    images.map((image) => image.getBoundingClientRect().height),
  )
  expect(Math.max(...imageHeights) - Math.min(...imageHeights)).toBeLessThan(1)

  await gallery.getByRole('button', { name: 'All', exact: true }).click()
  const allPhotos = gallery.getByRole('button', { name: /View photo:/ })
  await expect(allPhotos).toHaveCount(9)
  expect((await allPhotos.allInnerTexts()).map((text) => text.split('\n')[0].trim())).toEqual([
    'Ceremony',
    'Bride',
    'Groom',
    'Family',
    'Friends',
    'Couple',
    'Celebration',
    'Details',
    'Venue',
  ])
  await expect(gallery.getByRole('button', { name: 'Behind the Scenes', exact: true })).toHaveCount(0)
})

test('curated gallery stays aligned and responsive at supported viewport widths', async ({ page }) => {
  const browserErrors: string[] = []
  page.on('pageerror', (error) => browserErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text())
  })

  await page.goto('/')
  const gallery = page.locator('#gallery')
  await gallery.getByRole('button', { name: 'All', exact: true }).click()
  await gallery.locator('img').evaluateAll((images) => {
    images.forEach((image) => { image.loading = 'eager' })
  })
  await expect.poll(() => gallery.locator('img').evaluateAll((images) =>
    images.every((image) => image.complete && image.naturalWidth > 0),
  )).toBe(true)

  for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 })
    const photos = gallery.getByRole('button', { name: /View photo:/ })
    await expect(photos).toHaveCount(9)

    const layout = await photos.evaluateAll((buttons) => {
      const cards = buttons.map((button) => {
        const rect = button.getBoundingClientRect()
        const image = button.querySelector('img')
        const imageRect = image?.getBoundingClientRect()
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          imageWidth: imageRect?.width ?? 0,
          imageHeight: imageRect?.height ?? 0,
          objectFit: image ? getComputedStyle(image).objectFit : '',
          loaded: Boolean(image?.naturalWidth),
        }
      })
      return {
        viewportWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        cards,
      }
    })

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.cards.every((card) => card.loaded)).toBe(true)
    expect(layout.cards.every((card) => card.objectFit === 'cover')).toBe(true)
    expect(layout.cards.every((card) => card.imageWidth > 0 && card.imageHeight > 0)).toBe(true)
    expect(layout.cards.every((card) => Math.abs(card.imageWidth / card.imageHeight - 1.5) < 0.01)).toBe(true)
    expect(layout.cards.every((card) => card.left >= 0 && card.right <= width)).toBe(true)
    if (width < 768) {
      expect(layout.cards.every((card, index, cards) => index === 0 || card.top > cards[index - 1].top)).toBe(true)
    } else {
      const sortedCards = [...layout.cards].sort((left, right) => left.top - right.top || left.left - right.left)
      expect(sortedCards.slice(0, 3).every((card) => Math.abs(card.top - sortedCards[0].top) < 1)).toBe(true)
      expect(sortedCards.slice(3, 6).every((card) => Math.abs(card.top - sortedCards[3].top) < 1)).toBe(true)
      expect(sortedCards.slice(6, 9).every((card) => Math.abs(card.top - sortedCards[6].top) < 1)).toBe(true)
    }

    for (let index = 0; index < layout.cards.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < layout.cards.length; nextIndex += 1) {
        const current = layout.cards[index]
        const next = layout.cards[nextIndex]
        const overlapX = current.left < next.right && next.left < current.right
        const overlapY = current.top < next.bottom && next.top < current.bottom
        expect(overlapX && overlapY).toBe(false)
      }
    }
  }

  expect(browserErrors).toEqual([])
})

test('celebration statuses follow the wedding timezone and configured ceremony dates', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-12-16T04:30:00.000Z') })
  await page.goto('/')

  const schedule = page.locator('#wedding-day')
  await expect(schedule.getByText('Today', { exact: true })).toBeVisible()
  await expect(schedule.getByText('Upcoming', { exact: true }).first()).toBeVisible()
  await expect(schedule.getByText('Haldi', { exact: true })).toBeVisible()
  const sangeetPosition = await schedule.getByText('Sangeet', { exact: true }).evaluate((element) =>
    element.closest('div.overflow-hidden')?.getBoundingClientRect().left ?? -1,
  )
  const dancingSession = schedule.getByText('Dancing Session', { exact: true })
  const dancingCard = schedule.locator('div.overflow-hidden').filter({ hasText: 'Dancing Session' })
  await expect(dancingSession).toBeVisible()
  await expect(dancingCard).toContainText('After Sangeet')
  const dancingPosition = await dancingSession.evaluate((element) =>
    element.closest('div.overflow-hidden')?.getBoundingClientRect().left ?? -1,
  )
  expect(dancingPosition).toBeGreaterThan(sangeetPosition)

  await page.clock.setFixedTime(new Date('2026-12-20T06:00:00.000Z'))
  await page.reload()
  await expect(page.locator('#wedding-day').getByText('Completed', { exact: true }).first()).toBeVisible()
})

test('quick access links work and the passcode preview is not presented as secure', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('This preview does not yet include a scannable QR code.')).toBeVisible()
  await page.getByRole('link', { name: /RSVP.*Let us know you’re coming/ }).click()
  await expect(page).toHaveURL(/#rsvp$/)

  await page.getByLabel('Demo passcode').fill('incorrect')
  await page.getByRole('button', { name: 'Unlock' }).click()
  await expect(page.getByText(/did not match/)).toBeVisible()

  await page.getByLabel('Demo passcode').fill('forever')
  await page.getByRole('button', { name: 'Unlock' }).click()
  await expect(page.getByText(/This is a visual preview only/)).toBeVisible()
  await expect(page.getByText(/not private or saved/)).toBeVisible()
})
