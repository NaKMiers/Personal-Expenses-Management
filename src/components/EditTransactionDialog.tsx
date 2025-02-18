'use client'

import CategoryPicker from '@/components/CategoryPicker'
import { useAppSelector } from '@/hooks'
import { currencies } from '@/lib/currencies'
import { toUTC } from '@/lib/utils'
import { IFullTransaction } from '@/models/TransactionModel'
import { editTransactionApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import moment from 'moment'
import { ReactNode, useCallback, useState } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LuCalendar, LuX } from 'react-icons/lu'
import { RiDonutChartFill } from 'react-icons/ri'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface EditTransactionDialogProps {
  trigger: ReactNode
  transaction: IFullTransaction
  update: (transaction: IFullTransaction) => void
  className?: string
}

function EditTransactionDialog({
  trigger,
  transaction,
  update,
  className = '',
}: EditTransactionDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    clearErrors,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      description: transaction.description || '',
      category: transaction.category || '',
      amount: transaction.amount || '',
      date: transaction.date || new Date(),
      type: transaction.type || 'expense',
    },
  })

  const form = watch()
  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  const { userSettings, exchangeRate } = useAppSelector(state => state.settings)

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // amount is required
      if (!data.amount) {
        setError('amount', {
          type: 'manual',
          message: 'Amount is required',
        })
        isValid = false
      }
      // amount must be >= 0
      else if (data.amount < 0) {
        setError('amount', {
          type: 'manual',
          message: 'Amount must be greater than or equal to 0',
        })
        isValid = false
      }

      // category must be selected
      if (!data.category) {
        setError('category', {
          type: 'manual',
          message: 'Category is required',
        })
        isValid = false
      }

      // date must be selected
      if (!data.date) {
        setError('date', {
          type: 'manual',
          message: 'Date is required',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // update transaction
  const handleEditTransaction: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setSaving(true)

      toast.loading('Updating transaction...', { id: 'update-transaction' })

      try {
        const { updatedTransaction, message } = await editTransactionApi(transaction._id, {
          ...data,
          date: toUTC(data.date),
          amount: data.amount / exchangeRate,
        })
        toast.success(message, { id: 'update-transaction' })
        update(updatedTransaction)
        setOpen(false)
      } catch (err: any) {
        toast.error('Failed to update transaction', { id: 'update-transaction' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [handleValidate, update, exchangeRate, transaction]
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
                <p className="text-base font-semibold">Edit transaction</p>

                <button
                  onClick={() => setOpen(!open)}
                  className="trans-200 rounded-md p-1 hover:bg-slate-200/30"
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="mt-3 text-xs">
                {/* Description */}
                <div className="flex flex-col">
                  <p className="font-semibold">
                    Description <span className="font-normal">(option)</span>
                  </p>
                  <input
                    type="text"
                    className="mt-2 h-10 w-full rounded-md border border-slate-200/30 bg-transparent px-21/2"
                    {...register('description', { required: false })}
                    onFocus={() => clearErrors('description')}
                  />
                  {errors.description?.message && (
                    <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                      {errors.description?.message?.toString()}
                    </span>
                  )}
                </div>

                {/* Amount */}
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
                      {...register('amount', { required: false })}
                      onFocus={() => clearErrors('amount')}
                    />
                  </div>{' '}
                  {errors.amount?.message && (
                    <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                      {errors.amount?.message?.toString()}
                    </span>
                  )}
                </div>

                <div className="flex gap-21/2">
                  {/* Category */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="mb-2 font-semibold">Category</p>
                    <div onFocus={() => clearErrors('category')}>
                      <CategoryPicker
                        initCategory={transaction.category}
                        onChange={(category: string) => setValue('category', category)}
                        type={form.type}
                      />
                    </div>
                    {errors.category?.message && (
                      <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                        {errors.category?.message?.toString()}
                      </span>
                    )}
                  </div>

                  {/* Transaction */}
                  <div className="mt-3 flex flex-1 flex-col">
                    <p className="mb-2 font-semibold">Transaction</p>
                    <div onFocus={() => clearErrors('date')}>
                      <Popover>
                        <PopoverTrigger className="w-full">
                          <button className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold">
                            {moment(form.date).format('MMM DD, YYYY')}
                            <LuCalendar size={18} />
                          </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-full overflow-hidden rounded-md p-0 outline-none">
                          <Calendar
                            className="bg-neutral-900"
                            mode="single"
                            selected={form.date}
                            onSelect={date => {
                              setValue('date', date)
                              clearErrors('date')
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {errors.date?.message && (
                      <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                        {errors.date?.message?.toString()}
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
                <button
                  className="h-10 rounded-md bg-white px-21/2 text-[13px] font-semibold text-dark"
                  onClick={handleSubmit(handleEditTransaction)}
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

export default EditTransactionDialog
