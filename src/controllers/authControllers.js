import * as authService from '../services/authService.js'

export const register = async (req, res, next) => {
  const { name, email, password } = req.body

  try {
    const newUser = await authService.SignUp(name, email, password)
    res.status(201).json(newUser)
    return
  } catch (error) {
    console.error('Error in register:', error)

    if (error instanceof Error) {
      return next({ status: 500, message: error.message })
    }

    return next({ status: 500, message: 'Internal Server Error' })
  }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const token = await authService.SignIn(email, password)
    res.status(200).json({ token })
    return
  } catch (error) {
    console.error('Error in login:', error)

    if (error instanceof Error) {
      return next({ status: 400, message: error.message })
    }

    return next({ status: 500, message: 'Internal Server Error' })
  }
}
