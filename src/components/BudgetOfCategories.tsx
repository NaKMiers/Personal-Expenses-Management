import { useState } from 'react';
import { LuCalendar, LuX } from 'react-icons/lu'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import moment from 'moment/moment'

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
    setIsOpen(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-50 z-50">
      <div className="relative max-w-2xl w-full p-6 bg-neutral-950 text-white rounded-lg shadow-lg border-[0.5px] border-slate-200/30"
           onClick={handleBackgroundClick}>
        <h2 className="text-sm font-bold mb-4">Create a new <span className="text-yellow-500">budget</span> of categories</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="text-xs font-bold text-white mt-1">
            Category
          </div>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="p-2 rounded bg-transparent border-[0.5px] border-slate-200/30 text-white"
          />

          <div className="text-xs font-bold text-white mt-1">
            Amount <span className="font-normal">(Budget)</span>
          </div>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="p-2 rounded bg-transparent border-[0.5px] border-slate-200/30 text-white"
          />

          <div className="flex">
            <div className="text-xs font-bold text-white mt-1 mr-[150] xs:mr-[240] sm:mr-[260] lg:mr-[260]">
              Start day
            </div>

            <div className="text-xs font-bold text-white mt-1">
              Finish day
            </div>
          </div>

          <div className="flex space-x-3">

            <Popover>
              <PopoverTrigger className="w-full">
                <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold">
                  {moment().format('MMM DD, YYYY')}
                  <LuCalendar size={18} />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-full overflow-hidden rounded-md p-0 outline-none">
                <Calendar
                  className="bg-neutral-900"
                  mode="single"
                  onSelect={date => {
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger className="w-full">
                <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold">
                  {moment().format('MMM DD, YYYY')}
                  <LuCalendar size={18} />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-full overflow-hidden rounded-md p-0 outline-none">
                <Calendar
                  className="bg-neutral-900"
                  mode="single"
                  onSelect={date => {
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

          </div>

          <button type="submit" className="mt-4 bg-white font-medium p-2 rounded hover:bg-gray-50 text-black">
            {editingId ? 'Update' : 'Add'} budget
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm font-bold mb-2">Danh sách Ngân Sách</h3>
          {budgets.length === 0 ? <p className="text-xs">Chưa có ngân sách nào</p> :
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
