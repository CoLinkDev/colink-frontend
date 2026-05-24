<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-bold tracking-tight">Active Sessions</h3>
        <p class="text-muted-foreground text-sm mt-1">Manage your active login sessions across all devices.</p>
      </div>
      <button @click="fetchSessions" class="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div v-if="loading && sessions.length === 0" class="flex justify-center py-12">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="sessions.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Activity class="w-12 h-12 mb-4 opacity-50" />
        <p>No active sessions found.</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div v-for="session in sessions" :key="session.id" class="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0">
              <Globe class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-sm">{{ session.ip || 'Unknown IP' }}</h4>
                <span v-if="session.isCurrent" class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Current</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">{{ session.userAgent || 'Unknown Device' }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">Created: {{ formatDate(session.createdAt || session.created_at) }}</p>
            </div>
          </div>
          
          <button 
            v-if="!session.isCurrent"
            @click="revokeSession(session.id)" 
            class="px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Globe, Activity, RefreshCw } from 'lucide-vue-next'
import request from '@/utils/request'

const sessions = ref<any[]>([])
const loading = ref(false)

const fetchSessions = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/auth/sessions')
    if (res.code === 0) {
      sessions.value = res.data?.sessions || []
    }
  } catch (error) {
    console.error('Failed to fetch sessions', error)
  } finally {
    loading.value = false
  }
}

const revokeSession = async (id: string) => {
  if (!confirm('Are you sure you want to revoke this session?')) return
  try {
    const res: any = await request.delete(`/auth/sessions/${id}`)
    if (res.code === 0) {
      sessions.value = sessions.value.filter(s => s.id !== id)
    } else {
      alert(res.message || 'Failed to revoke session')
    }
  } catch (error) {
    alert('Failed to revoke session')
  }
}

const formatDate = (ts: string | number) => {
  if (!ts) return 'Unknown'
  return new Date(ts).toLocaleString()
}

onMounted(() => {
  fetchSessions()
})
</script>
