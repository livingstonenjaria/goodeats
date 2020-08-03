// * Middleware to handle async calls to avoid try catch
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
module.exports = asyncHandler
