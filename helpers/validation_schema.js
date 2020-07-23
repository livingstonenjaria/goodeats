// * Third party libraries
const { body } = require('express-validator')

module.exports = {
  RegistrationValidation: [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Oops seems like you forgot to enter your email.')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .trim(),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Oops seems like you forgot to enter your password.')
      .isLength({ min: 8 })
      .withMessage(
        'Safety is our priority and your password is a little short, minimum is 8 characters'
      )
      .trim(),
    body('phone')
      .not()
      .isEmpty()
      .withMessage('Please provide a valid phone number.')
      .isLength({ min: 8 })
      .withMessage('Phone number must be at least 8 characters long')
      .trim(),
    body('firstName')
      .not()
      .isEmpty()
      .withMessage('Please provide a first name.')
      .trim(),
    body('lastName')
      .not()
      .isEmpty()
      .withMessage('Please provide a last name.')
      .trim(),
  ],
  LoginValidation: [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Oops seems like you forgot to enter your email.')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .trim(),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Oops seems like you forgot to enter your password.')
      .isLength({ min: 8 })
      .withMessage('Invalid Username/Password')
      .trim(),
  ],
  CountryValidation: [
    body('countryName')
      .not()
      .isEmpty()
      .withMessage('Please provide a country name.')
      .isLength({ max: 60 })
      .withMessage('The country name provided is too long')
      .trim(),
    body('code')
      .not()
      .isEmpty()
      .withMessage('Please provide a country code.')
      .isLength({ min: 2, max: 2 })
      .withMessage('Country code should be 2 characters long')
      .trim(),
    body('dialCode')
      .not()
      .isEmpty()
      .withMessage('Please provide a dial code.')
      .trim(),
  ],
}
