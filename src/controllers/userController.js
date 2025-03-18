import { getUsersByRole } from '../services/userService.js'

export const getAllUsersByRole = async (req, res) => {
  try {
    const users = await getUsersByRole('user')
    res.status(200).json({ status: 200, data: users })
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message })
  }
}
