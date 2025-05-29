const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })

    res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
    const user = await User.findById(req.user.id)
    
    const blog = new Blog({
        ...req.body,
        user: user._id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await  user.save()

    const returnBlogObject = await Blog.findById(savedBlog._id).populate('user', { name: 1, username: 1 })

    res.status(201).json(returnBlogObject)
})

blogsRouter.delete('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id)

    if (blog.user.toString() === req.user.id) {
        await Blog.findByIdAndDelete(req.params.id)
        return res.status(204).end()
    } 

    return res.status(401).json({ error: 'only blog creator can delete' })
})

blogsRouter.put('/:id', async (req, res, next) => {
    const blog = await Blog.findById(req.params.id)
    
    if (blog.user.toString() === req.user.id) {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true}).populate('user', { name: 1, username: 1 })
        return res.status(201).json(updatedBlog)
    }
    
    return res.status(401).json({ error: 'only blog creator can update' })
})

  module.exports = blogsRouter