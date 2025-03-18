import * as profileService from '../services/profileService.js'

export const updateProfile = async (req, res) => {
  const { id: userId } = req.user
  const profileData = req.body

  try {
    const updatedUser = await profileService.updateProfile(userId, profileData)
    res.status(200).json({ status: 'success', data: updatedUser })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getProfile = async (req, res) => {
  const { userId } = req.user

  try {
    const userProfile = await profileService.getUserProfile(userId)
    res.status(200).json({ status: 'success', data: userProfile })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
