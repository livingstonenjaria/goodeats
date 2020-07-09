// * Third party libraries
const { body } = require('express-validator')

module.exports = {
  RegistrationValidation: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Oops seems like you forgot to enter your email.")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .trim(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Oops seems like you forgot to enter your password.")
      .isLength({ min: 8 })
      .withMessage(
        "Safety is our priority and your password is a little short, minimum is 8 characters"
      )
      .trim(),
    body("phone")
      .not()
      .isEmpty()
      .withMessage("Please provide a valid phone number.")
      .isLength({ min: 8 })
      .withMessage("Phone number must be atleast 8 characters long")
      .trim(),
    body("firstname")
      .not()
      .isEmpty()
      .withMessage("Please provide a first name.")
      .trim(),
    body("lastname")
      .not()
      .isEmpty()
      .withMessage("Please provide a last name.")
      .trim(),
  ],
  LoginValidation: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("Oops seems like you forgot to enter your email.")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .trim(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Oops seems like you forgot to enter your password.")
      .isLength({ min: 8 })
      .withMessage(
        "Invalid Username/Password"
      )
      .trim(),
  ],
};