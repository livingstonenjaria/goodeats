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
    body('firstName')
      .not()
      .isEmpty()
      .withMessage('Please provide a first name.'),
    body('lastName').not().isEmpty().withMessage('Please provide a last name.'),
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
}
