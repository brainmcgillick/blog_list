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


describe('With one initial user in the database', () => {
    beforeEach(async () => {
        await User.deleteMany()
    
        const newUser = new User(initialUser)
        await newUser.save()
    })

    describe('GET Request', () => {
        test('returns one user from database', async () => {
            const users = await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
            assert.strictEqual(users.body.length, 1)
        })
    })

    describe('POST Request', () => {
        test('successfully creates user with correct info provided', async () => {
            const newUser = {
                name: 'Daniel Blake',
                username: 'blakeboi',
                password: 'password'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            // confirm extra user created
            const usersInDb = await api.get('/api/users')

            assert.strictEqual(usersInDb.body.length, 2)
        })

        test('fails to create when existing username in use', async () => {
            const newUser = {
                name: 'Daniel Blake',
                username: 'brainmcgillick',
                password: 'password'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            // confirm extra user not created
            const usersInDb = await api.get('/api/users')

            assert.strictEqual(usersInDb.body.length, 1)
        })

        test('fails to create when password not provided', async () => {
            const usersAtStart = await api.get('/api/users')
            
            const newUser = {
                name: 'Daniel Blake',
                username: 'blakeboi'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            // confirm extra user not created
            const usersAtEnd = await api.get('/api/users')

            assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
        })
        
        test('fails to create when password too short', async () => {
            const usersAtStart = await api.get('/api/users')

            const newUser = {
                name: 'Daniel Blake',
                username: 'blakeboi',
                password: 'hi'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            // confirm extra user not created
            const usersAtEnd = await api.get('/api/users')

            assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
        })
        
        test('fails to create when username too short', async () => {
            const usersAtStart = await api.get('/api/users')

            const newUser = {
                name: 'Daniel Blake',
                username: 'bl',
                password: 'password'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            // confirm extra user not created
            const usersAtEnd = await api.get('/api/users')

            assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})