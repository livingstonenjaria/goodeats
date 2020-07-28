// * Third party libraries
const mongoose = require('mongoose')
// * Initializations
const Schema = mongoose.Schema

const PhoneSchema = new Schema({
  _id: Schema.Types.ObjectId,
  phone: {
    type: String,
    unique: true,
    required: [true, 'User must provide a phone number'],
    trim: true,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  // expiresAt: {
  //   type: Date,
  //   default: Date.now,
  //   index: {
  //     expires,
  //   },
  // },
})

// * Methods
// * @DESC: Method to check if phone is verified
PhoneSchema.methods.isVerified = function () {
  return this.verified
}

const Phone = mongoose.model('Phone', PhoneSchema)

module.exports = Phone
