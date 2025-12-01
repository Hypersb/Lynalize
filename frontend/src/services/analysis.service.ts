import api from './api'

export interface AnalysisRequest {
  url: string
}

export interface AnalysisData {
  id: string
  url: string
  title: string
  description: string
  images: string[]
  metadata: {
    favicon?: string
    author?: string
    keywords?: string[]
  }
  textAnalysis?: {
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
  mediaAnalysis?: {
    dominantColors?: string[]
    audioFeatures?: {
      tempo?: number
      energy?: number
      danceability?: number
      valence?: number
    }
  }
  trends?: {
    interest: number[]
    timestamps: string[]
  }
  userId: string
  createdAt: string
}

export const analysisService = {
  analyzeUrl: async (data: AnalysisRequest): Promise<AnalysisData> => {
    const response = await api.post('/api/analyze/url', data)
    return response.data
  },

  getAnalysis: async (id: string): Promise<AnalysisData> => {
    const response = await api.get(`/api/analyze/${id}`)
    return response.data
  },

  getUserAnalyses: async (): Promise<AnalysisData[]> => {
    const response = await api.get('/api/analyze/user')
    return response.data
  },

  deleteAnalysis: async (id: string): Promise<void> => {
    await api.delete(`/api/analyze/${id}`)
  },

  exportToPdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/api/export/pdf/${id}`, {
      responseType: 'blob',
    })
    return response.data
  },

  exportToCsv: async (id: string): Promise<Blob> => {
    const response = await api.get(`/api/export/csv/${id}`, {
      responseType: 'blob',
    })
    return response.data
  },
}
