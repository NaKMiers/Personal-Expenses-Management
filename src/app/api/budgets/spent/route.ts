import { connectDatabase } from '@/config/database';
import TransactionModel from '@/models/TransactionModel';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// [GET]: /api/budgets/spent?categoryId=...&startDate=...&endDate=...
export async function GET(req: NextRequest) {
  try {
    await connectDatabase();
    const { searchParams } = new URL(req.nextUrl);
    const categoryId = searchParams.get('categoryId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!categoryId || !startDate || !endDate) {
      console.log("⚠ Thiếu tham số bắt buộc:", { categoryId, startDate, endDate });
      return NextResponse.json({ message: 'Thiếu tham số bắt buộc' }, { status: 400 });
    }

    console.log("🔍 Fetching data with params:", { categoryId, startDate, endDate });

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      console.log("❌ categoryId không hợp lệ:", categoryId);
      return NextResponse.json({ message: 'categoryId không hợp lệ' }, { status: 400 });
    }

    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);

    // 🛑 Log toàn bộ giao dịch để kiểm tra
    const transactions = await TransactionModel.find({
      category: categoryObjectId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
    }).lean(); // `lean()` giúp trả về object JSON đơn giản


    console.log("📊 Transactions found:", transactions.length);
    console.log("📊 Raw transactions:", JSON.stringify(transactions, null, 2));

    if (transactions.length === 0) {
      console.log("⚠ Không tìm thấy giao dịch nào.");
      return NextResponse.json({ spentAmount: 0 }, { status: 200 });
    }

    // 🔍 Tính tổng số tiền
    const totalSpent = await TransactionModel.aggregate([
      {
        $match: {
          category: categoryObjectId,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    console.log("💰 Total spent amount:", totalSpent);

    return NextResponse.json({ spentAmount: totalSpent[0]?.totalAmount || 0 }, { status: 200 });

  } catch (err: any) {
    console.error("❌ Error in API:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
