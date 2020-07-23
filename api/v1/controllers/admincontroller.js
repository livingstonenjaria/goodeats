// * Third party libs
const mongoose = require('mongoose')
const createError = require('http-errors')
const _ = require('lodash')
const countries = require('i18n-iso-countries')
const { validationResult } = require('express-validator')

// * Custom file imports
// * @desc models imports
const Country = require('../models/country')
const { Capitalize } = require('../../../helpers/filters')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

module.exports = {
  // * @desc: Add country of operation
  // * route: Add country of operation
  // * access: Private
  addCountry: async (req, res, next) => {
    try {
      // * Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError.UnprocessableEntity(errors.array()[0].msg)
      }
      console.log(countries.getNumericCodes())
      const countryName = Capitalize(req.body.countryName)
      let code = _.upperCase(req.body.code)
      const { dialCode } = req.body
      // Validate name of country
      let newCode = countries.getAlpha2Code(countryName, 'en')
      if (newCode === undefined || newCode === null)
        throw createError.UnprocessableEntity(
          'Please provide a valid country name'
        )
      code = newCode
      // * Check if country exists
      const doesExist = await Country.findOne({
        code: code,
      })
      if (doesExist) throw createError.Conflict('Country already exists')

      // * Create New User
      const country = new Country({
        _id: new mongoose.Types.ObjectId(),
        countryName: countryName,
        code: code,
        dialCode: dialCode,
        createdAt: Date.now(),
      })
      const savedCountry = await country.save()
      res.status(201).json({
        success: true,
        message: 'Country successfully added',
      })
    } catch (error) {
      next(error)
    }
  },
}
