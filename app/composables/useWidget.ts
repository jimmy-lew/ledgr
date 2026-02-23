import { WidgetBudget, WidgetGoal, WidgetExpenseChart } from "#components"
import { ulid } from 'ulid'

const meta: Record<WidgetType, WidgetConfig> = {
  goal: {
    label: 'Goal',
    type: 'goal',
    icon: 'i-lucide-target',
    description: 'Track your savings progress',
    fields: [
      { key: 'name', label: 'Goal Name', type: 'input', props: { placeholder: 'New Car' }, fieldClass: 'col-span-2' },
      { key: 'current', label: 'Saved', type: 'number', props: { min: 0, placeholder: '0' } },
      { key: 'final', label: 'Target', type: 'number', props: { min: 1, placeholder: '1000' } },
      { key: 'due', label: 'Due Date', type: 'date', fieldClass: 'col-span-2'},
    ],
    component: WidgetGoal,
  },
  expenses: {
    label: 'Expenses',
    type: 'expenses',
    icon: 'i-lucide-pie-chart',
    description: 'Expense breakdown by category',
    fields: [],
    component: WidgetExpenseChart
  },
  budget: {
    label: 'Budget',
    type: 'budget',
    icon: 'lucide:credit-card',
    description: ''
  },
  test: {
    label: 'Test',
    type: 'test',
    icon: 'i-lucide-flask-conical',
    description: 'Monthly limit tracking',
  },
}

const getWidgets = async () => {
  // Mock getting widgets from db
  return [
    {
      id: ulid(), type: 'expenses', categories: [
        { name: 'Transfers', amount: 450, color: 'oklch(58.5% 0.233 277.117)', icon: 'i-lucide-refresh-ccw' },
        { name: 'Shopping', amount: 250, color: 'oklch(74% 0.238 322.16)', icon: 'i-lucide-shopping-cart' },
        { name: 'Food', amount: 100, color: 'oklch(76.5% 0.177 163.223)', icon: 'i-lucide-utensils' },
        { name: 'Bills', amount: 85, color: 'oklch(74.6% 0.16 232.661)',  icon: 'i-lucide-receipt' }
      ]
    },
  ] as Widget[]
}

export const useWidget = createSharedComposable(async () => {
  const widgets = useState<Widget[]>('widgets', () => [])
  const { data } = await useAsyncData(getWidgets)
  if (data.value) widgets.value = data.value
  const addWidget = (widget: Widget) => {
    const isImplemented = Boolean(meta[widget.type]?.component)
    if (!isImplemented)
      return
    widget.id = ulid()
    widgets.value.unshift(widget)
    return widget
  }

  return { widgets, addWidget, meta }
})
