const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
    test('of empty list is null', () => {
        const blogs = []
        const result = listHelper.mostLikes(blogs)

        assert.deepStrictEqual(result, null)
    })

    test('of list of one blog is that author and that blog\'s likes', () => {
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
        const result = listHelper.mostLikes(blogs)

        assert.deepStrictEqual(result, { author: "Michael Collins", likes: 23 })
    })

    test('of multiple blogs calculates correct', () => {
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
                        id: "6ae5gt67th92utgh45d5"
                    },
                    {
                        __v: 0,
                        title: "A life on Crutches",
                        author: "Timmy Buckets",
                        url: "http://extremecrutches.com",
                        likes: 47,
                        id: "6ae5fg67392utgh45d5"
                    }
                ]
                const result = listHelper.mostLikes(blogs)

                assert.deepStrictEqual(result, { author: "Michael Collins", likes: 50 })
    })
})