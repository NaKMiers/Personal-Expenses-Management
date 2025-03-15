import { NextRequest, NextResponse } from 'next/server';
import Budget from '@/models/BudgetModel'
import { connectDatabase } from '@/config/database'

// [DELETE]: /api/budgets/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Kết nối database
    await connectDatabase();

    // Lấy ID từ params
    const { id } = params;

    // Tìm và xóa ngân sách
    const deletedBudget = await Budget.findByIdAndDelete(id);

    // Kiểm tra nếu ngân sách không tồn tại
    if (!deletedBudget) {
      return NextResponse.json({ message: 'Budget not found' }, { status: 404 });
    }

    // Trả về response
    return NextResponse.json({ message: 'Budget deleted successfully' }, { status: 200 });
  } catch (err: any) {
    // Xử lý lỗi
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}