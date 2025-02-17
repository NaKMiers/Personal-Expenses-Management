import momentTZ from 'moment'

export const toUTC = (time: Date | string): string => {
  return momentTZ(time).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
