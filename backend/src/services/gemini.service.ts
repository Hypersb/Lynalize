import { GoogleGenerativeAI } from '@google/generative-ai'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface UrlAnalysisResult {
  title: string
  description: string
  content: string
  metadata: {
    author?: string
    keywords: string[]
    publishDate?: string
  }
  sentiment: {
    polarity: number
    subjectivity: number
    label: string
    positive: number
    negative: number
    neutral: number
  }
  wordFrequency: Record<string, number>
  images: string[]
  keyInsights: string[]
  topics: string[]
  summary: string
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  async analyzeUrl(url: string): Promise<UrlAnalysisResult> {
    try {
      // 1. Fetch the webpage content
      const { content, images, metadata } = await this.fetchWebpage(url)

      // 2. Analyze with Gemini
      const analysis = await this.analyzeWithGemini(url, content)

      // 3. Calculate word frequency
      const wordFrequency = this.calculateWordFrequency(content)

      return {
        title: analysis.title || metadata.title || 'Untitled',
        description: analysis.description || metadata.description || '',
        content: content.substring(0, 5000), // First 5000 chars
        metadata: {
          author: metadata.author,
          keywords: analysis.keywords || metadata.keywords || [],
          publishDate: metadata.publishDate
        },
        sentiment: analysis.sentiment,
        wordFrequency,
        images: images.slice(0, 20), // Top 20 images
        keyInsights: analysis.keyInsights || [],
        topics: analysis.topics || [],
        summary: analysis.summary || ''
      }
    } catch (error) {
      console.error('Gemini analysis error:', error)
      throw new Error('Failed to analyze URL with Gemini')
    }
  }

  private async fetchWebpage(url: string) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000,
        maxRedirects: 5
      })

      const dom = new JSDOM(response.data)
      const document = dom.window.document

      // Extract text content
      const body = document.querySelector('body')
      const content = body?.textContent?.replace(/\s+/g, ' ').trim() || ''

      // Extract images
      const imgElements = Array.from(document.querySelectorAll('img'))
      const images = imgElements
        .map(img => {
          const src = img.getAttribute('src')
          if (!src) return null
          // Convert relative URLs to absolute
          try {
            return new URL(src, url).href
          } catch {
            return null
          }
        })
        .filter((src): src is string => src !== null && src.startsWith('http'))

      // Extract metadata
      const getMetaContent = (name: string) => {
        const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"], meta[property="og:${name}"]`)
        return meta?.getAttribute('content') || undefined
      }

      const metadata = {
        title: document.querySelector('title')?.textContent || undefined,
        description: getMetaContent('description'),
        author: getMetaContent('author'),
        keywords: getMetaContent('keywords')?.split(',').map(k => k.trim()) || [],
        publishDate: getMetaContent('article:published_time') || getMetaContent('publish_date')
      }

      return { content, images, metadata }
    } catch (error) {
      console.error('Webpage fetch error:', error)
      throw new Error('Failed to fetch webpage content')
    }
  }

  private async analyzeWithGemini(url: string, content: string) {
    try {
      const prompt = `Analyze the following webpage content from ${url} and provide a comprehensive analysis in JSON format.

Content (truncated to first 3000 characters):
${content.substring(0, 3000)}

Provide your analysis in this exact JSON structure:
{
  "title": "Main title or topic of the content",
  "description": "Brief description (2-3 sentences)",
  "summary": "Comprehensive summary (3-4 sentences)",
  "sentiment": {
    "polarity": (number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive),
    "subjectivity": (number between 0 and 1, where 0 is objective, 1 is subjective),
    "label": "positive" or "negative" or "neutral",
    "positive": (percentage as decimal, e.g., 0.65 for 65%),
    "negative": (percentage as decimal),
    "neutral": (percentage as decimal)
  },
  "keyInsights": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "topics": ["topic 1", "topic 2", "topic 3", "topic 4", "topic 5"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Make sure the sentiment percentages (positive, negative, neutral) add up to 1.0. Provide accurate, data-driven analysis.`

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to parse Gemini response')
      }

      const analysis = JSON.parse(jsonMatch[0])

      // Ensure sentiment values are valid
      if (!analysis.sentiment.positive || !analysis.sentiment.negative || !analysis.sentiment.neutral) {
        const polarity = analysis.sentiment.polarity || 0
        analysis.sentiment.positive = polarity > 0 ? Math.abs(polarity) * 0.7 : 0.2
        analysis.sentiment.negative = polarity < 0 ? Math.abs(polarity) * 0.7 : 0.1
        analysis.sentiment.neutral = 1 - analysis.sentiment.positive - analysis.sentiment.negative
      }

      return analysis
    } catch (error) {
      console.error('Gemini API error:', error)
      // Return default analysis if Gemini fails
      return {
        title: 'Analysis',
        description: 'Content analysis',
        summary: 'Unable to generate summary',
        sentiment: {
          polarity: 0,
          subjectivity: 0.5,
          label: 'neutral',
          positive: 0.33,
          negative: 0.33,
          neutral: 0.34
        },
        keyInsights: ['Content analyzed'],
        topics: ['General'],
        keywords: []
      }
    }
  }

  private calculateWordFrequency(content: string): Record<string, number> {
    // Remove special characters and convert to lowercase
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3) // Filter out short words

    // Count frequency
    const frequency: Record<string, number> = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    // Filter common words (stopwords)
    const stopwords = ['that', 'this', 'with', 'from', 'have', 'been', 'were', 'will', 'would', 'could', 'should', 'about', 'their', 'there', 'these', 'those', 'when', 'where', 'which', 'while']
    stopwords.forEach(word => delete frequency[word])

    // Get top 50 words
    const sorted = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)

    return Object.fromEntries(sorted)
  }
}

export const geminiService = new GeminiService()
