const { test } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')


test('return1', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})