export function validateCompileRequest(req, res, next) {
  const { code, flags } = req.body;

  // Check if code is provided
  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'Code is required and must be a string',
      field: 'code'
    });
  }

  // Check code length limit
  if (code.length > 10000) {
    return res.status(400).json({
      error: 'Code is too long. Maximum 10,000 characters allowed.',
      field: 'code'
    });
  }

  // Check if flags is provided
  if (!flags || typeof flags !== 'object') {
    return res.status(400).json({
      error: 'Flags object is required',
      field: 'flags'
    });
  }

  // Validate flags structure
  const requiredFlags = ['wall', 'werror', 'debug', 'static', 'optimization'];
  const validOptimizations = ['O0', 'O1', 'O2', 'O3', 'Os', 'Ofast'];

  for (const flag of requiredFlags) {
    if (!(flag in flags)) {
      return res.status(400).json({
        error: `Missing required flag: ${flag}`,
        field: `flags.${flag}`
      });
    }
  }

  // Validate boolean flags
  const booleanFlags = ['wall', 'werror', 'debug', 'static'];
  for (const flag of booleanFlags) {
    if (typeof flags[flag] !== 'boolean') {
      return res.status(400).json({
        error: `Flag ${flag} must be a boolean`,
        field: `flags.${flag}`
      });
    }
  }

  // Validate optimization level
  if (!validOptimizations.includes(flags.optimization)) {
    return res.status(400).json({
      error: `Invalid optimization level. Must be one of: ${validOptimizations.join(', ')}`,
      field: 'flags.optimization'
    });
  }

  next();
} 