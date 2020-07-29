// * Third Party Libraries
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

// * Custom library imports

const client = require('./init_redis')

// * initializations
const privateKeyPath = path.join(__dirname, 'keys', 'private.key')
const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
const refreshPrivateKeyPath = path.join(
  __dirname,
  'keys',
  'refresh_private.key'
)
const refreshPrivateKey = fs.readFileSync(refreshPrivateKeyPath, 'utf8')
const publicKeyPath = path.join(__dirname, 'keys', 'public.key')
const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
const refreshPublicKeyPath = path.join(__dirname, 'keys', 'refresh_public.key')
const refreshPublicKey = fs.readFileSync(refreshPublicKeyPath, 'utf8')

module.exports = {
  SignAccessToken: (userId, role) => {
    const payload = {
      role,
    }
    const options = {
      expiresIn: '1h',
      issuer: 'goodeats.com',
      audience: userId,
      algorithm: 'RS256',
    }
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, options, (err, token) => {
        if (err) {
          console.error(err.message)
          return reject(createError.InternalServerError())
        }
        resolve(token)
      })
    })
  },
  VerifyAccessToken: (req, res, next) => {
    // * Grab authorization token from headers
    const authHeader = req.headers['authorization']
    if (!authHeader) return next(createError.Unauthorized())
    // * Separate Bearer keyword and the access token
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    // * Verify the access token
    jwt.verify(token, publicKey, (err, payload) => {
      if (err) {
        console.error(err.message)
        if (err.name === 'JsonWebTokenError') {
          return next(createError.Unauthorized())
        } else {
          return next(createError.Unauthorized(err.message))
        }
      }
      req.payload = payload
      next()
    })
  },
  SignRefreshToken: (userId) => {
    const payload = {}
    const options = {
      expiresIn: '1y',
      issuer: 'goodeats.com',
      audience: userId,
      algorithm: 'RS256',
    }
    return new Promise((resolve, reject) => {
      jwt.sign(payload, refreshPrivateKey, options, (err, token) => {
        if (err) {
          console.error(err.message)
          return reject(createError.InternalServerError())
        }
        client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.error(err)
            return reject(createError.InternalServerError())
          }
          resolve(token)
        })
      })
    })
  },
  VerifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, refreshPublicKey, (err, payload) => {
        if (err) return reject(createError.Unauthorized())
        const userId = payload.aud

        client.GET(userId, (err, result) => {
          if (err) {
            console.error(err)
            return reject(createError.InternalServerError())
          }
          if (refreshToken === result) return resolve(userId)
          return reject(createError.Unauthorized())
        })
      })
    })
  },
}
