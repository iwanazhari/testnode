import prisma from '../prisma/prismaClient.js'

// Menambahkan produk ke keranjang

// Menambahkan produk ke keranjang
export const addToCart = async (userId, productId, quantity) => {
  if (!userId) {
    throw new Error('User ID is missing or invalid')
  }

  const existingCartItem = await prisma.cart.findFirst({
    where: {
      userId,
      productId
    }
  })

  if (existingCartItem) {
    // Jika produk sudah ada, update kuantitasnya
    return await prisma.cart.update({
      where: {
        id: existingCartItem.id
      },
      data: {
        quantity: existingCartItem.quantity + quantity
      }
    })
  } else {
    // Jika produk belum ada, tambahkan ke keranjang
    return await prisma.cart.create({
      data: {
        userId, // Menyertakan userId yang valid dari token
        productId,
        quantity
      }
    })
  }
}

// Membaca semua item di keranjang untuk user tertentu
export const getCartItems = async (userId) => {
  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId
      }
    })
    return cartItems
  } catch (error) {
    console.error('Error getting cart items:', error)
    throw new Error('Unable to retrieve cart items')
  }
}

// Memperbarui kuantitas produk di keranjang
export const updateCartQuantity = async (userId, productId, quantity) => {
  const cartItem = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  })

  if (!cartItem) {
    throw new Error('Item di keranjang tidak ditemukan')
  }

  return await prisma.cart.update({
    where: {
      id: cartItem.id
    },
    data: {
      quantity
    }
  })
}

// Menghapus produk dari keranjang
export const removeFromCart = async (userId, productId) => {
  const cartItem = await prisma.cart.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  })

  if (!cartItem) {
    throw new Error('Item di keranjang tidak ditemukan')
  }

  return await prisma.cart.delete({
    where: {
      id: cartItem.id
    }
  })
}

// Menghapus semua item di keranjang untuk user tertentu
export const clearCart = async (userId) => {
  try {
    const deletedItems = await prisma.cart.deleteMany({
      where: {
        userId
      }
    })

    return deletedItems
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw new Error('Unable to clear cart')
  }
}

// Proses checkout (pembayaran)

export const checkout = async (userId) => {
  try {
    // Ambil item keranjang beserta data produk terkait
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true } // agar item.product.price tersedia
    })

    if (cartItems.length === 0) {
      throw new Error('Keranjang kosong')
    }

    // Hitung total harga dari item keranjang
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    )

    // Buat order dengan menghubungkan buyer melalui relasi (connect)
    const checkoutOrder = await prisma.order.create({
      data: {
        buyer: { connect: { id: userId } },
        totalAmount,
        status: 'pending',
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    })

    // Buat record Payment untuk order yang baru dibuat
    const payment = await prisma.payment.create({
      data: {
        amount: totalAmount,
        paymentMethod: 'credit_card', // Contoh: menggunakan 'credit_card'
        status: 'pending', // Status pembayaran default
        order: { connect: { id: checkoutOrder.id } }
      }
    })

    // Buat transaksi untuk order yang baru dibuat
    const transaction = await prisma.transaction.create({
      data: {
        user: { connect: { id: userId } },
        order: { connect: { id: checkoutOrder.id } },
        amount: totalAmount,
        status: 'pending'
      }
    })

    // Hapus semua item di keranjang setelah checkout berhasil
    await prisma.cart.deleteMany({
      where: { userId }
    })

    return { checkoutOrder, payment, transaction }
  } catch (error) {
    console.error('Error in checkout:', error)
    throw new Error('Checkout failed')
  }
}

// transaction.service.js
export const getTransactionHistory = async (userId, query) => {
  try {
    const filter = { userId }

    if (query && query.createdAt) {
      const dateInput = new Date(query.createdAt)
      if (isNaN(dateInput.getTime())) {
        throw new Error('Format createdAt tidak valid')
      }

      // Gunakan nilai createdAt apa adanya tanpa mengubahnya ke awal atau akhir hari
      filter.createdAt = dateInput
    }

    console.log('Filter being used:', filter) // Debugging

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    })

    if (!transactions || transactions.length === 0) {
      throw new Error('Transaksi tidak ditemukan')
    }

    return transactions
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    throw new Error('Gagal mengambil riwayat transaksi')
  }
}
