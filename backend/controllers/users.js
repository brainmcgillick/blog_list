const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
    // find all users and return as json
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    // receive and parse user info from request
    const { username, name, password } = req.body

    // data validation of password reqs
    if (!password) {
        res.status(400).json({ error: 'password required' })
    } else if (password.length < 3) {
        res.status(400).json({ error: 'password must be a minimum 3 characters' })
    }

    // generate password hash
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // create new user instance
    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = usersRouter