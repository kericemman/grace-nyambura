function errorHandler(error, _request, response, _next) {
  const isUploadLimit = error.code === 'LIMIT_FILE_SIZE';
  const status = isUploadLimit ? 413 : (error.status ?? 500);
  if (process.env.NODE_ENV !== 'test') console.error(error);
  response.status(status).json({
    error: {
      code: isUploadLimit ? 'IMAGE_TOO_LARGE' : (error.code ?? 'INTERNAL_SERVER_ERROR'),
      message: isUploadLimit ? 'Images must be 8 MB or smaller' : (status === 500 ? 'An unexpected error occurred' : error.message),
    },
  });
}

module.exports = { errorHandler };

