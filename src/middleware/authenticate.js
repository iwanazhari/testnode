import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Pastikan decoded token memiliki properti 'id'
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' })
    }
    return res.status(400).json({ error: 'Invalid token.' })
  }
}
