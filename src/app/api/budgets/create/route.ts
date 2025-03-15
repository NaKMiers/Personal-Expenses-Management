import { connectDatabase } from '@/config/database';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import Budget from '@/models/BudgetModel'

// [POST]: /budgets/create
export async function POST(req: NextRequest) {
  try {
    // Kết nối database
    await connectDatabase();

    // Lấy thông tin người dùng hiện tại
    const user = await currentUser();

    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!user) {
      redirect('/sign-in');
    }

    // Lấy dữ liệu từ request body
    const { name, categoryId, amount, type, startDate, endDate } = await req.json();

    // Tạo ngân sách mới
    const budget = await Budget.create({
      name,
      categoryId,
      userId: user.id,
      amount,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'active',
    });


    return NextResponse.json({ budget, message: 'Budget created successfully' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}