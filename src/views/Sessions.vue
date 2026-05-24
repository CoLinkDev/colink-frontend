<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h3 class="text-xl font-semibold tracking-tight">{{ $t('sessions.title') }}</h3>
        <p class="text-muted-foreground text-sm">{{ $t('sessions.subtitle') }}</p>
      </div>
      <button @click="fetchSessions" class="p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div v-if="loading && sessions.length === 0" class="flex justify-center py-12">
        <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="sessions.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Activity class="w-10 h-10 mb-4 opacity-40" stroke-width="1.5" />
        <p class="text-sm font-medium">{{ $t('sessions.noSessions') }}</p>
      </div>

      <div v-else class="divide-y divide-border">
        <div v-for="session in sessions" :key="session.id" class="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-foreground shrink-0">
              <Globe class="w-4 h-4" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-medium text-sm">{{ session.ip || $t('sessions.unknownIp') }}</h4>
                <span v-if="session.isCurrent" class="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-widest">{{ $t('sessions.current') }}</span>
              </div>
              <p class="text-xs text-muted-foreground mt-0.5">{{ session.userAgent || $t('sessions.unknownDevice') }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ $t('sessions.created') }}: {{ formatDate(session.createdAt || session.created_at) }}</p>
            </div>
          </div>
          
          <button 
            v-if="!session.isCurrent"
            @click="triggerRevokeSession(session.id)" 
            class="px-2.5 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors"
          >
            {{ $t('sessions.revoke') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Revoke Session Dialog -->
    <Dialog 
      v-model:open="confirmDialogOpen"
      :title="$t('sessions.revokeConfirm')"
      description=""
      :confirmText="$t('sessions.revoke')"
      :cancelText="locale === 'zh-CN' ? '取消' : 'Cancel'"
      variant="destructive"
      @confirm="confirmRevokeSession"
    />

    <!-- Alert Message Dialog -->
    <Dialog 
      v-model:open="alertDialog.open"
      :title="alertDialog.title"
      :description="alertDialog.description"
      :confirmText="locale === 'zh-CN' ? '确定' : 'OK'"
      hideCancel
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Globe, Activity, RefreshCw } from 'lucide-vue-next'
import request from '@/utils/request'
import Dialog from '@/components/Dialog.vue'

const { locale, t } = useI18n()
const sessions = ref<any[]>([])
const loading = ref(false)

const confirmDialogOpen = ref(false)
const sessionToRevoke = ref<string | null>(null)

const alertDialog = reactive({
  open: false,
  title: '',
  description: ''
})

const showAlert = (title: string, description: string) => {
  alertDialog.title = title
  alertDialog.description = description
  alertDialog.open = true
}

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

const triggerRevokeSession = (id: string) => {
  sessionToRevoke.value = id
  confirmDialogOpen.value = true
}

const confirmRevokeSession = async () => {
  if (!sessionToRevoke.value) return
  const id = sessionToRevoke.value
  try {
    const res: any = await request.delete(`/auth/sessions/${id}`)
    if (res.code === 0) {
      sessions.value = sessions.value.filter(s => s.id !== id)
    } else {
      showAlert(t('sessions.revokeFailed'), res.message || '')
    }
  } catch (error) {
    showAlert(t('sessions.revokeFailed'), '')
  } finally {
    sessionToRevoke.value = null
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
