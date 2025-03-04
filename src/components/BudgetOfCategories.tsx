import { useState } from 'react';
import { LuX } from 'react-icons/lu'

interface Budget {
  id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

const BudgetOfCategories = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // State để mở/đóng modal

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = {
      id: editingId || Date.now().toString(),
      category: formData.category,
      amount: Number(formData.amount),
      month: Number(formData.month),
      year: Number(formData.year),
    };

    if (editingId) {
      setBudgets(budgets.map(b => (b.id === editingId ? newBudget : b)));
    } else {
      setBudgets([...budgets, newBudget]);
    }

    setFormData({ category: '', amount: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    setEditingId(null);
  };

  const handleEdit = (budget: Budget) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
      year: budget.year,
    });
    setEditingId(budget.id);
  };

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const handleClose = () => {
    setIsOpen(false); // Đóng modal khi nhấn nút Close
  };

  if (!isOpen) return null; // Nếu isOpen là false, không render modal

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-50 z-50">
      <div className="relative max-w-2xl w-full p-6 bg-neutral-950 text-white rounded-lg shadow-lg border-[0.5px] border-slate-200/30">
        <h2 className="text-2xl font-bold mb-4">Quản lý Ngân Sách</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Danh mục"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="p-2 rounded bg-transparent border-[0.5px] border-slate-200/30 text-white"
          />
          <input
            type="number"
            placeholder="Số tiền"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="p-2 rounded bg-transparent border-[0.5px] border-slate-200/30 text-white"
          />
          <input
            type="number"
            placeholder="Tháng"
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: Number(e.target.value) })}
            required
            className="p-2 rounded bg-transparent border-[0.5px] border-slate-200/30 text-white"
            min="1"
            max="12"
          />
          <input
            type="number"
            placeholder="Năm"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            required
            className="p-2 rounded bg-transparent border-[0.5px] border-slate-200/30 text-white"
            min="2000"
            max="2100"
          />
          <button type="submit" className="bg-white p-2 rounded hover:bg-gray-50 text-black">
            {editingId ? 'Cập nhật' : 'Thêm'} ngân sách
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Danh sách Ngân Sách</h3>
          {budgets.length === 0 ? <p>Chưa có ngân sách nào</p> :
            budgets.map(budget => (
              <div key={budget.id} className="flex justify-between items-center p-3 bg-gray-700 rounded mt-2">
                <span>{budget.category} - {budget.amount.toLocaleString()} VND - Tháng {budget.month}/{budget.year}</span>
                <div>
                  <button onClick={() => handleEdit(budget)} className="mr-2 text-yellow-400">✏️</button>
                  <button onClick={() => handleDelete(budget.id)} className="text-red-400">🗑️</button>
                </div>
              </div>
            ))}
        </div>

        <button
          onClick={handleClose}
          className="absolute top-5 right-6 trans-200 rounded-md p-1 hover:bg-slate-200/30"
        >
          <LuX size={18} />
        </button>
      </div>
    </div>
  );
};

export default BudgetOfCategories;
