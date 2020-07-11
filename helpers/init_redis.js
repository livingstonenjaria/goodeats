// * Third party libraries
const redis = require('redis')
// * Initializations
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
client.auth(process.env.REDIS_PWD)

// * Events
client.on('connect', () => {
    console.log("Client connected to redis..")
})
client.on('ready', () => {
    console.log("Client connected to redis and ready to use")
})
client.on('error', (err) => {
    console.log("Redis Error", err)
})
client.on('end', () => {
    console.log("Client disconnected from redis..")
})
process.on('SIGINT', () => {
    client.quit()
})

module.exports = client