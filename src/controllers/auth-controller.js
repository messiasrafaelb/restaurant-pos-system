const service = require('../services/auth-service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await service.authenticate(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000
    });

    return res.redirect('/index');
  } catch (error) {
    if (req.accepts('html')) {
      return res.status(error.status || 400).render('cadastro', { error: error.message });
    }
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    if (!req.user) {
      const err = new Error('Autenticação necessária');
      err.status = 401;
      throw err;
    }

    return res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  me
};