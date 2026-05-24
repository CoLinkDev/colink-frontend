<template>
  <div class="min-h-screen bg-background text-foreground flex overflow-hidden">
    <!-- Mobile header with hamburger -->
    <div class="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur z-20 flex items-center justify-between px-4">
      <h1 class="text-xl font-bold">CoLink</h1>
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 text-muted-foreground hover:bg-secondary rounded-md">
        <Menu class="w-6 h-6" />
      </button>
    </div>

    <!-- Sidebar (responsive) -->
    <aside 
      :class="[
        'fixed md:relative top-0 left-0 z-30 h-full w-64 border-r border-border bg-card flex flex-col transition-transform duration-300',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-6 border-b border-border">
        <h1 class="text-xl font-bold">CoLink</h1>
        <button @click="mobileMenuOpen = false" class="md:hidden p-2 text-muted-foreground">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          :class="[
            $route.path === item.path 
              ? 'bg-secondary text-foreground font-medium' 
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ $t(item.nameKey) }}
        </router-link>
      </nav>

      <!-- User & Logout at bottom -->
      <div class="p-4 border-t border-border flex flex-col gap-2">
        <div class="flex items-center gap-3 px-3 py-2">
          <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-medium border border-border">
            U
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-medium truncate">User</p>
          </div>
        </div>
        <button 
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
        >
          <LogOut class="w-5 h-5" />
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
    <main class="flex-1 flex flex-col relative h-screen overflow-y-auto bg-background pt-16 md:pt-0">
      <header class="hidden md:flex h-16 items-center justify-between px-8 border-b border-border bg-background sticky top-0 z-10">
        <h2 class="text-lg font-medium">{{ currentRouteName }}</h2>
      </header>
      <div class="p-4 md:p-8 max-w-5xl mx-auto w-full">
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
