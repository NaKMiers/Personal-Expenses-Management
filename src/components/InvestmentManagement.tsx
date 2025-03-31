import React from 'react'
import toast from 'react-hot-toast'

// Định nghĩa interface cho Investment và Category
interface Investment {
  _id: string // Thay id bằng _id để khớp với MongoDB
  category: string // categoryId
  amount: number
  status: 'active' | 'pending' | 'completed' | 'losing'
}

interface Category {
  _id: string
  name: string
}

interface InvestmentManagementProps {
  investments: Investment[]
  categories: Category[]
  refresh: () => void
}

const InvestmentManagement: React.FC<InvestmentManagementProps> = ({
  investments,
  categories,
  refresh,
}) => {
  // Hàm tìm tên danh mục dựa trên categoryId
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category ? category.name : 'Unknown'
  }

  // Hàm cập nhật trạng thái qua API
  const changeInvestmentState = async (
    id: string,
    newState: 'active' | 'pending' | 'completed' | 'losing'
  ) => {
    try {
      const response = await fetch(`/api/investments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newState }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      toast.success('Status updated successfully')
      refresh() // Làm mới dữ liệu
    } catch (error) {
      toast.error('Error updating status')
      console.error(error)
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Investment Management</h2>
      {investments.length === 0 ? (
        <p className="text-gray-400">No investments found.</p>
      ) : (
        investments.map(investment => (
          <div
            key={investment._id}
            className="mb-2 flex items-center justify-between rounded-lg border border-slate-200/30 bg-neutral-800/30 p-4"
          >
            <div>
              <p className="font-semibold">{getCategoryName(investment.category)}</p>
              <p className="text-gray-400">đ {investment.amount.toLocaleString()}</p>
            </div>
            <div>
              <select
                className="rounded-md border border-gray-500 bg-black p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={investment.status}
                onChange={e =>
                  changeInvestmentState(
                    investment._id,
                    e.target.value as 'active' | 'pending' | 'completed' | 'losing'
                  )
                }
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="losing">Losing</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default InvestmentManagement
