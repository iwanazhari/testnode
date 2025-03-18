import prisma from '../prisma/prismaClient.js'

export const checkSellerOrders = async (sellerId) => {
  try {
    // Cari semua produk yang dijual oleh seller yang memiliki order item
    const sellerOrders = await prisma.orderItem.findMany({
      where: {
        product: {
          sellerId: sellerId // Hanya produk milik seller yang sedang login
        }
      },
      include: {
        order: {
          include: {
            buyer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true
              }
            }
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    })

    if (!sellerOrders || sellerOrders.length === 0) {
      return {
        hasOrders: false,
        message: 'Tidak ada produk yang di-checkout oleh buyer.'
      }
    }

    return { hasOrders: true, orders: sellerOrders }
  } catch (error) {
    throw new Error('Gagal memeriksa pesanan: ' + error.message)
  }
}
