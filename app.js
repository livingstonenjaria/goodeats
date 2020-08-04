// * Third Party Libraries
const express = require('express')
const morgan = require('morgan')
const colors = require('colors')
require('dotenv').config()

// * Custom file imports
// * Async Handlers import
const asyncHandler = require('./api/v1/middleware/async')
const { ErrorHandler, Custom404Error } = require('./api/v1/middleware/error')
require('./helpers/init_mongodb')
require('./helpers/init_redis')

const { CheckDBConnection } = require('./helpers/connection_check')
const { VerifyAccessToken } = require('./helpers/jwt_helpers')

const AuthRoute = require('./api/v1/router/auth')
const AdminRoute = require('./api/v1/router/admin')

// * initializations
const app = express()
const PORT = process.env.PORT || 5000

// * Middleware

// * Implementing morgan http logger
// TODO: Save logs to file
app.use(morgan('combined'))

// * Body Parser
app.use(express.json())

// * Registration and login Routes
app.use('/v1/auth', CheckDBConnection, AuthRoute)

// * Auth Middleware
app.use(VerifyAccessToken)

// * Filtering Routes
app.get(
  '/v1',
  asyncHandler(async (req, res, next) => {
    res.status(200).json({
      message: 'Welcome to Good Eats',
    })
  })
)
app.use('/v1/admin', CheckDBConnection, AdminRoute)

// * General 404 error
app.use(Custom404Error)

// * Global Error Handler
app.use(ErrorHandler)

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`.blue.inverse)
)
