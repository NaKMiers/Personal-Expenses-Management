import { ICategory } from '@/models/CategoryModel'
import { createCategoryApi, editCategoryApi } from '@/requests'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LuCircleOff, LuX } from 'react-icons/lu'
import { RiDonutChartFill } from 'react-icons/ri'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface EditCategoryDialogProps {
  trigger: ReactNode
  category: ICategory
  update: (category: ICategory) => void
  className?: string
}

function EditCategoryDialog({ trigger, category, update, className = '' }: EditCategoryDialogProps) {
  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
    watch,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: category.name || '',
      icon: category.icon || '',
      type: category.type || 'expense',
    },
  })

  // states
  const form = watch()
  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  // validate form
  const handleValidate: SubmitHandler<FieldValues> = useCallback(
    data => {
      let isValid = true

      // type is required
      if (!data.type) {
        setError('type', {
          type: 'manual',
          message: 'Type is required',
        })
        isValid = false
      }

      // name is required
      if (!data.name) {
        setError('name', {
          type: 'manual',
          message: 'Name is required',
        })
        isValid = false
      }

      return isValid
    },
    [setError]
  )

  // create category
  const handleEditCategory: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!handleValidate(data)) return

      // start loading
      setSaving(true)

      toast.loading('Updating category...', { id: 'update-category' })

      try {
        const { updatedCategory, message } = await editCategoryApi(category._id, data)

        toast.success(message, { id: 'update-category' })
        setOpen(false)
        reset()

        update(updatedCategory)
      } catch (err: any) {
        toast.error('Failed to update category', { id: 'update-category' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [handleValidate, reset, update, category]
  )

  return (
    <>
      <div
        className={`${className}`}
        onClick={() => setOpen(true)}
      >
        {trigger}
      </div>
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
                <div>
                  <p className="text-base font-semibold">Edit category</p>
                  <p className="text-sm text-slate-300">
                    Categories are used to group your transactions
                  </p>
                </div>

                <button
                  onClick={() => setOpen(!open)}
                  className="trans-200 rounded-md p-1 hover:bg-slate-200/30"
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="mt-3 text-xs">
                <p className="mb-2 mt-2 font-semibold">
                  Type <span className="font-normal">(required)</span>
                </p>
                <Select
                  onValueChange={value => setValue('type', value)}
                  defaultValue={form.type}
                >
                  <SelectTrigger className="w-[125px] border border-slate-200/30">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900">
                    <SelectItem
                      value="income"
                      className="text-xs"
                    >
                      Income
                    </SelectItem>
                    <SelectItem
                      value="expense"
                      className="text-xs"
                    >
                      Expense
                    </SelectItem>
                    <SelectItem
                      value="investment"
                      className="text-xs"
                    >
                      Investment
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type?.message ? (
                  <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                    {errors.type?.message?.toString()}
                  </span>
                ) : (
                  <p className="mt-1 italic">
                    When you change this category type, all transactions related to this category will be
                    changed!
                  </p>
                )}

                <p className="mt-3 font-semibold">
                  Name <span className="font-normal">(required)</span>
                </p>
                <input
                  type="text"
                  className="mt-2 h-10 w-full rounded-md border border-slate-200/30 bg-transparent px-21/2"
                  {...register('name', { required: false })}
                  onFocus={() => clearErrors('name')}
                />
                {errors.name?.message && (
                  <span className="ml-1 mt-0.5 text-xs italic text-rose-400">
                    {errors.name?.message?.toString()}
                  </span>
                )}

                <p className="mt-3 font-semibold">
                  Icon <span className="font-normal">(optional)</span>
                </p>

                <Popover>
                  <PopoverTrigger className="w-full">
                    <button className="mt-2 flex h-[100px] w-full flex-col items-center justify-center rounded-md bg-neutral-800">
                      {form.icon ? (
                        <span className="block text-[48px] leading-[48px]">{form.icon}</span>
                      ) : (
                        <LuCircleOff size={48} />
                      )}
                      <p className="mt-1 text-xs text-slate-200">Click to select</p>
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full translate-y-1/2 p-0 outline-none">
                    <Picker
                      data={data}
                      onEmojiSelect={(emoji: any) => setValue('icon', emoji.native)}
                    />
                  </PopoverContent>
                </Popover>

                <p className="mt-2 text-slate-300">This is how your category will appear in the app</p>
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
                  onClick={handleSubmit(handleEditCategory)}
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
    </>
  )
}

export default EditCategoryDialog
