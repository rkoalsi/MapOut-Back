const nativeErrors = [
  'EvalError',
  'InternalError',
  'ReferenceError',
  'RangeError',
  'SyntaxError',
  'TypeError',
  'URIError',
];

// eslint-disable-next-line no-unused-vars
const catchError = (err, req, res, next) => {
  if (nativeErrors.indexOf(err.name) === -1 && err.code <= 500) {
    return res.status(err.code || 500).json({
      code     : err.name,
      messages : [err.message],
      details  : err.details,
    });
  }
  return res.status(500).json({
    code     : err.name,
    messages : [
      ...err.stack.split('\n'),
    ],
  });
};

module.exports = catchError;
