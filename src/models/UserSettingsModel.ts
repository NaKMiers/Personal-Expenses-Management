import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSettingsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  { timestamps: true }
)

const UserSettingsModel =
  mongoose.models.userSettings || mongoose.model('userSettings', UserSettingsSchema)
export default UserSettingsModel

export interface IUserSettings {
  _id: string
  createdAt: string
  updatedAt: string

  userId: string
  currency: string
}
