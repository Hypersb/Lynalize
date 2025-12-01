import { Router } from 'express'
import {
  analyzeUrl,
  getAnalysis,
  getUserAnalyses,
  deleteAnalysis,
} from '../controllers/analyze.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

/**
 * @route   POST /api/analyze
 * @desc    Analyze a URL with Gemini AI (no auth required for demo)
 * @access  Public
 */
router.post('/', analyzeUrl)

// Protected routes (require authentication)
router.use(authenticate)

/**
 * @route   GET /api/analyze/:id
 * @desc    Get analysis by ID
 * @access  Private
 */
router.get('/:id', getAnalysis)

/**
 * @route   GET /api/analyze/user
 * @desc    Get all analyses for current user
 * @access  Private
 */
router.get('/user', getUserAnalyses)

/**
 * @route   DELETE /api/analyze/:id
 * @desc    Delete an analysis
 * @access  Private
 */
router.delete('/:id', deleteAnalysis)

export default router
