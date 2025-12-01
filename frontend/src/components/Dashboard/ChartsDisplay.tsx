import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { AnalysisData } from '../../services/analysis.service'

interface ChartsDisplayProps {
  analysis: AnalysisData
}

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const ChartsDisplay = ({ analysis }: ChartsDisplayProps) => {
  // Word frequency data for bar chart
  const wordFrequencyData = analysis.textAnalysis?.wordFrequency
    ? Object.entries(analysis.textAnalysis.wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }))
    : []

  // Sentiment data for pie chart
  const sentimentData = analysis.textAnalysis?.sentiment
    ? [
        { name: 'Positive', value: analysis.textAnalysis.sentiment.positive },
        { name: 'Negative', value: analysis.textAnalysis.sentiment.negative },
        { name: 'Neutral', value: analysis.textAnalysis.sentiment.neutral },
      ]
    : []

  // Trends data for line chart
  const trendsData = analysis.trends
    ? analysis.trends.timestamps.map((timestamp, index) => ({
        date: new Date(timestamp).toLocaleDateString(),
        interest: analysis.trends!.interest[index],
      }))
    : []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Word Frequency Bar Chart */}
      {wordFrequencyData.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Top 10 Most Frequent Words
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wordFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="word" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sentiment Pie Chart */}
      {sentimentData.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Sentiment Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trends Line Chart */}
      {trendsData.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Interest Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="interest"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Audio Features Radar Chart (if available) */}
      {analysis.mediaAnalysis?.audioFeatures && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Audio Features
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analysis.mediaAnalysis.audioFeatures).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {key}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ChartsDisplay
