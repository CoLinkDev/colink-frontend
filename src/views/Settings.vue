<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold tracking-tight">{{ $t('settings.title') }}</h3>
      <p class="text-muted-foreground text-sm mt-1">{{ $t('settings.subtitle') }}</p>
    </div>

    <div class="max-w-xl">
      <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
            <Key class="w-5 h-5" />
          </div>
          <h4 class="text-lg font-medium">{{ $t('settings.changePassword') }}</h4>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">{{ $t('settings.currentPassword') }}</label>
            <input 
              v-model="pwdForm.oldPassword" 
              type="password" 
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">{{ $t('settings.newPassword') }}</label>
            <input 
              v-model="pwdForm.newPassword" 
              type="password" 
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">{{ $t('settings.confirmNewPassword') }}</label>
            <input 
              v-model="pwdForm.confirmPassword" 
              type="password" 
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
          </div>
          
          <button 
            type="submit" 
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2 w-full transition-colors disabled:opacity-50"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></span>
            {{ $t('settings.updatePassword') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Key } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import request from '@/utils/request'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const loading = ref(false)

const handleChangePassword = async () => {
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    alert(t('settings.passwordMismatch'))
    return
  }
  loading.value = true
  try {
    const res: any = await request.post('/auth/change-password', {
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword
    })
    if (res.code === 0) {
      alert(t('settings.passwordUpdated'))
      auth.clearToken()
      router.push('/login')
    } else {
      alert(res.message || t('settings.passwordUpdateFailed'))
    }
  } catch (error: any) {
    alert(error.response?.data?.message || t('settings.passwordUpdateFailed'))
  } finally {
    loading.value = false
  }
}
</script>
