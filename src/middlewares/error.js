function notFound(req, _res, next) {
  const error = new Error(`Rota nao encontrada: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;

  res.status(status).json({
    message: error.message || "Erro interno do servidor"
  });
}

module.exports = {
  errorHandler,
  notFound
};
