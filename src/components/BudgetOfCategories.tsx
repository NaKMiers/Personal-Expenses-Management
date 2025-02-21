import { useState } from 'react';

interface Budget {
  id: string;
  category: string;
  amount: number;
  month: string;
  year: string;
}

const BudgetOfCategories = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: '',
    year: new Date().getFullYear().toString()
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: `Tháng ${i + 1}`
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = {
      id: editingId || Date.now().toString(),
      category: formData.category,
      amount: Number(formData.amount),
      month: formData.month,
      year: formData.year
    };

    if (editingId) {
      setBudgets(budgets.map(b => b.id === editingId ? newBudget : b));
    } else {
      setBudgets([...budgets, newBudget]);
    }

    setFormData({
      category: '',
      amount: '',
      month: '',
      year: new Date().getFullYear().toString()
    });
    setEditingId(null);
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
      year: budget.year
    });
    setEditingId(budget.id);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Quản lý ngân sách</h1>

      {/* Form thêm/sửa ngân sách */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-neutral-800/30 border border-slate-200/30 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">Danh mục</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-slate-200/30 bg-neutral-800/30 p-2 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Số tiền (VND)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-slate-200/30 bg-neutral-800/30 p-2 text-white focus:border-blue-500 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Tháng</label>
            <select
              value={formData.month}
              onChange={(e) => setFormData({...formData, month: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-slate-200/30 bg-neutral-800/30 p-2 text-white focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Chọn tháng</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">Năm</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="mt-1 block w-full rounded-lg border border-slate-200/30 bg-neutral-800/30 p-2 text-white focus:border-blue-500 focus:ring-blue-500"
              min="2000"
              max="2100"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-amber-50 text-black py-2 px-4 rounded-lg hover: transition-colors"
        >
          {editingId ? 'Cập nhật' : 'Thêm'} ngân sách
        </button>
      </form>

      <div className="bg-neutral-800/30 p-6 rounded-lg border border-slate-200/30 mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">Danh sách ngân sách</h2>
        {budgets.length === 0 ? (
          <p className="text-gray-400">Chưa có ngân sách nào được thiết lập</p>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div
                key={budget.id}
                className="flex h-24 w-full items-center gap-5 rounded-lg border border-slate-200/30 bg-neutral-800/30 p-4"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white">{budget.category}</h3>
                  <p className="text-sm text-gray-400">
                    Tháng {budget.month}/{budget.year}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-white">
                    {new Intl.NumberFormat('vi-VN').format(budget.amount)}₫
                  </span>
                  <button
                    onClick={() => handleEdit(budget)}
                    className="text-blue-400 hover:text-blue-500 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetOfCategories;
