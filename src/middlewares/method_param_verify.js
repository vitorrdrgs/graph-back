export const middleware_method_param_verify = (req, res, next) => {
  const { method } = req.params

  if (method !== 'matrix'&& method !== 'list') {
    return res.status(400).json({ error: 'Método inválido' });
  }

  next();
};
