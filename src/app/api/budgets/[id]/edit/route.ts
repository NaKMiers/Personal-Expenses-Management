import { connectDatabase } from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';
import Budget from '@/models/BudgetModel'

// [PUT]: /api/budgets/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Kết nối database
    await connectDatabase();

    // Lấy ID từ params
    const { id } = params;

    // Lấy dữ liệu từ request body
    const updateData = await req.json();

    // Tìm và cập nhật ngân sách
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      updateData, // Dữ liệu cần cập nhật
      { new: true } // Trả về bản ghi đã được cập nhật
    );

    // Kiểm tra nếu ngân sách không tồn tại
    if (!updatedBudget) {
      return NextResponse.json({ message: 'Budget not found' }, { status: 404 });
    }

    // Trả về response
    return NextResponse.json({ budget: updatedBudget, message: 'Budget updated successfully' }, { status: 200 });
  } catch (err: any) {
    // Xử lý lỗi
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}