<script setup lang="ts">

type TabId = 'inbox' | 'issues' | 'pulse' | 'updates' | 'search'

const activeTab = ref<TabId>('inbox')
const showMenu = ref(false)

interface NavTab {
  id: TabId
  icon: string
  label: string
}

interface MenuItem {
  id: string
  icon: string
  label: string
}

const tabs: NavTab[] = [
  { id: 'inbox',   icon: 'lucide:inbox',            label: 'Inbox' },
  { id: 'issues',  icon: 'lucide:crosshair',         label: 'My Issues' },
  { id: 'pulse',   icon: 'lucide:zap',               label: 'Pulse' },
  { id: 'updates', icon: 'lucide:chevrons-up-down',  label: 'Updates' },
  { id: 'search',  icon: 'lucide:search',            label: 'Search' },
]

const menuItems: MenuItem[] = [
  { id: 'inbox',     icon: 'lucide:inbox',      label: 'Inbox' },
  { id: 'issues',    icon: 'lucide:crosshair',   label: 'My issues' },
  { id: 'pulse',     icon: 'lucide:zap',         label: 'Pulse' },
  { id: 'favorites', icon: 'lucide:star',        label: 'Favorites' },
  { id: 'projects',  icon: 'lucide:box',         label: 'Projects' },
  { id: 'views',     icon: 'lucide:layers',      label: 'Views' },
  { id: 'teams',     icon: 'lucide:users',       label: 'Teams' },
]

function handleTabClick(tabId: TabId) {
  if (tabId === 'inbox') {
    showMenu.value = !showMenu.value
  } else {
    activeTab.value = tabId
    showMenu.value = false
  }
}

function handleMenuItemClick(itemId: string) {
  activeTab.value = itemId as TabId
  showMenu.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Scrim / click-away -->
    <Presence>
      <Motion
        v-if="showMenu"
        as="div"
        class="fixed inset-0 z-10"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.15 }"
        @click="showMenu = false"
      />
    </Presence>

    <!-- Popover menu -->
    <Presence>
      <Motion
        v-if="showMenu"
        as="div"
        class="
          absolute bottom-[4.5rem] left-0 z-20
          w-64 rounded-2xl overflow-hidden
          bg-white dark:bg-zinc-900
          border border-zinc-100 dark:border-zinc-800
          shadow-xl shadow-black/10 dark:shadow-black/40
        "
        :initial="{ opacity: 0, y: 8, scale: 0.96 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: 8, scale: 0.96 }"
        :transition="{ duration: 0.18, easing: [0.32, 0.72, 0, 1] }"
      >
        <!-- User row -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <!-- Avatar -->
            <div class="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              J
            </div>
            <span class="text-[13px] font-medium text-zinc-800 dark:text-zinc-100 leading-none">jvnus</span>
            <UIcon name="lucide:chevron-down" class="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
          </div>
          <button class="p-0.5 rounded-md text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <UIcon name="lucide:settings" class="w-4 h-4" />
          </button>
        </div>

        <!-- Nav items -->
        <div class="py-1">
          <Motion
            v-for="(item, i) in menuItems"
            :key="item.id"
            as="button"
            class="
              w-full flex items-center gap-3 px-4 py-[9px] text-left
              transition-colors duration-100
              hover:bg-zinc-50 dark:hover:bg-zinc-800/70
            "
            :class="activeTab === item.id
              ? 'bg-zinc-100 dark:bg-zinc-800'
              : ''"
            :initial="{ opacity: 0, x: -6 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: i * 0.03, duration: 0.18 }"
            @click="handleMenuItemClick(item.id)"
          >
            <UIcon
              :name="item.icon"
              class="w-4 h-4 shrink-0"
              :class="activeTab === item.id
                ? 'text-zinc-800 dark:text-zinc-100'
                : 'text-zinc-400 dark:text-zinc-500'"
            />
            <span
              class="text-[13px]"
              :class="activeTab === item.id
                ? 'font-medium text-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-300'"
            >
              {{ item.label }}
            </span>
          </Motion>
        </div>

        <!-- Customize -->
        <div class="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2.5">
          <button class="text-[13px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            Customize
          </button>
        </div>
      </Motion>
    </Presence>

    <!-- Bottom pill navbar -->
    <div class="flex justify-start px-3 pb-3">
      <div
        class="
          flex items-center gap-0.5
          bg-white dark:bg-zinc-900
          rounded-full px-1.5 py-1.5
          shadow-[0_4px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.45)]
          border border-zinc-100 dark:border-zinc-800
        "
      >
        <Motion
          v-for="tab in tabs"
          :key="tab.id"
          as="button"
          class="relative flex items-center justify-center w-[52px] h-10 rounded-full"
          :whileTap="{ scale: 0.84 }"
          :transition="{ duration: 0.12 }"
          @click="handleTabClick(tab.id)"
        >
          <!-- Sliding active pill -->
          <Motion
            v-if="activeTab === tab.id"
            as="span"
            class="absolute inset-0 rounded-full bg-zinc-100 dark:bg-zinc-800"
            :layoutId="'navPill'"
            :transition="{ duration: 0.22, easing: [0.32, 0.72, 0, 1] }"
          />

          <UIcon
            :name="tab.icon"
            class="relative z-10 w-[18px] h-[18px] transition-colors duration-150"
            :class="activeTab === tab.id
              ? 'text-zinc-900 dark:text-zinc-50'
              : 'text-zinc-400 dark:text-zinc-500'"
          />
        </Motion>
      </div>
    </div>
  </div>
</template>
