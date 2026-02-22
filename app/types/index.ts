import type { Component } from 'vue'

export interface GoalWidget {
  id: string
  type: 'goal'
  current: number
  final: number
  name: string
  due: string
}

export interface ExpensesWidget {
  id: string
  type: 'expenses'
  categories: any[]
}

export interface BudgetWidget {
  id: string
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

export interface NavSubItem {
  type?: 'divider' | undefined
  icon?: string
  title?: string
  click?: () => void
}

export interface NavItem {
  icon: string
  to?: string
  items?: NavSubItem[]
}
