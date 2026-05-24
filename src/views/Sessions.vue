<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-bold tracking-tight">{{ $t('sessions.title') }}</h3>
        <p class="text-muted-foreground text-sm mt-1">{{ $t('sessions.subtitle') }}</p>
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
        <p>{{ $t('sessions.noSessions') }}</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div v-for="session in sessions" :key="session.id" class="p-5 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0 border border-border">
              <Globe class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-sm">{{ session.ip || $t('sessions.unknownIp') }}</h4>
                <span v-if="session.isCurrent" class="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">{{ $t('sessions.current') }}</span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">{{ session.userAgent || $t('sessions.unknownDevice') }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ $t('sessions.created') }}: {{ formatDate(session.createdAt || session.created_at) }}</p>
            </div>
          </div>
          
          <button 
            v-if="!session.isCurrent"
            @click="revokeSession(session.id)" 
            class="px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors"
          >
            {{ $t('sessions.revoke') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Activity, RefreshCw } from 'lucide-vue-next'
import request from '@/utils/request'

const { t } = useI18n()
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
  if (!confirm(t('sessions.revokeConfirm'))) return
  try {
    const res: any = await request.delete(`/auth/sessions/${id}`)
    if (res.code === 0) {
      sessions.value = sessions.value.filter(s => s.id !== id)
    } else {
      alert(res.message || t('sessions.revokeFailed'))
    }
  } catch (error) {
    alert(t('sessions.revokeFailed'))
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
