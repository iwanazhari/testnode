import { checkSellerOrders } from '../services/orderService.js'

export const fetchSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id // Seller yang sedang login

    const sellerOrders = await checkSellerOrders(sellerId)

    res.status(200).json({
      status: 'success',
      message: sellerOrders.message,
      data: sellerOrders.hasOrders ? sellerOrders.orders : []
    })
  } catch (error) {
    res.status(403).json({
      status: 'error',
      message: error.message
    })
  }
}
