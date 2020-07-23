// * Third Party Libraries
const express = require('express')

// * Custom file imports
const { addCountry } = require('../controllers/admincontroller')

// * Helpers
const { CountryValidation } = require('../../../helpers/validation_schema')

// * initializations
const router = express.Router()

// * Add country route
router.post('/add-country', CountryValidation, addCountry)

module.exports = router
