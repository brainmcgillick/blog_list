const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const errorHandler = require('./utils/middleware')

const app = express()
app.use(express.json())

const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI)

app.use('/api/blogs', blogsRouter)
app.use(errorHandler)

module.exports = app