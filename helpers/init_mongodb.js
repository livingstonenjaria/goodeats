// * Third party libraries
const mongoose = require('mongoose')
const colors = require('colors')

// * @DESC initialize mongodb instance
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected.'.yellow)
  })
  .catch(err => {
    console.error('Mongoose connection error: ', err)
  })

// * Check mongoose connection to db
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db.'.yellow)
})

// * Check mongoose connection error
mongoose.connection.on('error', err => {
  console.error('Mongoose db connection error: ', err)
})

// * Check mongoose for disconnection
mongoose.connection.on('disconnected', () => {
  console.error('Mongoose connection is disconnected.')
})

// * Close mongoose connection
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit(0)
})
