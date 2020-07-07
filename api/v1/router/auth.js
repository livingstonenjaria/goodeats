// * Third Party Libraries
const express = require('express');

// * initializations
const router = express.Router();

router.post('/register', async(req, res, next) =>{
    res.send("Register Route")
})
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