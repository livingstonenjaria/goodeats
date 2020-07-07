// * Third party libraries
const _ = require("lodash")
module.exports ={
    // * @DESC Custom filter to capitalize words
    Capitalize: (param) => {
            if (typeof param === "string") {
                return _.startCase(_.toLower(param));
            }
          console.error("Requires String to capitalize")  
    }
}