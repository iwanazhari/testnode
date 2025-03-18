import Joi from 'joi'

// Validasi Register
const registerSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 3 characters long',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
})

// Middleware Validasi Register
export const validateRegister = (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message)
      res.status(400).json({ errors: errorMessages })
      return
    }

    return next()
  } catch (err) {
    return next(err)
  }
}

const updateQuantitySchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  }),
  quantityChange: Joi.number().required().messages({
    'number.base': 'Quantity change must be a number',
    'any.required': 'Quantity change is required'
  })
})

// Skema Validasi Login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
})

// Validasi Login
export const validateLogin = (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message)
      res.status(400).json({ errors: errorMessages })
      return
    }

    return next()
  } catch (err) {
    return next(err)
  }
}

export const validateCheckout = (req, res, next) => {
  try {
    const { error } = checkoutSchema.validate(req.body, { abortEarly: false })

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message)
      res.status(400).json({ errors: errorMessages })
      return
    }

    return next()
  } catch (err) {
    return next(err)
  }
}

export const validateUpdateQuantity = (req, res, next) => {
  const { error } = updateQuantitySchema.validate(req.body, {
    abortEarly: false
  })
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors: errorMessages })
  }
  next()
}
