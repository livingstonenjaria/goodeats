// * Third Party Libs
const speakeasy = require('speakeasy')
const createError = require('http-errors')
module.exports = {
  // * Generate Phone OTP
  GeneratePhoneOTP: () => {
    const secret = speakeasy.generateSecret({ length: 20 })
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    })
    return token
  },
  // * Sanitize Phone Number
  SanitizePhone: (phone, code) => {
    if (code === 'BH') {
      if (!phone) {
        throw createError.BadRequest('Please provide a phone number')
      }
      const regex = /^(\d{4})[\s-]?(\d{4})$/
      const match = regex.exec(phone)
      if (!match) {
        throw createError.BadRequest('Please provide a valid phone number')
      }
      const sanitizedPhoneNumber = match[1] + match[2]
      return sanitizedPhoneNumber
    }
  },
}
