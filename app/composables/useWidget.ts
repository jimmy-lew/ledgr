import { WidgetBudget, WidgetGoal } from "#components"

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
  budget: {
    label: 'Budget',
    type: 'budget',
    icon: 'i-lucide-pie-chart',
    description: 'Monthly limit tracking',
    component: WidgetBudget
  },
  expenses: {
    label: 'Expenses',
    type: 'expenses',
    icon: 'i-lucide-credit-card',
    description: 'Automatic expense tracking',
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
    { id: 0, type: 'goal', current: 28, final: 100, name: 'New Bicycle', due: '1 Dec 2026' },
    { id: 1, type: 'goal', current: 50, final: 100, name: 'Ram', due: '1 Dec 2026' },
    { id: 3, type: 'budget' },
  ] as Widget[]
}

export const useWidget = createSharedComposable(async () => {
  const widgets = useState<Widget[]>('widgets', () => [])
  const { data } = await useAsyncData(getWidgets)
  if (data.value) widgets.value = data.value
  let id = 0
  const addWidget = (widget: Widget) => {
    const isImplemented = Boolean(meta[widget.type]?.component)
    if (!isImplemented)
      return
    widget.id = id
    widgets.value.unshift(widget)
    id += 1
    return widget
  }

  return { widgets, addWidget, meta }
})
