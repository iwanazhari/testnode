import prisma from '../prisma/prismaClient.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const SignUp = async (name, email, password) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user', // Menggunakan string biasa alih-alih enum
        phone: '',
        address: ''
      }
    })

    return { status: 201, message: 'User created successfully', data: newUser }
  } catch (error) {
    console.error('Error in SignUp:', error)

    // **Perbaikan Handling Error**
    if (error instanceof Error) {
      return { status: 400, message: error.message }
    }

    return { status: 500, message: 'Internal Server Error' }
  }
}

export const SignIn = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error('Invalid email or password')
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in .env file')
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    return { status: 200, message: 'Login successful', token }
  } catch (error) {
    console.error('Error in SignIn:', error)

    // **Perbaikan Handling Error**
    if (error instanceof Error) {
      return { status: 400, message: error.message }
    }

    return { status: 500, message: 'Internal Server Error' }
  }
}
