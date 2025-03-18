import * as productService from '../services/productService.js'

export const updateQuantity = async (req, res) => {
  // Ambil productId dan quantityChange dari body request
  const { productId, quantityChange } = req.body

  try {
    const updatedProduct = await productService.updateProductQuantity(
      productId,
      quantityChange
    )
    res.status(200).json({ status: 'success', data: updatedProduct })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id // ✅ Ambil userId dari token (user yang sedang login)

    if (!sellerId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found' })
    }

    const result = await productService.getProductsBySeller(sellerId)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
