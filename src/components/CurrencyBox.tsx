'use client'

import { useAppDispatch, useAppSelector } from '@/hooks'
import { currencies, CurrencyType } from '@/lib/currencies'
import { UserSettingsApis } from '@/patterns/proxies/UserSettingsApiProxy'
import { setUserSettings } from '@/reducers/settingsReducer'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LuSearch } from 'react-icons/lu'

function CurrencyBox() {
  return (
    <div className="relative w-full rounded-lg border border-slate-200/30 bg-neutral-800/50 p-21">
      <p className="font-bold">Currency</p>
      <p className="mb-3 text-sm text-slate-300">Set your default currency for transactions</p>

      <CurrencySelection />
    </div>
  )
}

export default CurrencyBox

function CurrencySelection() {
  // hooks
  const dispatch = useAppDispatch()
  const { userSettings } = useAppSelector(state => state.settings)

  // states
  const [open, setOpen] = useState<boolean>(false)
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType | null>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [filterText, setFilterText] = useState<string>('')
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyType[]>(currencies)

  useEffect(() => {
    const userCurrency = currencies.find(currency => currency.value === userSettings.currency) ?? null
    setSelectedCurrency(userCurrency)
  }, [userSettings])

  useEffect(() => {
    if (!filterText.trim()) {
      return setFilteredCurrencies(currencies)
    }

    const data = currencies.filter(({ label, value, locale }) => {
      const text = `${label} ${value} ${locale}`.toLowerCase()
      return text.includes(filterText.toLowerCase())
    })

    setFilteredCurrencies(data)
  }, [filterText])

  // change currency
  const handleChangeCurrency = useCallback(
    async (value: string) => {
      // start loading
      setEditing(true)

      toast.loading('Updating currency...', {
        id: 'update-currency',
      })

      try {
        const { updatedUserSettings } = await UserSettingsApis.editUserSettingsApi(value)

        setSelectedCurrency(currencies.find(c => c.value === updatedUserSettings.currency) || null)
        dispatch(setUserSettings(updatedUserSettings))

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
    },
    [dispatch]
  )

  return (
    <div className="relative">
      <button
        className="h-9 w-full rounded-md border border-slate-200/30 bg-neutral-950 px-21/2 text-start text-sm font-semibold"
        onClick={() => setOpen(true)}
      >
        {selectedCurrency?.label || 'Set currency'}
      </button>

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
            className="absolute left-0 top-0 z-20 overflow-hidden rounded-md bg-neutral-950"
          >
            <div className="flex h-10 items-center border-b border-slate-200/30">
              <div className="flex h-8 w-10 items-center justify-center">
                <LuSearch size={16} />
              </div>
              <input
                type="text"
                name="search"
                placeholder="Filter currency..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-sm placeholder:text-slate-300"
              />
            </div>

            <div className="flex max-h-[200px] flex-col overflow-y-auto p-1">
              {filteredCurrencies.map(currency => (
                <button
                  className="trans-200 rounded-md bg-neutral-950 px-21/2 py-1.5 text-start text-sm font-semibold hover:bg-slate-200/30"
                  onClick={() => {
                    handleChangeCurrency(currency.value)
                    setSelectedCurrency(currency)
                    setOpen(false)
                  }}
                  disabled={editing}
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
