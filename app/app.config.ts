export default defineAppConfig({
  icon: {
    customize: (content: string, name: string, prefix: string, provider: string) => {
      if (prefix === 'lucide') {
        content = content.replace(/stroke-width="[^"]*"/g, 'stroke-width="3"')
      }
      return content
    }
  },
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'zinc'
    },
    drawer: {
      slots: {
        handle: '!mt-2',
        overlay: 'bg-black/5 dark:bg-transparent',
        content: '!rounded-t-4xl bg-[#FAFAFA] dark:bg-[#171717] ring-0'
      },
      compoundVariants: [
        {
          direction: ['bottom'],
          class: {
            handle: '!h-1 !w-10'
          }
        }
      ]
    }
  }
})
