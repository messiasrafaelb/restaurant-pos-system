const jwt = require('jsonwebtoken');
const AppError = require('../errors/app-error');
const userRepository = require('../repositories/user-repository');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_fallback';

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token de autenticação ausente', 401));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await userRepository.findById(payload.id);

    if (!user) {
      return next(new AppError('Usuário não encontrado', 401));
    }

    req.user = user;

    next();
  } catch (err) {
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
