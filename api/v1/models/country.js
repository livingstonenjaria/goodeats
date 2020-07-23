// * Third party libs
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountrySchema = new Schema({
  _id: Schema.Types.ObjectId,
  countryName: {
    type: String,
    required: [true, 'The name of the country has to be provided'],
    maxlength: [60, 'The country name provided is too long'],
  },
  code: {
    type: String,
    required: [true, 'Country code is required'],
    maxlength: [2, 'Country code should be only 2 characters long'],
    minlength: [2, 'Country code should be 2 characters long'],
    uppercase: true,
  },
  dialCode: {
    type: String,
    required: [true, 'Please provide a dial code'],
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
