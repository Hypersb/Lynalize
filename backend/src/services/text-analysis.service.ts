import axios from 'axios'

interface TextAnalysisResult {
  wordCount: number
  wordFrequency: Record<string, number>
  sentiment: {
    score: number
    label: string
    positive: number
    negative: number
    neutral: number
  }
}

/**
 * Analyze text using Python microservice or built-in logic
 */
export async function analyzeText(text: string): Promise<TextAnalysisResult> {
  try {
    // Try to use Python microservice if available
    if (process.env.PYTHON_SERVICE_URL) {
      try {
        const response = await axios.post(
          `${process.env.PYTHON_SERVICE_URL}/analyze/text`,
          { text },
          { timeout: 5000 }
        )
        return response.data
      } catch (error) {
        console.warn('Python service unavailable, using fallback analysis')
      }
    }

    // Fallback to basic analysis
    return basicTextAnalysis(text)
  } catch (error) {
    console.error('Text analysis error:', error)
    return basicTextAnalysis(text)
  }
}

/**
 * Basic text analysis without external dependencies
 */
function basicTextAnalysis(text: string): TextAnalysisResult {
  // Clean and tokenize
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2)

  const wordCount = words.length

  // Calculate word frequency
  const wordFrequency: Record<string, number> = {}
  words.forEach((word) => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  })

  // Simple sentiment analysis based on keyword matching
  const positiveWords = [
    'good',
    'great',
    'excellent',
    'amazing',
    'wonderful',
    'fantastic',
    'love',
    'best',
    'perfect',
    'happy',
  ]
  const negativeWords = [
    'bad',
    'terrible',
    'awful',
    'horrible',
    'hate',
    'worst',
    'poor',
    'sad',
    'disappointing',
  ]

  let positive = 0
  let negative = 0

  words.forEach((word) => {
    if (positiveWords.includes(word)) positive++
    if (negativeWords.includes(word)) negative++
  })

  const total = positive + negative || 1
  const score = (positive - negative) / total
  const neutral = 1 - (positive + negative) / wordCount

  let label = 'Neutral'
  if (score > 0.3) label = 'Positive'
  else if (score < -0.3) label = 'Negative'

  return {
    wordCount,
    wordFrequency,
    sentiment: {
      score,
      label,
      positive: positive / total,
      negative: negative / total,
      neutral: Math.max(0, neutral),
    },
  }
}
