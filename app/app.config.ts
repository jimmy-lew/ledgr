export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'zinc'
    },
    drawer: {
      slots: {
        content: '!rounded-t-3xl bg-[#FAFAFA] dark:bg-[#171717] ring-0'
      }
    }
  }
})
