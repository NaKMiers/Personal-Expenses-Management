import mongoose from 'mongoose';

export abstract class Budget {
  _id?: mongoose.Types.ObjectId;

  constructor(
    public name: string,
    public categoryId: mongoose.Types.ObjectId,
    public userId: string,
    public amount: number,
    public startDate: Date,
    public endDate: Date,
    public type: string,
    public status: string = 'active'
  ) {}

  abstract calculateRemaining(): Promise<number>;
}
