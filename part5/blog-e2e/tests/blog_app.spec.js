const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the db here
    await request.post('/api/testing/reset')
    // create a user for the backend here
    await request.post('/api/users', {
        data: {
            name: 'Craig Morley',
            username: 'morley',
            password: 'amsterdam',
        }
    })
    await request.post('/api/users', {
        data: {
            name: 'Bob',
            username: 'bob',
            password: 'bob123',
        }
    })
    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByRole('button', { name: 'log in' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'morley', 'amsterdam')
      await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()
      await expect(page.getByText('Craig Morley')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'morley', 'wrongpassword')

      const errorDiv = await page.getByTestId('notification')
      await expect(errorDiv).toContainText('Incorrect credentials')
      await expect(page.getByText('Craig Morley')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await loginWith(page, 'morley', 'amsterdam')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Bobbie and his buns','Bobbie Blue', 'www.bobbiebluethesubaru.com')

      await expect(page.getByText('Bobbie and his buns Bobbie Blue')).toBeVisible()
    })

    describe('...and a blog is created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Bobbie and his buns', 'Bobbie Blue', 'www.bobbiebluethesubaru.com')
        await createBlog(page, 'hermans hermits', 'Herman', 'www.herman.com')

      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('1')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm')
            expect(dialog.message()).toBe('delete this blog Bobbie and his buns?')
            await dialog.accept()
            await page.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'delete' }).click()

            await expect(page.getByText('Bobbie and his buns')).not.toBeVisible()
        })
      })

      test('logout and in as different user, sees no delete', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        const errorDiv = await page.getByTestId('notification')
        await expect(errorDiv).toContainText('logged out')

        await loginWith(page, 'bob', 'bob123')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      test('blogs are arranged in the order according to the likes', async ({ page }) => {
        // Checks existing blogs have been created
        await expect(page.getByText('Bobbie and his buns Bobbie')).toBeVisible()
        await expect(page.getByText('hermans hermits Hermanview')).toBeVisible()

        // Create a third blog
        await createBlog(page, 'weevil blog 1001', 'Weevil', 'www.weevil.com')
        await expect(page.getByText('weevil blog 1001 Weevilview')).toBeVisible()

        // click each view button
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'view' }).first().click()

        // Assign the value of the bobbie to a variable then get the like button
        await page.getByText('Bobbie and his bunshide').locator('..').getByRole('button', { name: 'like' }).click()
        await page.pause()
        await page.getByText('Bobbie and his bunshide').waitFor()
        await page.getByText('weevil blog 1001hide').locator('..').getByRole('button', { name: 'like' }).click()
        await page.getByText('weevil blog 1001hide').waitFor()
        await page.getByText('weevil blog 1001hide').locator('..').getByRole('button', { name: 'like' }).click()
        await page.pause()
        await page.getByText('weevil blog 1001hide').waitFor()

        // get the first delete button, text value of element above shoudl be 'weevil...'
        expect(page.getByRole('button', { name: 'delete' }).first().locator('..').getByText('weevil blog 1001hide'))
        expect(page.getByRole('button', { name: 'delete' }).nth(2).locator('..').getByText('Bobbie and his bunshide'))
        expect(page.getByRole('button', { name: 'delete' }).nth(3).locator('..').getByText('hermans hermitshide'))
      })
    })
  })
})