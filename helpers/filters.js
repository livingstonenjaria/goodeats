// * Third party libraries
const _ = require("lodash");
const createError = require('http-errors')
const { param } = require("express-validator");
module.exports ={
    // * @DESC Custom filter to capitalize words
    Capitalize: (param) => {
            if (typeof param === "string") {
                return _.startCase(_.toLower(param));
            }
            throw createError.UnprocessableEntity() 
    }
}