import mongoose from 'mongoose'

class DatabaseManager {
  private static instance: DatabaseManager | null = null
  private connection: mongoose.Connection | null = null

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  public async connect(): Promise<mongoose.Connection> {
    if (this.connection) {
      console.log('Returning cached database connection')
      return this.connection
    }

    try {
      await mongoose.connect(process.env.MONGODB!)
      this.connection = mongoose.connection

      this.connection.on('connected', () => {
        console.log('MongoDB connected successfully')
      })

      this.connection.on('error', err => {
        console.log('MongoDB connection error:', err)
      })

      return this.connection
    } catch (err: any) {
      console.log('Something goes wrong!')
      console.log(err)
      throw new Error('Unable to connect to database')
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect()
      this.connection = null
      console.log('MongoDB disconnected')
    }
  }
}

export async function connectDatabase(): Promise<mongoose.Connection> {
  return await DatabaseManager.getInstance().connect()
}

export default DatabaseManager
