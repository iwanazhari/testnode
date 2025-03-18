import prisma from '../prisma/prismaClient.js' // Pastikan koneksi Prisma

export const getUsersByRole = async (role) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
    return users
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message)
  }
}
