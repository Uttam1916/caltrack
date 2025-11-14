// Auth middleware is intentionally a no-op in this simplified setup.
// All requests are allowed. The client should include user identification
// in request bodies or query params when needed.

function authMiddleware(req, res, next) {
  // no authentication enforced
  next();
}

module.exports = authMiddleware;
