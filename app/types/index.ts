
export interface GoalWidget {
  id: string | number
  type: 'goal'
  current: number
  final: number
  name: string
  due: string
}

export interface ExpensesWidget {
  id: string | number
  type: 'expenses'
  categories: any[]
}

export interface BudgetWidget {
  id: string | number
  type: 'budget'
}

export type Widget = GoalWidget | ExpensesWidget | BudgetWidget

export interface FormField {
  key: string
  label: string
  type: 'date' | 'boolean' | 'number' | 'input'
  props?: any
  class?: string
  ui?: any
}
