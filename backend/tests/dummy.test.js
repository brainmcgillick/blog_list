const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy always returns 1', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)

    assert.strictEqual(result, 1)
})