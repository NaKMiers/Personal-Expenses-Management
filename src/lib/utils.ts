import momentTZ from 'moment'

export const toUTC = (time: Date | string): string => {
  return momentTZ(time).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { currencies } from './currencies'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatSymbol = (currency: string): string =>
  currencies.find(c => c.value === currency)?.symbol || ''

export const formatCurrency = (currency: string, amount: number, rate: number): string => {
  const symbol = formatSymbol(currency)
  const value = amount * rate
  return symbol + ' ' + value.toFixed(2)
}

export const formatPrice = (price: number = 0) => {
  return Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
