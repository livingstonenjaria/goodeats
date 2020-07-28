// * Third Party Libraries
const mongoose = require('mongoose')
const createError = require('http-errors')
const _ = require('lodash')
const { validationResult } = require('express-validator')

// * Custom File imports
const Country = require('../models/country')
const Phone = require('../models/phone')
const VerificationCounter = require('../models/verification_counter')

// * Helpers
const client = require('../../../helpers/init_redis')
const {
  SanitizePhone,
  GeneratePhoneOTP,
} = require('../../../helpers/phone_helper')

module.exports = {
  // * Register Phone
  // * @desc Registers a phone number a new user
  // * @route /v1/auth/register-phone
  // * @access private
  registerPhone: async (req, res, next) => {
    try {
      // * Check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        throw createError.UnprocessableEntity(errors.array()[0].msg)
      }
      // * Initialize vars
      const { phone } = req.body
      const code = _.upperCase(req.body.code)

      // * Step 1
      // * Check if country exists
      const countryExists = await Country.findOne({ code: code })
      if (!countryExists)
        throw createError.NotFound(
          'Sorry GoodEats does not operate in your country'
        )

      // * Step 2
      // * Sanitize Phone Number
      const sanitizedPhone = SanitizePhone(phone, code)

      // * Step 3
      // * Check if phone already exists
      const phoneExists = await Phone.findOne({ phone: sanitizedPhone })
      if (phoneExists) {
        // * @desc check if phone is verified
        const isVerified = phoneExists.isVerified()
        // ? if verified throw conflict error
        if (isVerified)
          throw createError.Conflict(
            'The phone number you provided is already registered'
          )
        // ? if not verified notify user to verify
        throw createError.Conflict(
          'The phone number is not verified, please verify to continue'
        )
      }

      // * Step 4
      // * Generate OTP token
      const token = GeneratePhoneOTP()
      if (!token) {
        throw createError.InternalServerError(
          'We are currently experiencing some dificulties please try again later'
        )
      }

      // * Step 5
      // * Save to db
      const userPhone = new Phone({
        _id: new mongoose.Types.ObjectId(),
        phone: sanitizedPhone,
        country: countryExists._id,
      })
      const savedPhone = await userPhone.save()
      // * Step 6
      // * Save to verification counter
      const verificationCount = new VerificationCounter({
        _id: new mongoose.Types.ObjectId(),
        phone: sanitizedPhone,
      })
      const savedCount = await verificationCount.save()
      // * Step 7
      // * Save to cache
      const savedVerificationCounter = await setPhoneVerificationCode(
        sanitizedPhone,
        token
      )

      res.status(201).json({
        success: true,
      })
      //   // * Check how many times user has sent verification
      //   const verificationAttempts = await checkVerificationAttempts(
      //     sanitizedPhone
      //   )
      //   // * Maximum of 3 verification requests per user
      //   if (verificationAttempts != null && verificationAttempts >= 3) {
      //     return reject(
      //       createError.TooManyRequests(
      //         'You have exceeded your daily maximum sms verification limit'
      //       )
      //     )
      //   }
    } catch (error) {
      next(error)
    }
  },
  //   * TODO: Add phone number verification
}
const setPhoneVerificationCode = (sanitizedPhone, token) => {
  return new Promise((resolve, reject) => {
    // * @desc Set OTP to Redis
    client.set(sanitizedPhone, token, 'EX', 24 * 60 * 60, (err, reply) => {
      if (err) {
        console.error(err)
        reject(
          createError.InternalServerError(
            'We are currently experiencing some dificulties please try again later'
          )
        )
      }
      resolve(1)
    })
  })
}
