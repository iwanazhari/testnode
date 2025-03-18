import prisma from '../prisma/prismaClient.js'

// Mengupdate profil pengguna
export const updateProfile = async (userId, profileData) => {
  try {
    // Jika email diupdate, cek apakah sudah digunakan oleh user lain
    if (profileData.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: profileData.email }
      })
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use')
      }
    }

    // Update profil pengguna dengan data parsial yang dikirim
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: profileData
    })

    return updatedUser
  } catch (error) {
    throw new Error('Failed to update profile: ' + error.message)
  }
}

export const getUserProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    throw new Error('Failed to get user profile')
  }
}
