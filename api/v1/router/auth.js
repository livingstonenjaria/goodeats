// * Third Party Libraries
const express = require('express')
const mongoose = require('mongoose')
const createError = require('http-errors')
const { validationResult } = require("express-validator");

// * Custom File imports
const User = require('../models/user')
const { Roles } = require('../models/user')
const {
  RegistrationValidation,
} = require("../../../helpers/validation_schema");
const { Capitalize } = require("../../../helpers/filters");


// * initializations
const router = express.Router()

// * Register New User
router.post("/register", RegistrationValidation, async (req, res, next) => {
  try {
    // * Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.UnprocessableEntity(errors.array()[0].msg);
    }

    const { email, phone, password } = req.body;
    const firstname = Capitalize(req.body.firstname);
    const lastname = Capitalize(req.body.lastname);

    // * Check if user exists
    const doesExist = await User.findOne({ email: email });
    if (doesExist)
      throw createError.Conflict(`${email} has already been registered`);

    // * Create New User
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      password: password,
      date_created: Date.now(),
    });

    const savedUser = await user.save();
    res.status(201).send(savedUser);

  } catch (error) {
    next(error);
  }
});

// * Login Users
router.post('/login', async(req, res, next) =>{
    res.send("Login Route")
})
router.post('/refresh-token', async(req, res, next) =>{
    res.send("Refresh Token Route")
})
router.post('/forgot-password', async(req, res, next) =>{
    res.send("Forgot Password Route")
})
router.post('/reset-password', async(req, res, next) =>{
    res.send("Reset Password Route")
})
router.delete('/logout', async(req, res, next) =>{
    res.send("Logout Route")
})

module.exports = router;