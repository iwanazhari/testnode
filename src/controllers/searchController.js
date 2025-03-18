import * as productService from '../services/searchService.js'

// Controller untuk search produk dengan pagination (menggunakan body request)
export const searchProduct = async (req, res) => {
  const { searchTerm, page, limit } = req.body
  const pageNum = parseInt(page) || 1 // default 1 jika tidak dikirim
  const limitNum = parseInt(limit) || 10 // default 10 jika tidak dikirim

  try {
    const searchResults = await productService.searchProduct(
      searchTerm,
      pageNum,
      limitNum
    )
    res.status(200).json(searchResults)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
