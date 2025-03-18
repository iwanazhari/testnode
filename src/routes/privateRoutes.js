import { Router } from 'express'
import * as profileController from '../controllers/profileControllers.js'

import * as ProductController from '../controllers/productController.js'
import * as cartController from '../controllers/CartControllers.js'
import * as searchController from '../controllers/searchController.js'
import { authenticate } from '../middleware/authenticate.js'
import { rateLimiter } from '../middleware/rateLimiter.js'
import * as userController from '../controllers/userController.js'
import * as orderController from '../controllers/orderControllers.js'
import {
  validateCheckout,
  validateUpdateQuantity
} from '../middleware/validateRequest.js'

const privateRouter = Router()

// Rute untuk menambahkan produk ke keranjang
privateRouter.post('/cart', authenticate, rateLimiter, cartController.addToCart)

privateRouter.put(
  '/cart',
  authenticate,
  rateLimiter,
  cartController.updateCartQuantity
)

// Rute untuk mendapatkan semua produk di keranjang
privateRouter.get(
  '/cart',
  authenticate,
  rateLimiter,
  cartController.getCartItems
)

// Rute untuk menghapus produk dari keranjang
privateRouter.delete(
  '/cart',
  authenticate,
  rateLimiter,
  cartController.removeFromCart
)

// Rute untuk menghapus semua item di keranjang
privateRouter.delete(
  '/cart/clear',
  authenticate,
  rateLimiter,
  cartController.clearCart
)

privateRouter.post(
  '/checkout',
  authenticate,
  rateLimiter,
  cartController.checkout
)

privateRouter.get(
  '/seller/checkout',
  authenticate,
  orderController.fetchSellerOrders
)

privateRouter.get(
  '/user',
  authenticate,
  rateLimiter,
  userController.getAllUsersByRole
)

// Rute untuk mendapatkan riwayat transaksi
privateRouter.get(
  '/transactions',
  authenticate,
  rateLimiter,
  cartController.getTransactionHistory
)

privateRouter.put(
  '/profile',
  authenticate,
  rateLimiter,
  profileController.updateProfile
)

privateRouter.get(
  '/profile',
  authenticate,
  rateLimiter,
  profileController.getProfile
)
privateRouter.get(
  '/products/search',
  authenticate,
  rateLimiter,
  searchController.searchProduct
)

privateRouter.put(
  '/products/quantity',
  authenticate,
  rateLimiter,
  validateUpdateQuantity,
  ProductController.updateQuantity
)

privateRouter.get(
  '/products',
  authenticate,
  ProductController.getSellerProducts
)

export { privateRouter }
