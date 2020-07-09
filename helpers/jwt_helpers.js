// * Third Party Libraries
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const createError = require('http-errors');
// * initializations
const privateKeyPath = path.join(__dirname, "keys", "private.key");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKeyPath = path.join(__dirname, "keys", "public.key");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

module.exports = {
    SignAccessToken: (userId) => {
        const payload = {}
        const options = {
            expiresIn: "1h",
            issuer: "goodeats.com",
            audience: userId
        }
        return new Promise ((resolve, reject) => {
            jwt.sign(payload, privateKey, options, (err, token) =>{
                if (err) return reject(err)
                resolve(token)
            })
        })
    }
}
