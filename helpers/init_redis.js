// * Third party libraries
const redis = require('redis')
const colors = require('colors')
// * Initializations
const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)
client.auth(process.env.REDIS_PWD)

// * Events
client.on('connect', () => {
  console.log('Client connected to redis..'.green)
})
client.on('ready', () => {
  console.log('Client connected to redis and ready to use'.green)
})
client.on('error', err => {
  console.log('Redis Error', err)
})
client.on('end', () => {
  console.log('Client disconnected from redis..'.red)
})
process.on('SIGINT', () => {
  client.quit()
})

module.exports = client
