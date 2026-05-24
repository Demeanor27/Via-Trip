const SENSITIVE_KEYS = ['password', 'password_hash', 'token', 'jwt', 'authorization', 'newPassword'];

export function redact(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key of Object.keys(clone)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      clone[key] = '[REDACTED]';
    } else if (typeof clone[key] === 'object') {
      clone[key] = redact(clone[key]);
    }
  }
  return clone;
}

export function redactLog(args) {
  return args.map((a) => (typeof a === 'object' ? redact(a) : a));
}
