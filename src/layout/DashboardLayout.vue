<template>
  <div class="min-h-screen bg-background text-foreground flex overflow-hidden">
    <!-- Mobile header with hamburger -->
    <div class="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/95 backdrop-blur z-20 flex items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
        </div>
        <h1 class="text-base font-semibold">CoLink</h1>
      </div>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
        <Menu class="w-5 h-5" />
      </button>
    </div>

    <!-- Sidebar (responsive) -->
    <aside 
      :class="[
        'fixed md:relative top-0 left-0 z-30 h-full w-[240px] border-r border-border bg-background flex flex-col transition-transform duration-300',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="h-14 flex items-center justify-between px-5">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary rounded-md flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>
          </div>
          <h1 class="text-base font-semibold">CoLink</h1>
        </div>
        <button @click="mobileMenuOpen = false" class="md:hidden p-1.5 text-muted-foreground">
          <X class="w-4 h-4" />
        </button>
      </div>
      
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm"
          :class="[
            $route.path === item.path 
              ? 'bg-muted font-medium text-foreground' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
        >
          <component :is="item.icon" class="w-4 h-4" />
          {{ $t(item.nameKey) }}
        </router-link>
      </nav>

      <!-- User & Logout at bottom -->
      <div class="p-4 flex flex-col gap-1">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-7 h-7 rounded-full bg-muted flex items-center justify-center font-medium border border-border text-xs">
            U
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium truncate">User</p>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut class="w-4 h-4" />
          {{ $t('nav.logout') }}
        </button>
      </div>
    </aside>

    <!-- Overlay for mobile menu -->
    <div 
      v-if="mobileMenuOpen" 
      @click="mobileMenuOpen = false"
      class="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative h-screen overflow-y-auto bg-muted/20 pt-14 md:pt-0">
      <header class="hidden md:flex h-14 items-center px-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b border-border/50">
        <h2 class="text-sm font-medium text-muted-foreground">{{ currentRouteName }}</h2>
      </header>
      <div class="p-4 md:p-8 max-w-6xl mx-auto w-full">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Settings, Activity, LogOut, Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const auth = useAuthStore()

const mobileMenuOpen = ref(false)

const navItems = [
  { nameKey: 'nav.dashboard', path: '/', icon: LayoutDashboard },
  { nameKey: 'nav.sessions', path: '/sessions', icon: Activity },
  { nameKey: 'nav.settings', path: '/settings', icon: Settings }
]

const currentRouteName = computed(() => {
  const currentItem = navItems.find(i => i.path === route.path)
  return currentItem ? t(currentItem.nameKey) : ''
})

const handleLogout = async () => {
  if (!confirm(t('settings.signOutConfirm'))) return
  try {
    await request.post('/auth/logout')
  } catch (e) {
    // Ignore error
  }
  auth.clearToken()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
