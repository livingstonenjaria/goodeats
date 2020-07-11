// * Third Party Libraries
const express = require('express')

// * Custom File imports
const AuthController = require ('../controllers/authcontroller')


// * Helpers
const {
  RegistrationValidation,
  LoginValidation
} = require("../../../helpers/validation_schema")

// * initializations
const router = express.Router()

// * Register New User
router.post("/register", RegistrationValidation, AuthController.register);

// * Login Users
router.post('/login', LoginValidation, AuthController.login)
// * Refresh Token
router.post('/refresh-token', AuthController.refreshToken)
router.post('/forgot-password', async(req, res, next) =>{
    res.send("Forgot Password Route")
})
router.post('/reset-password', async(req, res, next) =>{
    res.send("Reset Password Route")
})
// * Logout users
router.delete('/logout', AuthController.logout)

module.exports = router;