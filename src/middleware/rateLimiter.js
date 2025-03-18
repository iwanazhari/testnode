import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 800, // limit request per jam
  message: 'Too many requests, please try again later.'
})
