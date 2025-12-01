import { FileText, FileSpreadsheet } from 'lucide-react'
import { motion } from 'framer-motion'
import { analysisService } from '../../services/analysis.service'
import { downloadBlob } from '../../lib/utils'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface ExportButtonProps {
  analysisId: string
  title: string
}

const ExportButton = ({ analysisId, title }: ExportButtonProps) => {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: 'pdf' | 'csv') => {
    setLoading(true)
    try {
      const blob =
        format === 'pdf'
          ? await analysisService.exportToPdf(analysisId)
          : await analysisService.exportToCsv(analysisId)

      const filename = `${title.replace(/\s+/g, '-')}-analysis.${format}`
      downloadBlob(blob, filename)
      toast.success(`Exported to ${format.toUpperCase()} successfully`)
    } catch (error) {
      toast.error(`Failed to export to ${format.toUpperCase()}`)
      console.error('Export error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex gap-3"
    >
      <button
        onClick={() => handleExport('pdf')}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        <span>Export PDF</span>
      </button>
      <button
        onClick={() => handleExport('csv')}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Export CSV</span>
      </button>
    </motion.div>
  )
}

export default ExportButton
