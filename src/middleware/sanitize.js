import sanitizeHtml from 'sanitize-html'

// Middleware untuk membersihkan input XSS
export const sanitizeInput = (req, res, next) => {
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === 'string') {
      req.body[key] = sanitizeHtml(req.body[key])
    }
  })

  next()
}
