const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecret123';
const bcryptHashPattern = /^\$2[aby]\$.{56}$/;

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, cookieString) => {
    const [name, ...valueParts] = cookieString.split('=');
    const nameTrimmed = name && name.trim();
    if (!nameTrimmed) return cookies;
    cookies[nameTrimmed] = decodeURIComponent(valueParts.join('=').trim());
    return cookies;
  }, {});
}

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = parseCookies(cookieHeader);
  return cookies.token || null;
}

function authMiddleware(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    const err = new Error('Token não enviado');
    err.status = 401;
    return next(err);
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    const err = new Error('Token inválido ou expirado');
    err.status = 401;
    return next(err);
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Não autenticado');
      err.status = 401;
      return next(err);
    }

    const role = (req.user.role || '').toUpperCase();
    if (!allowedRoles.map(r => r.toUpperCase()).includes(role)) {
      const err = new Error('Permissão negada');
      err.status = 403;
      return next(err);
    }

    return next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
  bcryptHashPattern
};