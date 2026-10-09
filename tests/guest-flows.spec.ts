import { expect, test } from '@playwright/test'

test('RSVP validates inputs and submits the guest summary', async ({ page }) => {
  await page.goto('/')
  await page.locator('#rsvp').scrollIntoViewIfNeeded()

  await page.getByRole('button', { name: /Yes/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('alert')).toContainText('Please enter your name')

  await page.getByLabel('Guest name').fill('Audit Guest')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Number of guests').fill('11')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('alert')).toContainText('between 1 and 10')

  await page.getByLabel('Number of guests').fill('2')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Vegan' }).click()
  await page.getByRole('button', { name: 'Mehendi' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('Message for the couple').fill('Looking forward to celebrating!')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('#rsvp')).toContainText('Audit Guest')
  await expect(page.locator('#rsvp')).toContainText('Mehendi')
  await page.getByRole('button', { name: 'Submit RSVP' }).click()
  await expect(page.getByText('Thank you for celebrating with us.')).toBeVisible()
})

test('wedding assistant responds to arrival question and post-wedding mode switches', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Ask Our Wedding Assistant' }).click()
  const question = page.getByPlaceholder('Where is the wedding?')
  await question.fill('When should I arrive?')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(question).toHaveValue('')
  await expect(page.getByText(/arriving by 6:30 PM/)).toBeVisible()

  await page.getByRole('button', { name: 'Post-wedding' }).click()
  await expect(page.getByText('Wedding Memories')).toBeVisible()
  await expect(page.getByText('Guest Wishes')).toBeVisible()
})

test('music starts on user interaction and synchronizes pause and resume', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('wedding-player-state', 'paused')
    const original = window.AudioContext
    const instrumented = window as Window & { auditAudioContexts?: AudioContext[]; auditOscillatorCount?: number }
    instrumented.auditAudioContexts = []
    instrumented.auditOscillatorCount = 0
    window.AudioContext = new Proxy(original, {
      construct(target, args) {
        const context = Reflect.construct(target, args) as AudioContext
        const createOscillator = context.createOscillator.bind(context)
        context.createOscillator = () => {
          instrumented.auditOscillatorCount = (instrumented.auditOscillatorCount ?? 0) + 1
          return createOscillator()
        }
        instrumented.auditAudioContexts?.push(context)
        return context
      },
    })
  })
  await page.goto('/')
  await page.getByRole('link', { name: 'Enter our story' }).click()

  await expect.poll(() => page.evaluate(() => (window as Window & { auditAudioContexts?: AudioContext[] }).auditAudioContexts?.[0]?.state)).toBe('running')
  await expect.poll(() => page.evaluate(() => (window as Window & { auditOscillatorCount?: number }).auditOscillatorCount)).toBeGreaterThan(0)
  const playerButton = page.locator('[data-music-player] button')
  await expect(playerButton).toHaveAttribute('aria-label', 'Pause music')
  await playerButton.click()
  await expect(playerButton).toHaveAttribute('aria-label', 'Play music')
  await expect.poll(() => page.evaluate(() => (window as Window & { auditAudioContexts?: AudioContext[] }).auditAudioContexts?.[0]?.state)).toBe('suspended')
  await expect(page.locator('[data-music-player] [role="status"]')).toBeEmpty()
  await playerButton.click()
  await expect(playerButton).toHaveAttribute('aria-label', 'Pause music')
  await expect.poll(() => page.evaluate(() => (window as Window & { auditAudioContexts?: AudioContext[] }).auditAudioContexts?.length)).toBe(1)
})

test('music playback stays exclusive and pause synchronizes across open tabs', async ({ browser }) => {
  const context = await browser.newContext()
  const firstPage = await context.newPage()
  const secondPage = await context.newPage()
  await firstPage.addInitScript(() => localStorage.setItem('wedding-player-state', 'paused'))
  await firstPage.goto('/')
  await secondPage.goto('/')

  const firstControl = firstPage.locator('[data-music-player] button')
  const secondControl = secondPage.locator('[data-music-player] button')
  await firstControl.click()
  await expect(firstControl).toHaveAttribute('aria-label', 'Pause music')
  await expect(secondControl).toHaveAttribute('aria-label', 'Play music')

  await secondControl.click()
  await expect(secondControl).toHaveAttribute('aria-label', 'Pause music')
  await expect(firstControl).toHaveAttribute('aria-label', 'Play music')

  await secondControl.click()
  await expect(secondControl).toHaveAttribute('aria-label', 'Play music')
  await expect(firstControl).toHaveAttribute('aria-label', 'Play music')
  await context.close()
})
