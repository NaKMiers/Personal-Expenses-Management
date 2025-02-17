export type CurrencyType = {
  value: string
  label: string
  locale: string
}

export const currencies: CurrencyType[] = [
  {
    value: 'USD',
    label: '$ Dollar',
    locale: 'en-US',
  },
  {
    value: 'EUR',
    label: '€ Euro',
    locale: 'de-DE',
  },
  {
    value: 'JPY',
    label: '¥ Yen',
    locale: 'ja-JP',
  },
  {
    value: 'GBP',
    label: '£ Pound',
    locale: 'en-GB',
  },
]
