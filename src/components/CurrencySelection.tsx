'use client'

import { currencies, CurrencyType } from '@/lib/currencies'
import { editUserSettingsApi, getUserSettingsApi } from '@/requests'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuSearch } from 'react-icons/lu'

interface CurrencySelectionProps {
  className?: string
}

function CurrencySelection({ className = '' }: CurrencySelectionProps) {
  // states
  const [open, setOpen] = useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType | null>(null)

  const [getting, setGetting] = useState<boolean>(false)
  const [editing, setEditing] = useState<boolean>(false)

  // initial set user settings
  useEffect(() => {
    const getUserSettings = async () => {
      // start loading
      setGetting(true)

      try {
        const { userSettings } = await getUserSettingsApi()
        console.log('userSettings', userSettings)

        const userCurrency =
          currencies.find(currency => currency.value === userSettings.currency) ?? null
        setSelectedCurrency(userCurrency)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop loading
        setGetting(false)
      }
    }

    getUserSettings()
  }, [])

  // change currency
  const handleChangeCurrency = useCallback(async (value: string) => {
    // start loading
    setEditing(true)

    toast.loading('Updating currency...', {
      id: 'update-currency',
    })

    try {
      const { updatedUserSettings } = await editUserSettingsApi(value)

      setSelectedCurrency(currencies.find(c => c.value === updatedUserSettings.currency) || null)

      toast.success('Currency updated successfully 🥳', {
        id: 'update-currency',
      })
    } catch (err: any) {
      console.log(err)
      toast.error(err.message, { id: 'update-currency' })
    } finally {
      // stop loading
      setEditing(false)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      {getting ? (
        <div className="loading h-9 rounded-md" />
      ) : (
        <button
          className="h-9 w-full rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold"
          onClick={() => setOpen(true)}
        >
          {selectedCurrency?.label || 'Set currency'}
        </button>
      )}

      {open && (
        <div
          className="fixed left-0 top-0 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 overflow-hidden rounded-md bg-neutral-950"
          >
            <div className="flex h-10 items-center border-b border-slate-200/30">
              <div className="flex h-8 w-10 items-center justify-center">
                <LuSearch size={16} />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Filter currency..."
                className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-sm placeholder:text-slate-300"
              />
            </div>

            <div className="flex flex-col p-1">
              {currencies.map(currency => (
                <button
                  className="trans-200 rounded-md bg-neutral-950 px-21/2 py-1.5 text-start text-sm font-semibold hover:bg-slate-200/30"
                  onClick={() => {
                    handleChangeCurrency(currency.value)
                    setSelectedCurrency(currency)
                    setOpen(false)
                  }}
                  disabled={getting || editing}
                  key={currency.locale}
                >
                  {currency.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CurrencySelection
