const notFound = (req, res, next) => {
  const error = new Error(`${req.originalUrl} Not found`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    status: statusCode,
  });
};

export { notFound, errorHandler };
