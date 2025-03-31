import { connectDatabase } from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';
import Budget from '@/models/BudgetModel'

// [GET]: /api/budgets
export async function GET(req: NextRequest) {
  try {
    // Kết nối database
    await connectDatabase();

    // Lấy tham số từ query (nếu có)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Tạo query để lọc ngân sách
    const query: any = {};
    if (userId) {
      query.userId = userId;
    }

    // Lấy danh sách ngân sách từ database
    const budgets = await Budget.find(query);

    // Trả về response
    return NextResponse.json({ budgets }, { status: 200 });
  } catch (err: any) {
    // Xử lý lỗi
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}