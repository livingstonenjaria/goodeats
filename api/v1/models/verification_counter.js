// * Third party libraries
const mongoose = require('mongoose')
// * Initializations
const Schema = mongoose.Schema

const VerificationCounterSchema = new Schema({
  _id: Schema.Types.ObjectId,
  phone: { type: String, unique: true },
  counter: { type: Number, default: 0 },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: '1d' },
  },
})

// * Methods
// * @DESC: Method to check counter value
VerificationCounterSchema.methods.isCounter = function () {
  return this.counter
}

const VerificationCounter = mongoose.model(
  'VerificationCounter',
  VerificationCounterSchema
)

module.exports = VerificationCounter
