module.exports = {
  ERR_INVALID_ARGS: 'ERR_INVALID_ARGS',
  ERR_DOWNLOAD_FONT: 'ERR_DOWNLOAD_FONT',
  ERROR_IO: 'ERROR_IO',
  CREDENTIALS_NOT_VALID: 'CREDENTIALS_NOT_VALID',
  DUPLICATE_DATA: 'DUPLICATE_DATA',
  NOT_FOUND: 'NOT_FOUND',
  addInnerError: (error, innerError) => {
    const xError = {
      error,
      innerError,
    };
    return xError;
  },
};
