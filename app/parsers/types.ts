export interface Transaction {
  readonly date: string
  readonly type: string
  readonly description: string
  readonly withdrawal: number | null
  readonly deposit: number | null
  readonly balance: number
}

export interface Summary {
  readonly bank: string
  readonly accountNumber: string
  readonly transactions: readonly Transaction[]
}
