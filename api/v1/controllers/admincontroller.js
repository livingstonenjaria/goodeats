// * Third party libs
const mongoose = require('mongoose')
const createError = require('http-errors')
const { validationResult } = require('express-validator')

// * Custom file imports
// * @desc models imports
const Country = require('../models/country')

module.exports = {
  // * desc: Add country of operation
  // * route: Add country of operation
  // * access: Private
  addCountry: async (req, res, next) => {
    console.log(req.body)
  },
}
