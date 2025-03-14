import mongoose from 'mongoose'
const Schema = mongoose.Schema

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      index: true,
    },
    icon: {
      type: String,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'investment'],
      required: true,
    },
  },
  { timestamps: true }
)

CategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true })

const CategoryModel = mongoose.models.category || mongoose.model('category', CategorySchema)
export default CategoryModel
