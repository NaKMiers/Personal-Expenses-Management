import mongoose from 'mongoose'

class DatabaseManager {
  private static instance: DatabaseManager | null = null
  private connection: mongoose.Connection | null = null

  // Private constructor to prevent direct construction calls with 'new'
  private constructor() {}

  // Static method to access the singleton instance
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  // Connect to the database
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

      this.connection.on('error', error => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error)
      })

      return this.connection
    } catch (error) {
      console.log('Something goes wrong!')
      console.log(error)
      throw new Error('Unable to connect to database')
    }
  }

  // Disconnect from the database
  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect()
      this.connection = null
      console.log('MongoDB disconnected')
    }
  }
}

export async function connectDatabase() {
  return await DatabaseManager.getInstance().connect()
}

export default DatabaseManager
