import { Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../middleware/auth.middleware'
import { userModel } from '../models/user.model'

/**
 * Register a new user
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({ message: 'All fields are required' })
      return
    }

    // Check if user exists
    const existingUser = await userModel.findByEmail(email)
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    })

    // Generate token
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    // @ts-ignore - JWT types issue with expiresIn
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn }
    )

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Login user
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    // Find user
    const user = await userModel.findByEmail(email)
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    // Generate token
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    // @ts-ignore - JWT types issue with expiresIn
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn }
    )

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Get current user
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const user = await userModel.findById(req.user.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
