import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Eye, Calendar } from 'lucide-react'
import { AnalysisData } from '../services/analysis.service'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

// Mock history data
const mockHistoryData: AnalysisData[] = [
  {
    id: 'history-1',
    url: 'https://example.com/article1',
    title: 'Tech Trends 2025 Analysis',
    description: 'Comprehensive analysis of emerging technology trends and their impact on digital transformation.',
    createdAt: new Date('2025-11-28').toISOString(),
    metadata: { author: 'Tech Insights', keywords: ['technology', 'trends', '2025'] },
    textAnalysis: {
      wordCount: 1250,
      sentiment: { polarity: 0.7, subjectivity: 0.5, label: 'positive', positive: 0.7, negative: 0.1, neutral: 0.2 },
      wordFrequency: { 'technology': 25, 'innovation': 20, 'digital': 18 }
    },
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'],
    trends: { timestamps: [new Date().toISOString()], interest: [75] }
  },
  {
    id: 'history-2',
    url: 'https://example.com/blog-post',
    title: 'Data Visualization Best Practices',
    description: 'Essential guidelines for creating effective and engaging data visualizations.',
    createdAt: new Date('2025-11-25').toISOString(),
    metadata: { author: 'Data Blog', keywords: ['visualization', 'data', 'design'] },
    textAnalysis: {
      wordCount: 980,
      sentiment: { polarity: 0.55, subjectivity: 0.6, label: 'positive', positive: 0.55, negative: 0.2, neutral: 0.25 },
      wordFrequency: { 'data': 30, 'visualization': 22, 'chart': 15 }
    },
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
    trends: { timestamps: [new Date().toISOString()], interest: [68] }
  },
  {
    id: 'history-3',
    url: 'https://example.com/research',
    title: 'AI and Machine Learning Insights',
    description: 'Latest research and developments in artificial intelligence and machine learning applications.',
    createdAt: new Date('2025-11-20').toISOString(),
    metadata: { author: 'Research Team', keywords: ['AI', 'machine learning', 'research'] },
    textAnalysis: {
      wordCount: 1580,
      sentiment: { polarity: 0.62, subjectivity: 0.55, label: 'positive', positive: 0.62, negative: 0.15, neutral: 0.23 },
      wordFrequency: { 'AI': 35, 'learning': 28, 'model': 24 }
    },
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400'],
    trends: { timestamps: [new Date().toISOString()], interest: [82] }
  }
]

const History = () => {
  const [analyses, setAnalyses] = useState<AnalysisData[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    // Simulate API delay
    setTimeout(() => {
      setAnalyses(mockHistoryData)
      setLoading(false)
    }, 500)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return
    }

    // Simulate deletion
    setAnalyses(analyses.filter((a) => a.id !== id))
    toast.success('Analysis deleted successfully')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Analysis History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage your past URL analyses
        </p>
      </motion.div>

      {analyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Calendar className="w-24 h-24 mx-auto mb-6 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No History Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Your analyzed URLs will appear here
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Start Analyzing
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {analysis.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {analysis.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(analysis.createdAt)}</span>
                    </div>
                    {analysis.textAnalysis && (
                      <div>
                        <span className="font-semibold">Words:</span> {analysis.textAnalysis.wordCount}
                      </div>
                    )}
                    {analysis.images && (
                      <div>
                        <span className="font-semibold">Images:</span> {analysis.images.length}
                      </div>
                    )}
                  </div>
                  <a
                    href={analysis.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline text-sm mt-2 inline-block"
                  >
                    {analysis.url}
                  </a>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/analysis/${analysis.id}`)}
                    className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(analysis.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History
