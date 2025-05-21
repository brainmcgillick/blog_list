const logger = require('./logger')
const jwt = require('jsonwebtoken')

const userExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        const token = authorization.replace('Bearer ', '')
        req.user = jwt.verify(token, process.env.SECRET)
    } else {
      req.token = null
    }
    
    next()
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)
  
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return res.status(400).json({ error: 'username not unique' })
    } else if(error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'invalid token' })
    }
  
    next(error)
}

module.exports = {
  errorHandler,
  userExtractor
}