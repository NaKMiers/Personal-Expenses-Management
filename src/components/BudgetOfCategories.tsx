import { useEffect, useState } from 'react';
import { LuCalendar, LuX } from 'react-icons/lu';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import moment from 'moment';
import { getUserCategoriesApi } from '@/requests'
import { createBudgetApi } from '@/requests/budgetRequest'


interface Budget {
  id: string;
  type: 'income' | 'expense';
  categoryId: string;
  amount: number;
  startDate: string;
  endDate: string;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

const BudgetOfCategories = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    type: 'expense',
    categoryId: '',
    amount: '',
    startDate: moment().format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getUserCategoriesApi(formData.type as 'income' | 'expense');
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
      }
    };
    fetchCategories();
  }, [formData.type]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBudget: Budget = {
      id: Date.now().toString(),
      type: formData.type as 'income' | 'expense',
      categoryId: formData.categoryId,
      amount: Number(formData.amount),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    try {
      const response = await createBudgetApi(newBudget);
      console.log('Ngân sách đã được tạo:', response);

      setBudgets([...budgets, newBudget]);

      setFormData({ categoryId: '', type: 'expense', amount: '', startDate: '', endDate: '' });
    } catch (error) {
      console.error('Lỗi khi tạo ngân sách:', error);
    }
  };

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative max-w-lg w-full p-6 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-sm font-bold mb-4">Tạo ngân sách mới</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs font-bold">Loại ngân sách</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            <option value="expense">Chi tiêu</option>
            <option value="income">Thu nhập</option>
          </select>

          <label className="text-xs font-bold">Danh mục</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label className="text-xs font-bold">Số tiền</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
          />

          <div className="flex justify-between">
            <label className="text-xs font-bold">Ngày bắt đầu</label>
            <label className="text-xs font-bold">Ngày kết thúc</label>
          </div>

          <div className="flex space-x-3">
            {/* Chọn ngày bắt đầu */}
            <Popover>
              <PopoverTrigger className="w-full">
                <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-gray-600 bg-gray-800 px-2 text-white">
                  {moment(formData.startDate).format('MMM DD, YYYY')}
                  <LuCalendar size={18} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full rounded-md bg-gray-800">
                <Calendar
                  mode="single"
                  selected={new Date(formData.startDate)}
                  onSelect={(date) => {
                    if (date) {
                      setFormData({ ...formData, startDate: moment(date).format('YYYY-MM-DD') });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Chọn ngày kết thúc */}
            <Popover>
              <PopoverTrigger className="w-full">
                <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-gray-600 bg-gray-800 px-2 text-white">
                  {moment(formData.endDate).format('MMM DD, YYYY')}
                  <LuCalendar size={18} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-full rounded-md bg-gray-800">
                <Calendar
                  mode="single"
                  selected={new Date(formData.endDate)}
                  onSelect={(date) => {
                    if (date) {
                      setFormData({ ...formData, endDate: moment(date).format('YYYY-MM-DD') });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <button type="submit" className="mt-4 bg-white text-black font-medium p-2 rounded hover:bg-gray-200">
            {editingId ? 'Cập nhật' : 'Thêm ngân sách'}
          </button>
        </form>

        <button onClick={handleClose} className="absolute top-5 right-6 p-1 rounded-md hover:bg-gray-700">
          <LuX size={18} />
        </button>
      </div>
    </div>
  );
};

export default BudgetOfCategories;
