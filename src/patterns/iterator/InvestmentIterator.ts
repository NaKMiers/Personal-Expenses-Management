import Transaction from '@/patterns/prototypes/TransactionPrototype'
import Category from '@/patterns/prototypes/CategoryPrototype'

// Iterator Interface
export interface Iterator<T> {
  hasNext(): boolean
  next(): T | null
  reset(): void
  current(): T | null
}

// Collection Interface
export interface Iterable<T> {
  createIterator(): Iterator<T>
}

// Concrete Iterator for Investment Transactions
export class InvestmentTransactionIterator implements Iterator<Transaction> {
  private collection: Transaction[]
  private position: number = 0
  private filters: Record<string, any> = {}

  constructor(collection: Transaction[], filters: Record<string, any> = {}) {
    this.collection = collection
    this.filters = filters
    // Pre-filter the collection based on type
    this.collection = this.collection.filter(item => item.type === 'investment')
    // Apply additional filters
    this.applyFilters()
  }

  public hasNext(): boolean {
    return this.position < this.collection.length
  }

  public next(): Transaction | null {
    if (this.hasNext()) {
      return this.collection[this.position++]
    }
    return null
  }

  public current(): Transaction | null {
    if (this.position < this.collection.length) {
      return this.collection[this.position]
    }
    return null
  }

  public reset(): void {
    this.position = 0
  }

  private applyFilters(): void {
    if (Object.keys(this.filters).length === 0) return

    this.collection = this.collection.filter(item => {
      let includeItem = true

      for (const [key, value] of Object.entries(this.filters)) {
        if (key === 'minAmount' && item.amount < value) {
          includeItem = false
          break
        }
        if (key === 'maxAmount' && item.amount > value) {
          includeItem = false
          break
        }
        if (key === 'category' && (item.category as Category)._id !== value) {
          includeItem = false
          break
        }
        if (key === 'dateRange' && value.from && value.to) {
          const itemDate = new Date(item.date)
          if (itemDate < value.from || itemDate > value.to) {
            includeItem = false
            break
          }
        }
      }

      return includeItem
    })
  }
}

// Concrete Collection for Investment Transactions
export class InvestmentTransactionCollection implements Iterable<Transaction> {
  private items: Transaction[] = []
  private filters: Record<string, any> = {}

  constructor(items: Transaction[] = []) {
    this.items = items
  }

  public createIterator(): Iterator<Transaction> {
    return new InvestmentTransactionIterator(this.items, this.filters)
  }

  public addItem(item: Transaction): void {
    this.items.push(item)
  }

  public getItems(): Transaction[] {
    return this.items
  }

  public setFilters(filters: Record<string, any>): void {
    this.filters = filters
  }
}
