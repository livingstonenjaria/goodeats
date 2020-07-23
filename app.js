// * Third Party Libraries
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const colors = require('colors')
require('dotenv').config()

// * Custom file imports
require('./helpers/init_mongodb')
require('./helpers/init_redis')
const { VerifyAccessToken } = require('./helpers/jwt_helpers')
const AuthRoute = require('./api/v1/router/auth')
const { CheckDBConnection } = require('./helpers/connection_check')

// * initializations
const app = express()
const PORT = process.env.PORT || 5000

// * Middleware

// * Implementing morgan http logger
// TODO: Save logs to file
app.use(morgan('combined'))

// * Body Parser
app.use(express.json())

// * Filtering Routes
app.get('/v1', VerifyAccessToken, async (req, res, next) => {
  res.status(200).json({
    message: 'Welcome to Good Eats',
  })
})

app.use('/v1/auth', CheckDBConnection, AuthRoute)

// * General 404 error
app.use(async (req, res, next) => {
  next(createError.NotFound('Sorry that route does not exist'))
})

// * Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    status: err.status || 500,
    message: err.message,
  })
})

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`.blue.underline)
)
