import { CustomiseDrawer, SettingsDrawer, StatementUpload, WidgetCreate } from '#components';

export const useOverlayItems = createSharedComposable(() => {
  const overlay = useOverlay()

  const statementDrawer = overlay.create(StatementUpload)
  const createWidgetModal = overlay.create(WidgetCreate)
  const customiseDrawer = overlay.create(CustomiseDrawer)
  const settingsDrawer = overlay.create(SettingsDrawer)

  const handleCustomize = () => {
    customiseDrawer.open()
  }

  const handleAddStatement = () => {
    statementDrawer.open()
  }

  const handleAddWidget = () => {
    createWidgetModal.open()
  }

  const handleSettings = () => {
    settingsDrawer.open()
  }

  return { handleCustomize, handleAddStatement, handleAddWidget, handleSettings }
})
