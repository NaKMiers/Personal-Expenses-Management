'use client'

import { useAppSelector } from '@/hooks'
import { currencies } from '@/lib/currencies'
import { AnimatePresence, motion } from 'framer-motion'
import moment from 'moment'
import { ReactNode, useCallback, useState, useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LuCalendar, LuX } from 'react-icons/lu'
import { RiDonutChartFill } from 'react-icons/ri'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import mongoose from 'mongoose'
import { BudgetFactory } from '@/patterns/factory/BudgetFactory'
import CategoryPicker from '@/components/CategoryPicker'

interface ICategory {
  _id: string; // Hoặc mongoose.Types.ObjectId
  name: string;
  type: string; // 'income', 'expense', 'investment'
}

interface CreateBudgetFormProps {
  trigger: ReactNode
  refresh?: () => void
  className?: string
}

function CreateBudgetForm({
                            trigger,
                            refresh,
                            className = '',
                          }: CreateBudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      amount: '',
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      type: 'monthly',
      categoryId: '',
    },
  })

  const form = watch()
  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)
  const { userSettings } = useAppSelector(state => state.settings)

  const handleCreateBudget = useCallback(
    async (data: FieldValues) => {
      // Validate data
      if (!data.name || !data.amount || !data.startDate || !data.endDate || !data.categoryId) {
        toast.error('Please fill all required fields')
        return
      }

      // Start loading
      setSaving(true)

      try {
        // Create budget using BudgetFactory
        const budget = BudgetFactory.createBudget(
          data.type, // Type from form
          data.name,
          new mongoose.Types.ObjectId(data.categoryId),
          userSettings.userId,
          parseFloat(data.amount),
          new Date(data.startDate),
          new Date(data.endDate),
        )

        // Log success
        toast.success('Budget created successfully')
        setOpen(false)
        reset()
        refresh?.() // Refresh data if needed
      } catch (err: any) {
        toast.error(err.message)
        console.error(err)
      } finally {
        // Stop loading
        setSaving(false)
      }
    },
    [reset, refresh, userSettings]
  )

  return (
    <div className={`relative ${className}`}>
      <div onClick={() => setOpen(true)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <div
            className="fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center px-21/2 md:px-21"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
              className="z-10 w-full max-w-[500px] rounded-lg border border-slate-200/30 bg-neutral-950 p-21"
            >
              <div className="flex items-start justify-between gap-21">
                <p className="text-base font-semibold">
                  Create a new Budget
                </p>

                <button
                  onClick={() => setOpen(!open)}
                  className="trans-200 rounded-md p-1 hover:bg-slate-200/30"
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="mt-3 text-xs">
                {/* MARK: Name */}
                <div className="flex flex-col">
                  <p className="font-semibold">
                    Name <span className="font-normal">(required)</span>
                  </p>
                  <input
                    type="text"
                    className="mt-2 h-10 w-full rounded-md border border-slate-200/30 bg-transparent px-21/2"
                    {...register('name', { required: true })}
                    onFocus={() => clearErrors('name')}
                  />
                  {errors.name?.message && (
                    <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                      {errors.name?.message?.toString()}
                    </span>
                  )}
                </div>

                {/* MARK: Amount */}
                <div className="flex flex-col">
                  <p className="mt-3 font-semibold">
                    Amount <span className="font-normal">(required)</span>
                  </p>
                  <div className="relative mt-2 flex h-10 w-full rounded-md border border-slate-200/30">
                    <span className="absolute left-0 top-0 flex h-full w-8 items-center justify-center text-base">
                      {currencies.find(c => c.value === userSettings.currency)?.symbol}
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="number-input h-full w-full bg-transparent px-21/2 pl-10"
                      {...register('amount', { required: true })}
                      onFocus={() => clearErrors('amount')}
                    />
                  </div>
                  {errors.amount?.message && (
                    <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                      {errors.amount?.message?.toString()}
                    </span>
                  )}
                </div>

                {/* MARK: Category */}
                <div className="mt-3 flex flex-1 flex-col">
                  <p className="mb-2 font-semibold">Category</p>
                  <div onFocus={() => clearErrors('category')}>
                    <CategoryPicker
                      onChange={(category: string) => setValue('category', category)}
                      type={"expense"}
                    />
                  </div>
                  {errors.category?.message && (
                    <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                        {errors.category?.message?.toString()}
                      </span>
                  )}
                </div>

                {/* MARK: Type */}
                <div className="mt-3 flex flex-col">
                  <p className="font-semibold">
                    Type <span className="font-normal">(required)</span>
                  </p>
                  <select
                    className="mt-2 h-10 w-full rounded-md border border-slate-200/30 bg-neutral-800 px-21/2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('type', { required: true })}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="project">Project</option>
                  </select>
                  {errors.type?.message && (
                    <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                      {errors.type?.message?.toString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-21/2">
                  {/* MARK: Start Date */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="mb-2 font-semibold">Start Date</p>
                    <div onFocus={() => clearErrors('startDate')}>
                      <Popover>
                        <PopoverTrigger className="w-full">
                          <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold">
                            {moment(form.startDate).format('MMM DD, YYYY')}
                            <LuCalendar size={18} />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full overflow-hidden rounded-md p-0 outline-none">
                          <Calendar
                            className="bg-neutral-900"
                            mode="single"
                            selected={new Date(form.startDate)}
                            onSelect={date => {
                              setValue('startDate', date)
                              clearErrors('startDate')
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {errors.startDate?.message && (
                      <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                        {errors.startDate?.message?.toString()}
                      </span>
                    )}
                  </div>

                  {/* MARK: End Date */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="mb-2 font-semibold">End Date</p>
                    <div onFocus={() => clearErrors('endDate')}>
                      <Popover>
                        <PopoverTrigger className="w-full">
                          <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold">
                            {moment(form.endDate).format('MMM DD, YYYY')}
                            <LuCalendar size={18} />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full overflow-hidden rounded-md p-0 outline-none">
                          <Calendar
                            className="bg-neutral-900"
                            mode="single"
                            selected={new Date(form.endDate)}
                            onSelect={date => {
                              setValue('endDate', date)
                              clearErrors('endDate')
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {errors.endDate?.message && (
                      <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                        {errors.endDate?.message?.toString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-21/2">
                <button
                  className="h-10 rounded-md bg-neutral-700 px-21/2 text-[13px] font-semibold"
                  onClick={() => {
                    setOpen(false)
                    reset()
                  }}
                >
                  Cancel
                </button>

                {/* MARK: Save */}
                <button
                  className="h-10 rounded-md bg-white px-21/2 text-[13px] font-semibold text-dark"
                  onClick={handleSubmit(handleCreateBudget)}
                >
                  {saving ? (
                    <RiDonutChartFill
                      size={20}
                      className="animate-spin text-slate-400"
                    />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CreateBudgetForm