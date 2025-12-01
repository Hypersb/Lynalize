/**
 * MongoDB Schema using Mongoose
 * Alternative to Prisma for MongoDB users
 */

import mongoose, { Schema, Document } from 'mongoose'

// User Interface
export interface IUser extends Document {
  name: string
  email: string
  password: string
  createdAt: Date
}

// User Schema
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

// Analysis Interface
export interface IAnalysis extends Document {
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
  createdAt: Date
}

// Analysis Schema
const AnalysisSchema = new Schema<IAnalysis>({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  metadata: {
    favicon: String,
    author: String,
    keywords: [String],
  },
  textAnalysis: {
    wordCount: Number,
    wordFrequency: Schema.Types.Mixed,
    sentiment: {
      score: Number,
      label: String,
      positive: Number,
      negative: Number,
      neutral: Number,
    },
  },
  mediaAnalysis: {
    dominantColors: [String],
    audioFeatures: {
      tempo: Number,
      energy: Number,
      danceability: Number,
      valence: Number,
    },
  },
  trends: {
    interest: [Number],
    timestamps: [String],
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
}, {
  timestamps: true,
})

// Indexes
AnalysisSchema.index({ userId: 1, createdAt: -1 })

// Models
export const User = mongoose.model<IUser>('User', UserSchema)
export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema)
