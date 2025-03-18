import prisma from '../prisma/prismaClient.js'

export const updateProductQuantity = async (productId, quantityChange) => {
  // Cari produk berdasarkan ID
  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // Hitung stok baru
  const newStock = product.stock + quantityChange

  if (newStock < 0) {
    throw new Error('Insufficient stock')
  }

  // Update stok produk
  return await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock }
  })
}

export const getProductsBySeller = async (userId) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: userId }, // Ambil produk yang sesuai dengan userId seller
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return { status: 'success', data: products }
  } catch (error) {
    console.error("Error fetching seller's products:", error)
    throw new Error('Internal Server Error')
  }
}
