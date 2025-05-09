const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
//const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: "100 Things About Cats",
        author: "Michael Collins",
        url: "http://catblog.com",
        likes: 23
    },
    {
        title: "1000 Things About Cats",
        author: "Michael Collins",
        url: "http://catblogsequel.com",
        likes: 27
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Blog.insertMany(blogObjects)
})

describe('GET request', () => {
    test('returns JSON', async () => {
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns right amount of blogs', async () => {
        const blogs = await api.get('/api/blogs')

        assert.strictEqual(blogs.body.length, 2)
    })
})

test('unique identifier named \'id\'', async () => {
    const blogs = await api.get('/api/blogs')

    assert(blogs.body[0].id)
})

describe('POST Request', () => {
    test('creates new entry', async () => {
        const blogsBefore = await Blog.find({})

        const newBlog = {
            title: "Living / Loving with Alopecia",
            author: "Dorothy Gray",
            url: "http://elopecia.com",
            likes: 45
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await Blog.find({})

        assert.strictEqual(blogsAfter.length, blogsBefore.length + 1)
    })

    test('defaults like count to zero when missing', async () => {
        const newBlog = {
            title: 'Horses and Me',
            author: 'Dorian Gray',
            url: 'http://neighbours.com'
        }

        const createdBlog = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(createdBlog.body.likes, 0)
    })

    test('returns 400 if title missing', async () => {
        const newBlog = {
            likes: 0,
            author: 'Albert Solomon',
            url: 'http://parochialperfumes.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
    
    test('returns 400 if url missing', async () => {
        const newBlog = {
            title: 'To High Heaven',
            likes: 0,
            author: 'Albert Solomon',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})


after(async () => {
    console.log("closing connection")
    await mongoose.connection.close()
})