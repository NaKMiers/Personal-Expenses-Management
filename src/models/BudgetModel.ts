import mongoose, { Document, Schema } from 'mongoose';

interface IBudget extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  userId: string;
  amount: number;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const BudgetSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['monthly', 'yearly', 'project'], default: 'monthly' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
  },
  { timestamps: true }
);

const Budget = mongoose.models.Budget as mongoose.Model<IBudget> || mongoose.model<IBudget>('Budget', BudgetSchema);

export default Budget;