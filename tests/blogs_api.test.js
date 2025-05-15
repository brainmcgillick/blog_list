const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUser = {
    name: 'Brian McGillick',
    username: 'brainmcgillick',
    password: 'password'
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = await api.post('/api/users').send(initialUser)
    initialBlogs.forEach(blog => {
        blog.user = user.body.id
    })

    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Blog.insertMany(blogObjects)

})

describe('GET request', () => {
    test('returns JSON', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('returns right amount of blogs', async () => {
        const blogs = await api.get('/api/blogs')

        assert.strictEqual(blogs.body.length, 2)
    })
    
    test('unique identifier named \'id\'', async () => {
        const blogs = await api.get('/api/blogs')
    
        assert(blogs.body[0].id)
    })
})


describe('POST Request', () => {
    test('creates new entry', async () => {
        // get token for user
        const login = await api
            .post('/api/login')
            .send({ username: initialUser.username, password: initialUser.password })

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
            .set('Authorization', `Bearer ${login.body.token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await Blog.find({})

        assert.strictEqual(blogsAfter.length, blogsBefore.length + 1)
    })

    test('defaults like count to zero when missing', async () => {
        // get token for user
        const login = await api
            .post('/api/login')
            .send({ username: initialUser.username, password: initialUser.password })
        
        const newBlog = {
            title: 'Horses and Me',
            author: 'Dorian Gray',
            url: 'http://neighbours.com'
        }

        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${login.body.token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(createdBlog.body.likes, 0)
    })

    test('returns 400 if title missing', async () => {
        // get token for user
        const login = await api
            .post('/api/login')
            .send({ username: initialUser.username, password: initialUser.password })
            
            const newBlog = {
            likes: 0,
            author: 'Albert Solomon',
            url: 'http://parochialperfumes.com'
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(400)
    })
    
    test('returns 400 if url missing', async () => {
        // get token for user
        const login = await api
            .post('/api/login')
            .send({ username: initialUser.username, password: initialUser.password })

        const newBlog = {
            title: 'To High Heaven',
            likes: 0,
            author: 'Albert Solomon',
        }
        
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(400)
    })
})

describe('DELETE request', () => {
    test('successfully returns 204 with valid id and login', async () => {
        // get token for user
        const login = await api
            .post('/api/login')
            .send({ username: newUser.username, password: newUser.password })
            
        const blogsBefore = await api.get('/api/blogs')
        const toDelete = blogsBefore.body[0]

        await api
            .delete(`/api/blogs/${toDelete.id}`)
            .set('Authorization', `Bearer ${login.body.token}`)
            .expect(401)
        
        const blogsAfter = await api.get('/api/blogs')

        assert.strictEqual(blogsAfter.body.length, blogsBefore.body.length - 1)
    })
    
    test('fails and returns 401 with invalid login', async () => {
        // create new user in db
        const newUser = {
            name: 'Daniel Blake',
            username: 'blakeboi',
            password: 'password'
        }

        await api.post('/api/users').send(newUser)
    
        // get token for user
        const login = await api
            .post('/api/login')
            .send({ username: newUser.username, password: newUser.password })
            .expect(200)
            
        const blogsBefore = await api.get('/api/blogs')
        const toDelete = blogsBefore.body[0]

        await api
            .delete(`/api/blogs/${toDelete.id}`)
            .set('Authorization', `Bearer ${login.body.token}`)
            .expect(401)
        
        const blogsAfter = await api.get('/api/blogs')

        assert.strictEqual(blogsAfter.body.length, blogsBefore.body.length)
    })
})

describe('PUT Request', () => {
    test('successfully updates existing blog', async () => {
        const blogsBefore = await api.get('/api/blogs')
        const blogToUpdate = blogsBefore.body[0]

        blogToUpdate.likes = 44

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        assert.deepStrictEqual(updatedBlog.body, blogToUpdate)
    })
})

after(async () => {
    console.log("closing connection")
    await mongoose.connection.close()
})