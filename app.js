const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')

const app = express()

app.use(express.json())

mongoose.connect(config.MONGODB_URI)

app.use('/api/blogs', blogsRouter)

module.exports = app