/* global process */
import jwt from 'jsonwebtoken'

export const middleware_token_verify = (req, res, next) => {
  const auth_header = req.headers['authorization']
  // separa "Bearer" do token
  const token = auth_header && auth_header.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token not found' })
  }

  jwt.verify(token, process.env.SECRET, (err, user_info) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user_info = user_info
    next()
  })
}
