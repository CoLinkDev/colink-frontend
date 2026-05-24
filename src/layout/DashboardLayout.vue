<template>
  <div class="min-h-screen bg-background text-foreground flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col transition-all">
      <div class="h-16 flex items-center px-6 border-b border-border">
        <h1 class="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">CoLink</h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          :class="[
            $route.path === item.path 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </router-link>
      </nav>
      <div class="p-4 border-t border-border">
        <button 
          @click="handleLogout"
          class="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut class="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative h-screen overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/30">
      <header class="h-16 flex items-center justify-between px-8 border-b border-border/50 bg-background/50 backdrop-blur sticky top-0 z-10">
        <h2 class="text-lg font-medium">{{ currentRouteName }}</h2>
        <div class="flex items-center gap-4">
          <!-- User Profile / Settings stub -->
          <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shadow-sm ring-2 ring-primary/20">
            U
          </div>
        </div>
      </header>
      <div class="p-8 max-w-5xl mx-auto w-full">
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
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LayoutDashboard, Settings, Activity, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Sessions', path: '/sessions', icon: Activity },
  { name: 'Settings', path: '/settings', icon: Settings }
]

const currentRouteName = computed(() => route.name)

const handleLogout = () => {
  // Add API call here if needed: request.post('/auth/logout')
  auth.clearToken()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
