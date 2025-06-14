/* eslint-disable no-unused-vars */
import type { Request, Response } from 'express'
import userService from '../services/user.service'
import { respond } from '../utils/api-response.utils'

export const userProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      respond.error(res, 'User ID is required', 401)
      return
    }
    const user = await userService.getUserProfile(req.userId)
    respond.success(res, { ...user })
    return
  } catch (error) {
    respond.error(res, 'User not found', 404)
    return
  }
}

export const completeProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId
    const { fullName, username } = req.body
    if (!userId) {
      respond.error(res, 'User ID is required', 401)
      return
    }
    const updatedUser = await userService.completeProfile(userId, fullName, username)
    if (!updatedUser) {
      respond.error(res, 'Failed to update profile', 404)
      return
    }

    respond.success(res, {
      message: 'Profile updated successfully',
      updatedUser
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    let status: number
    switch (true) {
      case message === 'User not found':
        status = 404
        break
      case message === 'Username already exists':
        status = 400
        break
      default:
        status = 500
        break
    }
    respond.error(res, message, status)
    return
  }
}
