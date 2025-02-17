export type CurrencyType = {
  value: string
  label: string
  symbol: string
  locale: string
}

export const currencies: CurrencyType[] = [
  {
    value: 'USD',
    label: '$ Dollar',
    symbol: '$',
    locale: 'en-US',
  },
  {
    value: 'EUR',
    label: '€ Euro',
    symbol: '€',
    locale: 'de-DE',
  },
  {
    value: 'JPY',
    label: '¥ Yen',
    symbol: '¥',
    locale: 'ja-JP',
  },
  {
    value: 'GBP',
    label: '£ Pound',
    symbol: '£',
    locale: 'en-GB',
  },
]
