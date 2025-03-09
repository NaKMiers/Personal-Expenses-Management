import { TransactionType } from '@/lib/types'
import { ICategory } from '@/models/CategoryModel'
import { categoryMediator } from '@/patterns/mediators/CategoryMediator'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useCallback, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LuCircleOff, LuX } from 'react-icons/lu'
import { RiDonutChartFill } from 'react-icons/ri'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface CreateCategoryDialogProps {
  trigger: ReactNode
  type: TransactionType
  refresh?: () => void
  update?: (category: ICategory) => void
  className?: string
}

function CreateCategoryDialog({
  trigger,
  type,
  refresh,
  update,
  className = '',
}: CreateCategoryDialogProps) {
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
      name: '',
      icon: '',
      type,
    },
  })

  // states
  const form = watch()
  const [open, setOpen] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  // create category
  const handleCreateCategory: SubmitHandler<FieldValues> = useCallback(
    async data => {
      // validate form
      if (!categoryMediator.validate(data, setError)) return

      // start loading
      setSaving(true)

      try {
        await categoryMediator.create(data, refresh, update)

        setOpen(false)
        reset()
      } catch (err: any) {
        toast.error('Failed to create category', { id: 'create-category' })
        console.log(err)
      } finally {
        // stop loading
        setSaving(false)
      }
    },
    [reset, refresh, update, setError]
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
                <div>
                  <p className="text-base font-semibold">
                    Create{' '}
                    <span className={`${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {type}
                    </span>{' '}
                    category
                  </p>
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

              {/* MARK: Name */}
              <div className="mt-3 text-xs">
                <p className="font-semibold">
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

                {/* MARK: Icon */}
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

                  <PopoverContent className="w-full translate-x-4 translate-y-1/2 p-0 outline-none">
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

                {/* MARK: Save */}
                <button
                  className="h-10 rounded-md bg-white px-21/2 text-[13px] font-semibold text-dark"
                  onClick={handleSubmit(handleCreateCategory)}
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

export default CreateCategoryDialog
