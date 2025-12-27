import mongoose from 'mongoose'

// This schema represents the metadata structure for investment transactions
// It's not a separate MongoDB collection, but a guide for the "metadata" field in transactions
const InvestmentMetadataSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['active', 'pending', 'completed', 'losing'],
      default: 'active',
    },
    currentValue: {
      type: Number,
    },
    finalValue: {
      type: Number,
    },
    roi: {
      type: Number,
    },
    purchaseDate: {
      type: Date,
    },
    sellDate: {
      type: Date,
    },
    volatility: {
      type: Number,
      default: 0.1,
    },
    marketCondition: {
      type: Number,
      default: 0.5,
    },
    performanceTrend: {
      type: String,
      enum: ['rising', 'falling', 'stable', 'volatile'],
      default: 'stable',
    },
    historicalReturns: {
      type: [
        {
          date: Date,
          value: Number,
        },
      ],
      default: [],
    },
    marketCorrelation: {
      type: Number,
      default: 0.5,
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
)

// This is just for TypeScript typing and reference, not for creating a MongoDB model
export interface IInvestmentMetadata {
  status?: 'active' | 'pending' | 'completed' | 'losing'
  currentValue?: number
  finalValue?: number
  roi?: number
  purchaseDate?: Date
  sellDate?: Date
  volatility?: number
  marketCondition?: number
  performanceTrend?: 'rising' | 'falling' | 'stable' | 'volatile'
  historicalReturns?: { date: Date; value: number }[]
  marketCorrelation?: number
  notes?: string
}

export default InvestmentMetadataSchema
