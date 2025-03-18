import * as cartService from '../services/CartService.js'

// Controller untuk menambahkan produk ke keranjang
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body
  const { id: userId } = req.user

  if (!userId) {
    return res.status(400).json({ error: 'User ID is missing or invalid' })
  }
  try {
    const cartItem = await cartService.addToCart(userId, productId, quantity)
    res.status(201).json(cartItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Controller untuk mendapatkan semua item di keranjang untuk user tertentu
export const getCartItems = async (req, res) => {
  const { userId } = req.user // Mengambil userId dari token JWT

  try {
    const cartItems = await cartService.getCartItems(userId)
    res.status(200).json(cartItems) // Mengirimkan semua item di keranjang
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Controller untuk memperbarui kuantitas produk di keranjang
export const updateCartQuantity = async (req, res) => {
  const { productId, quantity } = req.body
  const { userId } = req.user // Mengambil userId dari token JWT

  try {
    const updatedCartItem = await cartService.updateCartQuantity(
      userId,
      productId,
      quantity
    )
    res.status(200).json(updatedCartItem) // Mengirimkan item keranjang yang telah diperbarui
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Controller untuk menghapus produk dari keranjang
export const removeFromCart = async (req, res) => {
  const { productId } = req.body
  const { userId } = req.user // Mengambil userId dari token JWT

  try {
    await cartService.removeFromCart(userId, productId)
    res.status(200).json({ message: 'Item removed from cart' }) // Mengirimkan konfirmasi penghapusan item
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Controller untuk menghapus semua item di keranjang untuk user tertentu
export const clearCart = async (req, res) => {
  const { userId } = req.user // Mengambil userId dari token JWT

  try {
    await cartService.clearCart(userId)
    res.status(200).json({ message: 'All items cleared from cart' }) // Mengirimkan konfirmasi penghapusan semua item
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const checkout = async (req, res) => {
  // Pastikan token telah terverifikasi, dan ambil userId dari req.user
  const { id: userId } = req.user

  try {
    const { checkoutOrder, payment, transaction } =
      await cartService.checkout(userId)
    res
      .status(200)
      .json({ status: 'success', checkoutOrder, payment, transaction })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Controller untuk mendapatkan riwayat transaksi
export const getTransactionHistory = async (req, res) => {
  const { userId } = req.user // Mengambil userId dari token JWT

  try {
    const transactionHistory = await cartService.getTransactionHistory(userId)
    res.status(200).json({ status: 'success', transactionHistory })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
