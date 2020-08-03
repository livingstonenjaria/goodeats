// * Third party libs
const createError = require('http-errors')
module.exports = {
  // * Custom Error Handler
  ErrorHandler: (err, req, res, next) => {
    res.status(err.status || 500).json({
      success: false,
      status: err.status || 500,
      message: err.message || 'Server experienced an error',
    })
  },
  // * Custom 404 Error Handler
  Custom404Error: async (req, res, next) => {
    next(createError.NotFound('Sorry that route does not exist'))
  },
}
