import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { analysisService, AnalysisData } from '../services/analysis.service'
import ChartsDisplay from '../components/Dashboard/ChartsDisplay'
import DataTable from '../components/Dashboard/DataTable'
import ExportButton from '../components/Dashboard/ExportButton'
import { formatDate, getSentimentColor, getSentimentLabel } from '../lib/utils'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AnalysisDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      loadAnalysis(id)
    }
  }, [id])

  const loadAnalysis = async (analysisId: string) => {
    try {
      const data = await analysisService.getAnalysis(analysisId)
      setAnalysis(data)
    } catch (error) {
      toast.error('Failed to load analysis')
      console.error('Load analysis error:', error)
      navigate('/history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/history')}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to History</span>
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {analysis.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {analysis.description}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatDate(analysis.createdAt)}</span>
              <a
                href={analysis.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-primary-600 hover:underline"
              >
                <span>Visit URL</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
          <ExportButton analysisId={analysis.id} title={analysis.title} />
        </div>
      </motion.div>

      {/* Metadata */}
      {analysis.metadata && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Metadata
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.metadata.author && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Author:</span>
                <p className="text-gray-900 dark:text-gray-100">{analysis.metadata.author}</p>
              </div>
            )}
            {analysis.metadata.keywords && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Keywords:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {analysis.metadata.keywords.join(', ')}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Text Analysis */}
      {analysis.textAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Text Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Word Count</p>
              <p className="text-3xl font-bold text-primary-600">
                {analysis.textAnalysis.wordCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sentiment</p>
              <p className={`text-3xl font-bold ${getSentimentColor(analysis.textAnalysis.sentiment.score)}`}>
                {getSentimentLabel(analysis.textAnalysis.sentiment.score)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Score: {analysis.textAnalysis.sentiment.score.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unique Words</p>
              <p className="text-3xl font-bold text-primary-600">
                {Object.keys(analysis.textAnalysis.wordFrequency).length}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <ChartsDisplay analysis={analysis} />

      {/* Word Frequency Table */}
      {analysis.textAnalysis?.wordFrequency && (
        <DataTable
          data={Object.entries(analysis.textAnalysis.wordFrequency)
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)}
          columns={[
            { key: 'word', label: 'Word' },
            { key: 'count', label: 'Frequency' },
          ]}
        />
      )}

      {/* Images */}
      {analysis.images && analysis.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Images ({analysis.images.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {analysis.images.map((img, index) => (
              <a
                key={index}
                href={img}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity"
                />
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default AnalysisDetail
