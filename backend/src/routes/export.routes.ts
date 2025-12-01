import { Router } from 'express'
import { exportToPdf, exportToCsv } from '../controllers/export.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

// All routes require authentication
router.use(authenticate)

/**
 * @route   GET /api/export/pdf/:id
 * @desc    Export analysis to PDF
 * @access  Private
 */
router.get('/pdf/:id', exportToPdf)

/**
 * @route   GET /api/export/csv/:id
 * @desc    Export analysis to CSV
 * @access  Private
 */
router.get('/csv/:id', exportToCsv)

export default router
