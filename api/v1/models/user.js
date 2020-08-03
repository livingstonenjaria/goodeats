// * Third party libraries
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const slugify = require('slugify')
// * Initializations
const Schema = mongoose.Schema

// * @DESC Role object used to define user roles

const Roles = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  CUSTOMER: 'customer',
})

const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: [true, 'User must provide a first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'User must provide a last name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'User must provide a phone number'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User must provide an email address'],
    trim: true,
    unique: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  slug: String,
  password: {
    type: String,
    required: [true, 'User must provide a password'],
    minlength: [8, 'Password cannot be less than 8 characters'],
    trim: true,
  },
  role: {
    type: String,
    enum: Object.values(Roles),
    default: Roles.CUSTOMER,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
})

Object.assign(UserSchema.statics, {
  Roles,
})

// * @DESC Middleware to hash password before save
UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    // * Generate user slug
    const fullName = this.firstName + ' ' + this.lastName
    this.slug = slugify(fullName, { lower: true })
    next()
  } catch (error) {
    next(error)
  }
})
// * Methods
// * @DESC: Method to check validity of password
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}
// * Instance Methods
// * @DESC: Get user full name
UserSchema.methods.getFullName = function () {
  return this.firstName + ' ' + this.lastName
}
// * Statics Methods
// * @DESC: Method to check if admin exists
UserSchema.statics.adminExists = async function () {
  try {
    const doesExist = await this.find({ role: Roles.ADMIN }).exec()
    if (doesExist.length === 2) return true
    return false
  } catch (error) {
    console.log(error)
  }
}
const User = mongoose.model('User', UserSchema)

// * Change Stream
// User.watch().on('change', data => {
//     console.log(data)
// })

module.exports = User
