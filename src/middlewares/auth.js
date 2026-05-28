const jwt = require("jsonwebtoken");

const httpError = require("../utils/httpError");

function authenticate(req, _res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(httpError(401, "Token de autenticacao ausente"));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (_error) {
    return next(httpError(401, "Token de autenticacao invalido"));
  }
}

function authorize(...roles) {
  return (req, _res, next) => {
    const userRoles = req.user?.roles || [];
    const allowed = roles.some((role) => userRoles.includes(role));

    if (!allowed) {
      return next(httpError(403, "Acesso negado"));
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
