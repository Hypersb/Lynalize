// Simple in-memory analysis model for demo
// In production, replace with Prisma or Mongoose

export interface Analysis {
  id: string
  url: string
  title: string
  description: string
  images: string[]
  metadata: {
    favicon?: string
    author?: string
    keywords?: string[]
    publishDate?: string
  }
  textAnalysis?: {
    wordCount: number
    wordFrequency: Record<string, number>
    sentiment: {
      polarity: number
      subjectivity: number
      label: string
      positive: number
      negative: number
      neutral: number
    }
    summary?: string
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
  keyInsights?: string[]
  topics?: string[]
  userId: string
  createdAt: Date
}

class AnalysisModel {
  private analyses: Map<string, Analysis> = new Map()
  private idCounter = 1

  async create(data: Omit<Analysis, 'id' | 'createdAt'>): Promise<Analysis> {
    const analysis: Analysis = {
      id: (this.idCounter++).toString(),
      ...data,
      createdAt: new Date(),
    }
    this.analyses.set(analysis.id, analysis)
    return analysis
  }

  async findById(id: string): Promise<Analysis | undefined> {
    return this.analyses.get(id)
  }

  async findByUserId(userId: string): Promise<Analysis[]> {
    return Array.from(this.analyses.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async delete(id: string): Promise<void> {
    this.analyses.delete(id)
  }
}

export const analysisModel = new AnalysisModel()
