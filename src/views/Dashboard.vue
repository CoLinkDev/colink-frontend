<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-2xl font-bold tracking-tight">{{ $t('dashboard.title') }}</h3>
        <p class="text-muted-foreground text-sm mt-1">{{ $t('dashboard.subtitle') }}</p>
      </div>
      <button @click="fetchDevices" class="p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <div v-if="loading && devices.length === 0" class="flex justify-center py-12">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="devices.length === 0" class="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-xl bg-card/50">
      <Monitor class="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
      <h4 class="text-lg font-medium">{{ $t('dashboard.noDevices') }}</h4>
      <p class="text-sm text-muted-foreground text-center max-w-sm mt-1">{{ $t('dashboard.noDevicesHint') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="device in devices" :key="device.id" class="group relative bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
              <Smartphone v-if="device.platform === 'android' || device.platform === 'ios'" class="w-5 h-5" />
              <Monitor v-else class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-medium truncate max-w-[150px]">{{ device.name || $t('dashboard.unnamedDevice') }}</h4>
              <p class="text-xs text-muted-foreground capitalize">{{ device.platform || $t('dashboard.unknownPlatform') }}</p>
            </div>
          </div>
          <button @click="removeDevice(device.id)" class="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all" title="Remove Device">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
        
        <div class="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div class="flex items-center gap-1.5">
            <div class="w-2 h-2 rounded-full" :class="device.online ? 'bg-green-500' : 'bg-muted-foreground'"></div>
            {{ device.online ? $t('dashboard.online') : $t('dashboard.offline') }}
          </div>
          <div>{{ $t('dashboard.lastSeen') }}: {{ formatDate(device.last_seen || device.lastSeen) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Monitor, Smartphone, Trash2, RefreshCw } from 'lucide-vue-next'
import request from '@/utils/request'

const { t } = useI18n()
const devices = ref<any[]>([])
const loading = ref(false)

const fetchDevices = async () => {
  loading.value = true
  try {
    const res: any = await request.get('/devices')
    if (res.code === 0) {
      devices.value = res.data?.devices || []
    }
  } catch (error) {
    console.error('Failed to fetch devices', error)
  } finally {
    loading.value = false
  }
}

const removeDevice = async (id: string) => {
  if (!confirm(t('dashboard.removeDeviceConfirm'))) return
  try {
    const res: any = await request.delete(`/devices/${id}`)
    if (res.code === 0) {
      devices.value = devices.value.filter(d => d.id !== id)
    } else {
      alert(res.message || t('dashboard.removeDeviceFailed'))
    }
  } catch (error) {
    alert(t('dashboard.removeDeviceFailed'))
  }
}

const formatDate = (ts: number) => {
  if (!ts) return 'Never'
  return new Date(ts).toLocaleString()
}

onMounted(() => {
  fetchDevices()
})
</script>
