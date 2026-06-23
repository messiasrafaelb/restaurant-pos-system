const jwt = require('jsonwebtoken');
const AppError = require('../errors/app-error');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_fallback';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação ausente', 401));
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return next(new AppError('Token inválido ou expirado', 401));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Não autenticado', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Sem permissão para esta operação', 403));
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, JWT_SECRET };
