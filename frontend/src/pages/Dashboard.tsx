import { useState } from 'react'
import { motion } from 'framer-motion'
import URLInput from '../components/Dashboard/URLInput'
import ChartsDisplay from '../components/Dashboard/ChartsDisplay'
import DataTable from '../components/Dashboard/DataTable'
import ExportButton from '../components/Dashboard/ExportButton'
import { BarChart3, TrendingUp, FileText, Image } from 'lucide-react'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'
import axios from 'axios'

const Dashboard = () => {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const handleAnalyze = async (url: string) => {
    setLoading(true)
    const toastId = 'analyze'
    toast.loading('Fetching and analyzing URL with Gemini AI...', { id: toastId })
    
    try {
      // Call backend API with Gemini integration
      const response = await axios.post('http://localhost:3000/api/analyze', { url })
      
      setAnalysis(response.data)
      setLoading(false)
      toast.success('Analysis completed successfully!', { id: toastId })
    } catch (error: any) {
      setLoading(false)
      console.error('Analysis error:', error)
      toast.error(
        error.response?.data?.message || 'Failed to analyze URL. Please check your Gemini API key.',
        { id: toastId }
      )
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Welcome to Lynalyze
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Comprehensive URL analysis with AI-powered insights
        </p>
      </motion.div>

      {/* URL Input */}
      <URLInput onAnalyze={handleAnalyze} loading={loading} />

      {/* Stats Overview */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Word Count</p>
                <p className="text-3xl font-bold text-primary-600">
                  {analysis.textAnalysis?.wordCount || 0}
                </p>
              </div>
              <FileText className="w-12 h-12 text-primary-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sentiment</p>
                <p className="text-3xl font-bold text-green-500">
                  Positive
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {((analysis.textAnalysis?.sentiment?.polarity || 0) * 100).toFixed(0)}% confidence
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Images Found</p>
                <p className="text-3xl font-bold text-primary-600">
                  {analysis.images?.length || 0}
                </p>
              </div>
              <Image className="w-12 h-12 text-primary-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Analysis Date</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatDate(analysis.createdAt)}
                </p>
              </div>
              <BarChart3 className="w-12 h-12 text-primary-600 opacity-20" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {analysis.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {analysis.description}
                </p>
                <a
                  href={analysis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  {analysis.url}
                </a>
              </div>
              <ExportButton analysisId={analysis.id} title={analysis.title} />
            </div>

            {/* Images Preview */}
            {analysis.images && analysis.images.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analysis.images.slice(0, 8).map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Charts */}
          <ChartsDisplay analysis={analysis} />

          {/* Word Frequency Table */}
          {analysis.textAnalysis?.wordFrequency && (
            <DataTable
              data={Object.entries(analysis.textAnalysis.wordFrequency)
                .map(([word, count]) => ({ word, count: count as number }))
                .sort((a: {word: string, count: number}, b: {word: string, count: number}) => b.count - a.count)
                .slice(0, 20)}
              columns={[
                { key: 'word', label: 'Word' },
                { key: 'count', label: 'Frequency' },
              ]}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!analysis && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BarChart3 className="w-24 h-24 mx-auto mb-6 text-gray-400" />
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Analysis Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Enter a URL above to start analyzing
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard
