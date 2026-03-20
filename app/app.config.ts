export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'zinc'
    },
    drawer: {
      slots: {
        handle: '!mt-1',
        overlay: 'bg-black/5 dark:bg-transparent',
        content: '!rounded-t-3xl bg-[#FAFAFA] dark:bg-[#171717] ring-0'
      },
      compoundVariants: [
        {
          direction: ['bottom'],
          class: {
            handle: '!h-1 !w-8'
          }
        }
      ]
    }
  }
})
