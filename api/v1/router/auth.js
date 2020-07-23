// * Third Party Libraries
const express = require('express')

// * Custom File imports
const {
  register,
  registerAdmin,
  login,
  refreshToken,
  logout,
} = require('../controllers/authcontroller')

// * Helpers
const {
  RegistrationValidation,
  LoginValidation,
} = require('../../../helpers/validation_schema')

// * initializations
const router = express.Router()

// * Register New User
router.post('/register', RegistrationValidation, register)
// * Register New Admin
router.post('/sa/create-admin', RegistrationValidation, registerAdmin)

// * Login Users
router.post('/login', LoginValidation, login)
// * Refresh Token
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', async (req, res, next) => {
  res.send('Forgot Password Route')
})
router.post('/reset-password', async (req, res, next) => {
  res.send('Reset Password Route')
})
// * Logout users
router.delete('/logout', logout)

module.exports = router
