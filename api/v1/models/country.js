// * Third party libs
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: [true, 'The name of the country has to be provided'],
    maxlength: [60, 'The country name provided is too long'],
  },
  countryCode: {
    type: String,
    required: [true, 'Country code is required'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

const Country = mongoose.model('Country', CountrySchema)

module.exports = Country
