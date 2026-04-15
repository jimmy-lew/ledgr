import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    sidebar: defineCollection({
      type: 'data',
      source: 'sidebar/**/*.yml',
      schema: z.object({
        items: z.array(
          z.object({
            icon: z.string(),
            to: z.string(),
            label: z.string()
          })
        )
      })
    })
  }
})
