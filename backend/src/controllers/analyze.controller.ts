import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import { analysisModel } from '../models/analysis.model'
import { geminiService } from '../services/gemini.service'

/**
 * Analyze a URL with Gemini AI
 */
export const analyzeUrl = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { url } = req.body
    const userId = req.user?.id || 'demo-user' // Allow demo usage without auth

    // Validation
    if (!url) {
      res.status(400).json({ message: 'URL is required' })
      return
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      res.status(400).json({ message: 'Invalid URL format' })
      return
    }

    console.log(`🔍 Analyzing URL with Gemini: ${url}`)

    // Analyze URL with Gemini AI
    const geminiAnalysis = await geminiService.analyzeUrl(url)

    // Create analysis record
    const analysis = await analysisModel.create({
      url,
      title: geminiAnalysis.title,
      description: geminiAnalysis.description,
      images: geminiAnalysis.images,
      metadata: {
        author: geminiAnalysis.metadata.author,
        keywords: geminiAnalysis.metadata.keywords,
        publishDate: geminiAnalysis.metadata.publishDate
      },
      textAnalysis: {
        sentiment: geminiAnalysis.sentiment,
        wordFrequency: geminiAnalysis.wordFrequency,
        wordCount: geminiAnalysis.content.split(/\s+/).length,
        summary: geminiAnalysis.summary
      },
      trends: {
        timestamps: [new Date().toISOString()],
        interest: [Math.floor(Math.random() * 40) + 60] // 60-100 interest score
      },
      keyInsights: geminiAnalysis.keyInsights,
      topics: geminiAnalysis.topics,
      userId,
    })

    console.log(`✅ Analysis completed for: ${url}`)
    res.status(201).json(analysis)
  } catch (error) {
    console.error('Analyze URL error:', error)
    res.status(500).json({ 
      message: 'Failed to analyze URL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

/**
 * Get analysis by ID
 */
export const getAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const analysis = await analysisModel.findById(id)

    if (!analysis) {
      res.status(404).json({ message: 'Analysis not found' })
      return
    }

    // Check ownership
    if (analysis.userId !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    res.json(analysis)
  } catch (error) {
    console.error('Get analysis error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Get all analyses for current user
 */
export const getUserAnalyses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const analyses = await analysisModel.findByUserId(userId)
    res.json(analyses)
  } catch (error) {
    console.error('Get user analyses error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Delete an analysis
 */
export const deleteAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const userId = req.user!.id

    const analysis = await analysisModel.findById(id)

    if (!analysis) {
      res.status(404).json({ message: 'Analysis not found' })
      return
    }

    // Check ownership
    if (analysis.userId !== userId) {
      res.status(403).json({ message: 'Access denied' })
      return
    }

    await analysisModel.delete(id)
    res.json({ message: 'Analysis deleted successfully' })
  } catch (error) {
    console.error('Delete analysis error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
