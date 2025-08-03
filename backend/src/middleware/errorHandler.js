export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }

  if (err.name === 'SyntaxError') {
    return res.status(400).json({
      error: 'Invalid JSON',
      message: 'The request body contains invalid JSON'
    });
  }

  // Handle file system errors
  if (err.code === 'ENOENT') {
    return res.status(500).json({
      error: 'File System Error',
      message: 'Required file or directory not found'
    });
  }

  if (err.code === 'EACCES') {
    return res.status(500).json({
      error: 'Permission Error',
      message: 'Insufficient permissions to perform the operation'
    });
  }

  // Handle process execution errors
  if (err.code === 'ENOENT' && err.syscall === 'spawn') {
    return res.status(500).json({
      error: 'System Error',
      message: 'GCC compiler not found. Please ensure GCC is installed and available in PATH.'
    });
  }

  // Handle timeout errors
  if (err.code === 'ETIMEDOUT') {
    return res.status(408).json({
      error: 'Request Timeout',
      message: 'The compilation request timed out'
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
} 