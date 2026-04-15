/**
 * Middleware de autorización para rol admin.
 * Usar DESPUÉS del middleware auth.
 */
module.exports = (req, res, next) => {
  if (req.user?.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
};
