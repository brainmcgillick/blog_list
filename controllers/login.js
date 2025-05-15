const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
    const { password, username } = req.body

    // confirm username exists
    const user = await User.findOne({ username })
    if (!user) {
        res.status(400).json({ error: 'username not found' })
    }

    // checkpassword against hash
    const passwordCheck = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
        
    if (!passwordCheck) {
        res.status(401).json({ error: 'invalid password' })
    }
        
    // generate token
    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = await jwt.sign(userForToken, process.env.SECRET)
    res.status(200).json({
        token, 
        username: user.username,
        name: user.name
    })
})

module.exports = loginRouter