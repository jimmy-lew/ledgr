import type { Component } from 'vue'

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

export type WidgetType = (Widget extends { type: infer T } ? T : never) | 'test'

export interface WidgetConfig {
  label: string
  icon: string
  description: string
  type: WidgetType
  fields?: FormField[]
  component?: Component
}

export interface FormField {
  key: string
  label: string
  type: 'date' | 'boolean' | 'number' | 'input'
  props?: any
  fieldClass?: string
  class?: string
  ui?: any
}
