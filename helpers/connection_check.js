const mongoose = require('mongoose')
const creatError = require('http-errors')
module.exports = {
  CheckDBConnection: (req, res, next) => {
    let state = mongoose.connection.readyState
    if (state === 0 || state === 3) {
      return next(
        creatError.InternalServerError(
          'Seems we are experiencing some difficulties, please try again later.'
        )
      )
    }
    next()
  },
}
