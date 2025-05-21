const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favourite blog', () => {
    test('of empty list is null', () => {
        const blogs = []
        const result = listHelper.favouriteBlog(blogs)

        assert.strictEqual(result, null)
    })

    test('of list of one blog is that blog', () => {
        const blogs = [
            {
                __v: 0,
                title: "100 Things About Cats",
                author: "Michael Collins",
                url: "http://catblog.com",
                likes: 23,
                id: "6ae5gt67392utgh45d5"
            }
        ]
        const result = listHelper.favouriteBlog(blogs)

        assert.deepStrictEqual(result, blogs[0])
    })

    test('of multiple blogs chooses correct', () => {
        const blogs = [
                    {
                        __v: 0,
                        title: "100 Things About Cats",
                        author: "Michael Collins",
                        url: "http://catblog.com",
                        likes: 23,
                        id: "6ae5gt67392utgh45d5"
                    },
                    {
                        __v: 0,
                        title: "1000 Things About Cats",
                        author: "Michael Collins",
                        url: "http://catblogsequel.com",
                        likes: 27,
                        id: "6ae5gt67392utgh45d5"
                    }
                ]
                const result = listHelper.favouriteBlog(blogs)

                assert.deepStrictEqual(result, blogs[1])
    })
})