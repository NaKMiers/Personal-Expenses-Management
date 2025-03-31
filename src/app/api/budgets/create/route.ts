import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Budget from '@/models/BudgetModel'
import Category from '@/models/CategoryModel' // Thêm import này
import mongoose from 'mongoose'

// [POST]: /budgets/create
export async function POST(req: NextRequest) {
  try {
    // Kết nối database
    await connectDatabase()

    // Lấy thông tin người dùng hiện tại
    const user = await currentUser()

    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Lấy dữ liệu từ request body
    const { name, categoryId, amount, type, startDate, endDate } = await req.json()

    // Validate dữ liệu đầu vào
    if (!name || !categoryId || !amount || !type || !startDate || !endDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Kiểm tra category có tồn tại và thuộc về user này không
    const category = await Category.findOne({
      _id: categoryId,
      userId: user.id,
    })

    if (!category) {
      return NextResponse.json({ message: 'Category not found or unauthorized' }, { status: 404 })
    }

    // Validate kiểu dữ liệu
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ message: 'Amount must be a positive number' }, { status: 400 })
    }

    // Validate ngày tháng
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (start >= end) {
      return NextResponse.json({ message: 'End date must be after start date' }, { status: 400 })
    }

    // Validate loại ngân sách
    const validTypes = ['monthly', 'yearly', 'project']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ message: 'Invalid budget type' }, { status: 400 })
    }

    // Tạo ngân sách mới
    const budget = await Budget.create({
      name,
      categoryId: new mongoose.Types.ObjectId(categoryId),
      userId: user.id,
      amount: parsedAmount,
      type,
      startDate: start,
      endDate: end,
      status: 'active',
    })

    return NextResponse.json(
      {
        budget,
        message: 'Budget created successfully',
      },
      { status: 201 } // Sử dụng status 201 cho resource được tạo thành công
    )
  } catch (err: any) {
    console.error('Error creating budget:', err)
    return NextResponse.json({ message: err.message || 'Internal server error' }, { status: 500 })
  }
}
