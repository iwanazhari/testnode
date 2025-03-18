import prisma from '../prisma/prismaClient.js'

export const searchProduct = async (searchTerm, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit

    // Menghapus opsi "mode" agar query sesuai dengan yang didukung oleh database Anda
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } }
        ]
      },
      skip,
      take: limit
    })

    const totalCount = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } }
        ]
      }
    })

    const totalPages = Math.ceil(totalCount / limit)

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page
    }
  } catch (error) {
    console.error('Error in searchProduct:', error)
    throw new Error('Failed to search products: ' + error.message)
  }
}
