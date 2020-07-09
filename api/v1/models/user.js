// * Third party libraries
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// * Initializations
const Schema = mongoose.Schema

// * @DESC Role object used to define user roles

const Roles = Object.freeze({
    ADMIN: 'admin',
    MANAGER: 'manager',
    CUSTOMER: 'customer'
})


const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: [true, 'User must provide a firstname'],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, 'User must provide a lastname'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'User must provide a phone number'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'User must provide an email address'],
        trim: true,
        unique: true,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: [true, 'User must provide a password'],
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(Roles),
        default: Roles.CUSTOMER
    },
    date_created: {
        type: Date
    },
    date_updated: {
        type: Date
    }
})

Object.assign(UserSchema.statics,{
    Roles
})

// * @DESC Middleware to hash password before save
UserSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})
// * Methods
// * @DESC: Method to check validity of password
UserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}
const User = mongoose.model('User', UserSchema)

// * Change Stream
// User.watch().on('change', data => {
//     console.log(data)
// })

module.exports = User