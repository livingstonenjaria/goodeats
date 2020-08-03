// * Third Party Libraries
const mongoose = require('mongoose')
const Nexmo = require('nexmo')
const createError = require('http-errors')
const _ = require('lodash')
const { validationResult } = require('express-validator')

// * Custom File imports
// * Async Handlers import
const asyncHandler = require('../middleware/async')
const Country = require('../models/country')
const Phone = require('../models/phone')
const ResendCounter = require('../models/resend_counter')

// * Helpers
const client = require('../../../helpers/init_redis')
const {
  SanitizePhone,
  GeneratePhoneOTP,
} = require('../../../helpers/phone_helper')

// * Initialize nexmo
const nexmo = new Nexmo(
  {
    apiKey: process.env.NEXMO_API,
    apiSecret: process.env.NEXMO_SECRET,
  },
  { debug: true }
)

module.exports = {
  // * Register Phone
  // * @desc Registers the phone number of a new user
  // * @route /v1/auth/register-phone
  // * @access private
  registerPhone: asyncHandler(async (req, res, next) => {
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
    const completePhone = countryExists.dialCode + sanitizedPhone
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
        'We are currently experiencing some difficulties please try again later'
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
    // * Save to resend counter
    const resendCount = new ResendCounter({
      _id: new mongoose.Types.ObjectId(),
      phone: sanitizedPhone,
    })
    const savedCount = await resendCount.save()
    // * Step 7
    // * Save to cache
    const savedVerificationCode = await setPhoneVerificationCode(
      sanitizedPhone,
      token
    )

    // * Step 8
    // * Send otp via sms
    // * TODO: Implement sms for production
    // const from = 'Vonage APIs'
    // const to = completePhone
    // const text = `Your GoodEats verification code is ${token}`

    // Nexmo response
    // Go through response to implement better logging
    // {
    //   'message-count': '1',
    //     messages: [
    //       {
    //         to: '97338068374',
    //         'message-id': '15000000FDCEADB1',
    //         status: '0',
    //         'remaining-balance': '1.98020000',
    //         'message-price': '0.01980000',
    //         network: '42601'
    //       }
    //     ]
    // }

    // nexmo.message.sendSms(from, to, text, (err, responseData) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.dir(responseData)
    //     // if (responseData.messages[0]['status'] === "0") {
    //     //   console.log("Message sent successfully.");
    //     // } else {
    //     //   console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
    //     // }
    //   }
    // })
    // TODO: Implement after successfull message delivery
    res.status(201).json({
      success: true,
      otp_token: token,
    })
  }),
  // * Verify OTP-Code
  // * @desc Verifies the OTP Code of a new phone number
  // * @route /v1/auth/verify-otp-code
  // * @access private
  verifyPhone: asyncHandler(async (req, res, next) => {
    // * Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw createError.UnprocessableEntity(errors.array()[0].msg)
    }
    // * Initialize vars
    const { phone, otp_token } = req.body
    const code = _.upperCase(req.body.code)
    // * Step 1
    // * Sanitize Phone Number
    const sanitizedPhone = SanitizePhone(phone, code)

    // * Step 2
    // * Check if phone already exists
    const phoneExists = await Phone.findOne({ phone: sanitizedPhone })
    if (!phoneExists) {
      throw createError.BadRequest(
        'Please register a phone number first then send a verification request'
      )
    }
    // * @desc check if phone is verified
    const isVerified = phoneExists.isVerified()
    // ? if verified throw conflict error
    if (isVerified)
      throw createError.Conflict(
        'The phone number you provided is already registered'
      )

    // * Step 3
    // * Get the verification code from cache
    const verification_code = await getPhoneVerificationCode(sanitizedPhone)

    // * Step 4
    // * Compare verification codes

    if (otp_token !== verification_code) {
      throw createError.BadRequest('The verification code provided is invalid')
    }
    // * Step 5
    // * Set Verified to true

    const filter = { phone: sanitizedPhone }
    const update = { verified: true }

    const phoneUpdated = await Phone.findOneAndUpdate(filter, update, {
      new: true,
    })

    res.status(200).json({
      success: true,
      message:
        'Phone has successfully been verified, please continue with registration',
    })
  }),
  // * Resend OTP-Code
  // * @desc Resend the OTP Code
  // * @route /v1/auth/resend-otp-code
  // * @access private
  resendOTP: asyncHandler(async (req, res, next) => {
    // * Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw createError.UnprocessableEntity(errors.array()[0].msg)
    }
    // * Initialize vars
    const { phone } = req.body
    const code = _.upperCase(req.body.code)
    let counter = 0
    // * Step 1
    // * Sanitize Phone Number
    const sanitizedPhone = SanitizePhone(phone, code)

    // * Step 2
    // * Check if phone already exists
    const phoneExists = await Phone.findOne({ phone: sanitizedPhone })
    if (!phoneExists) {
      throw createError.BadRequest(
        'Please register a phone number first then send a verification request'
      )
    }
    // * Step 3
    // * Check Resend counter
    const counterExists = await ResendCounter.findOne({
      phone: sanitizedPhone,
    })
    if (counterExists) {
      const resendCount = counterExists.isCounter()
      counter = resendCount
    }
    // * Step 4
    // * Maximum of 3 resend requests per user
    if (counter >= 3) {
      throw createError.TooManyRequests(
        'You have exceeded your daily maximum sms verification limit'
      )
    }
    // * Step 5
    // * Generate OTP token
    const token = GeneratePhoneOTP()
    if (!token) {
      throw createError.InternalServerError(
        'We are currently experiencing some difficulties please try again later'
      )
    }
    // * Step 6
    // * Save to cache
    const savedVerificationCode = await setPhoneVerificationCode(
      sanitizedPhone,
      token
    )
    // * Step 7
    // * Update counter
    const filter = { phone: sanitizedPhone }
    const update = { $inc: { counter: 1 } }
    const option = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
    const updateCounter = await ResendCounter.findOneAndUpdate(
      filter,
      update,
      option
    )
    // * Step 8
    // * Send otp via sms
    // * TODO: Implement sms

    res.status(201).json({
      success: true,
      otp_token: token,
    })
  }),
}
const setPhoneVerificationCode = (sanitizedPhone, token) => {
  return new Promise((resolve, reject) => {
    // * @desc Set OTP to Redis
    client.set(sanitizedPhone, token, 'EX', 24 * 60 * 60, (err, reply) => {
      if (err) {
        console.error(err)
        reject(
          createError.InternalServerError(
            'We are currently experiencing some difficulties please try again later'
          )
        )
      }
      resolve(1)
    })
  })
}
const getPhoneVerificationCode = (sanitizedPhone) => {
  return new Promise((resolve, reject) => {
    client.GET(sanitizedPhone, (err, result) => {
      if (err) {
        console.error(err)
        reject(
          createError.InternalServerError(
            'We are currently experiencing some difficulties please try again later'
          )
        )
      }
      if (result === null) {
        reject(
          createError.NotFound(
            'Your verification code has already expired. Resend a new verification code'
          )
        )
      }
      resolve(result)
    })
  })
}
