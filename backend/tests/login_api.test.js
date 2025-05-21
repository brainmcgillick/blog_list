const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUser = {
    name: 'Brian McGillick',
    username: 'brainmcgillick',
    password: 'password'
}

describe('When logging in', () => {
    beforeEach(async () => {
        await User.deleteMany()
    
        await api.post('/api/users').send(initialUser)
    })

    test('Valid credentials successfully login and token returned', async () => {
        const userLogin = {
            username: 'brainmcgillick',
            password: 'password'
        }
        
        const login = await api
            .post('/api/login')
            .send(userLogin)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(login.body.token)
    })

    test('Invalid credentials fail to log in and no token returned', async () => {
        const userLogin = {
            username: 'brainmcgillick',
            password: 'wrong'
        }
        
        const login = await api
            .post('/api/login')
            .send(userLogin)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert(!login.body.token)
    })
})

after(async () => {
    await mongoose.connection.close()
})