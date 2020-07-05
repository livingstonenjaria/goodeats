// * Third Party Libraries
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()

// * Custom file imports
const AuthRoute = require('./router/v1/auth')

// * initializations
const app = express();
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// * Filtering Routes

app.get('/', async(req,res,next)=>{
    res.status(200).json({
        message: "Welcome to Good Eats"
    })
})

app.use('/auth', AuthRoute)

// * General 404 error
app.use(async(req, res, next) => {
    next(createError.NotFound("Sorry that route does not exist"))
})


// * Main Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    })
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))