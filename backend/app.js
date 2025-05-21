const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

const app = express()
app.use(express.json())

mongoose.connect(config.MONGODB_URI)

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)

module.exports = app