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
    toast: {
      slots: {
        root: 'rounded-full ring-0 bg-white dark:bg-[#1d1d1d]',
      }
    },
    drawer: {
      slots: {
        handle: '!mt-2 -bottom-2',
        overlay: 'bg-black/5 dark:bg-transparent',
        content: 'bg-transparent ring-0 mx-2 mb-2'
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
