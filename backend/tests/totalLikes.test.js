const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = listHelper.totalLikes(blogs)

        assert.strictEqual(result, 0)
    })

    test('of one blog is number of likes in that blog', () => {
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
        const result = listHelper.totalLikes(blogs)

        assert.strictEqual(result, 23)
    })

    test('of multiple blogs is sum of likes', () => {
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
        const result = listHelper.totalLikes(blogs)
    
        assert.strictEqual(result, 50)
    })
})
